import {MongoCollection} from '../../../@types/collections'
import {ResolverContext} from '../../../@types/context'
import {TeamInvitationsCollection} from '../../../generated/mongo-types'
import {TeamResponseCode} from '../../../constants/auth/response-codes/team'
import {logger} from '../../../config'
import {updateTeamMemberInTeam} from '../../db/collections/team'
import {v4 as uuid} from 'uuid'

import {
    AcceptTeamInvitationInput,
    AcceptTeamInvitationResponse,
    AllTeamInvitationsInput,
    AllTeamInvitationsResponse,
    TeamInvitation,
    TeamInvitationStatus
} from '../../../generated/team'
import {SendTeamInvitationInput, SendTeamInvitationResponse, TeamRole} from '../../../generated/team'
import {
    deleteDocumentByField,
    doesDocumentExistByField,
    fetchDocumentByField,
    fetchRelationalData,
    insertDataInDB,
    updateDataInDBWithoutReturn
} from '../../db/utils'
import {fetchLatestTeamInvitation, upsertTeamMember} from '../../db/collections/team-invitation'
import {generateTokenForInvitation, verifyInvitationToken} from '../../../constants/auth/utils'

export async function getAllInvitation(
    context: ResolverContext,
    input: AllTeamInvitationsInput
): Promise<AllTeamInvitationsResponse> {
    try {
        logger.info(`Fetching all team invitations ${context.mongodb.databaseName} ${JSON.stringify(input)}`)

        if (input.invitedUserId) {
            if (
                !(await doesDocumentExistByField(context.mongodb, MongoCollection.TEAM_INVITATION, {
                    sendTo: input.invitedUserId
                }))
            ) {
                return {success: false, code: [TeamResponseCode.INVITED_USER_ID_MISSING]}
            }
        } else {
            logger.info(`Invited user id is missing`)
            return {success: false, code: [TeamResponseCode.INVITED_USER_ID_MISSING]}
        }

        const invitations: TeamInvitation[] = await fetchRelationalData<TeamInvitation>(
            context.mongodb,
            MongoCollection.TEAM_INVITATION,
            {
                sendTo: input.invitedUserId
            }
        )

        return {
            success: !!invitations,
            code: [invitations ? TeamResponseCode.INVITATIONS_FETCHED : TeamResponseCode.INVITATIONS_FETCHING_FAILED],
            invitations: invitations
        }
    } catch (error) {
        logger.error(error, 'Error fetching all invitations')
        logger.error(error)
        throw error
    }
}

export async function sendTeamInvitation(
    context: ResolverContext,
    input: SendTeamInvitationInput
): Promise<SendTeamInvitationResponse> {
    logger.info(input, 'Inviting player to team')
    const errorCode = []
    try {
        if (input.teamId) {
            if (!(await doesDocumentExistByField(context.mongodb, MongoCollection.TEAM, {id: input.teamId}))) {
                errorCode.push(TeamResponseCode.INVALID_TEAM_ID)
            }
        } else errorCode.push(TeamResponseCode.INVALID_TEAM_ID)
        if (input.sendBy) {
            if (!(await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {id: input.sendBy}))) {
                errorCode.push(TeamResponseCode.INVALID_SENDER_ID)
            }
        } else errorCode.push(TeamResponseCode.INVALID_SENDER_ID)
        if (input.sendTo) {
            if (!(await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {id: input.sendTo}))) {
                errorCode.push(TeamResponseCode.INVALID_RECEIVER_ID)
            }
        } else errorCode.push(TeamResponseCode.INVALID_RECEIVER_ID)
        if (!input.expiration) {
            errorCode.push(TeamResponseCode.INVALID_RECEIVER_ID)
        }
        const validRoles = Object.values(TeamRole)
        if (input.roles && Array.isArray(input.roles)) {
            const invalidRoles = input.roles.filter(role => !validRoles.includes(role))
            if (invalidRoles.length > 0) {
                errorCode.push(TeamResponseCode.INVALID_ROLE)
            }
        } else {
            errorCode.push(TeamResponseCode.INVALID_ROLE)
        }

        if (errorCode.length > 0) {
            logger.error(errorCode, 'Error inviting player to team')
            return {success: false, code: errorCode}
        }

        const invitation = await fetchLatestTeamInvitation(context.mongodb, input.teamId, input.sendTo, input.roles)

        logger.info(`Invitation : ${JSON.stringify(invitation)}`)

        if (invitation) {
            const isLive = verifyInvitationToken(invitation.expiration)
            if (isLive) {
                logger.error('Duplicate invitation detected')
                return {success: false, code: [TeamResponseCode.DUPLICATE_INVITATION]}
            }
        }

        const document: TeamInvitationsCollection = {
            ...input,
            id: uuid(),
            status: TeamInvitationStatus.Sent,
            expiration: generateTokenForInvitation(input.expiration),
            createdAt: new Date().toISOString()
        }

        const result = await insertDataInDB<TeamInvitationsCollection, TeamInvitation>(
            context.mongodb,
            MongoCollection.TEAM_INVITATION,
            document
        )

        return {
            success: !!result,
            code: [result ? TeamResponseCode.INVITATION_SENT : TeamResponseCode.INVITATION_FAILED],
            invitation: result
        }
    } catch (error) {
        logger.error(error, 'Error inviting player to team')
        throw error
    }
}

export async function acceptTeamInvitation(
    context: ResolverContext,
    input: AcceptTeamInvitationInput
): Promise<AcceptTeamInvitationResponse> {
    try {
        logger.info(`Accepting invitation ${context.mongodb.databaseName} ${JSON.stringify(input)}`)

        if (!input.invitationId) {
            logger.error(`Invitation id is missing`)
            return {success: false, code: [TeamResponseCode.INVITATION_ID_MISSING]}
        }
        const invitation = await fetchDocumentByField<TeamInvitationsCollection>(
            context.mongodb,
            MongoCollection.TEAM_INVITATION,
            'id',
            input.invitationId
        )

        logger.error(`Invitation details ${JSON.stringify(invitation)}`)

        if (!invitation || !invitation.expiration || invitation.status != TeamInvitationStatus.Sent) {
            return {success: false, code: [TeamResponseCode.INVITATION_NOT_FOUND]}
        }
        const isLive = verifyInvitationToken(invitation.expiration)
        if (!isLive) {
            return {success: false, code: [TeamResponseCode.INVITATION_EXPIRED]}
        }

        const updateFields: Partial<TeamInvitationsCollection> = {}
        updateFields.status = input.status
        updateFields.updatedAt = new Date().toISOString()
        if (input.status === TeamInvitationStatus.Accepted) {
            const isValidUpdate = await updateDataInDBWithoutReturn<TeamInvitationsCollection>(
                context.mongodb,
                MongoCollection.TEAM_INVITATION,
                invitation.id,
                updateFields
            )
            if (isValidUpdate) {
                const updateFields2: Partial<TeamInvitationsCollection> = {}
                updateFields2.status = input.status
                updateFields2.updatedAt = new Date().toISOString()
                const teamMember = {
                    userId: invitation.sendTo,
                    role: invitation.roles
                }

                const newMember = await upsertTeamMember(
                    context.mongodb,
                    {
                        userId: teamMember.userId,
                        teamId: invitation.teamId
                    },
                    teamMember
                )

                if (newMember) {
                    logger.error(`Team id for new member already exists ${invitation.team}`)
                    await updateTeamMemberInTeam(context.mongodb, invitation.teamId, newMember)
                    await deleteDocumentByField(context.mongodb, MongoCollection.TEAM_INVITATION, 'id', invitation.id)
                    return {success: !!newMember}
                }
            }
        } else {
            const isValidUpdate = await updateDataInDBWithoutReturn<TeamInvitationsCollection>(
                context.mongodb,
                MongoCollection.TEAM_INVITATION,
                invitation.id,
                updateFields
            )
            await deleteDocumentByField(context.mongodb, MongoCollection.TEAM_INVITATION, 'id', invitation.id)
            return {success: isValidUpdate}
        }
        return {success: false}
    } catch (error) {
        logger.error(error, 'Error accepting team invitation')
        throw error
    }
}
