import {MongoCollection} from '../../../../@types/collections'
import {ResolverContext} from '../../../../@types/context'
import {TeamInvitationsCollection} from '../../../../generated/mongo-types'
import {TeamResponseCode} from '../../../../constants/auth/response-codes/team'
import {fetchLatestTeamInvitation} from '../../../db/collections/team-invitation'
import {logger} from '../../../../config'
import {v4 as uuid} from 'uuid'

import {
    SendTeamInvitationInput,
    SendTeamInvitationResponse,
    TeamInvitation,
    TeamInvitationStatus,
    TeamRole
} from '../../../../generated/team'
import {doesDocumentExistByField, insertDataInDB} from '../../../db/utils'
import {generateTokenForInvitation, verifyInvitationToken} from '../../../../constants/auth/utils'

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
