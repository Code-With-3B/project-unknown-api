import {MongoCollection} from '../../../@types/collections'
import {ResolverContext} from '../../../@types/context'
import {TeamResponseCode} from '../../../constants/auth/response-codes/team'
import {fetchLatestTeamInvitation} from '../../db/collections/team-invitation'
import {logger} from '../../../config'
import {v4 as uuid} from 'uuid'

import {
    CreateTeamInput,
    CreateTeamResponse,
    Team,
    TeamInvitationInput,
    TeamInvitationResponse,
    TeamRole,
    TeamStatus
} from '../../../generated/team'
import {TeamInvitation, TeamInvitationStatus} from './../../../generated/team'
import {TeamInvitationsCollection, TeamsCollection} from '../../../generated/mongo-types'
import {doesDocumentExistByField, insertDataInDB} from '../../db/utils'
import {generateTokenForInvitation, verifyInvitationToken} from '../../../constants/auth/utils'

export async function createTeam(context: ResolverContext, input: CreateTeamInput): Promise<CreateTeamResponse> {
    try {
        logger.info(input, `Creating team for userId ${input.ownerId}`)

        const errorCodes = []

        if (!input.name || input.name.trim().length < 4) errorCodes.push(TeamResponseCode.INVALID_TEAM_NAME)
        else if (await doesDocumentExistByField(context.mongodb, MongoCollection.TEAM, {name: input.name}))
            errorCodes.push(TeamResponseCode.DUPLICATE_TEAM_NAME)

        if (!input.game || input.game.length < 2) errorCodes.push(TeamResponseCode.INVALID_GAME_NAME)

        if (!input.description) errorCodes.push(TeamResponseCode.INVALID_TEAM_DESCRIPTION)
        if (
            !input.ownerId ||
            input.ownerId.length == 0 ||
            !(await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {id: input.ownerId}))
        ) {
            errorCodes.push(TeamResponseCode.INVALID_OWNER_ID)
        }

        if (errorCodes.length > 0) {
            logger.error(errorCodes, 'Error creating team')
            return {success: false, code: errorCodes}
        }

        const document: TeamsCollection = {
            ...input,
            id: uuid(),
            status: TeamStatus.Private,
            createdAt: new Date().toISOString()
        }

        const result = await insertDataInDB<TeamsCollection, Team>(context.mongodb, MongoCollection.TEAM, document)
        logger.info(`Team creation ${result ? 'Success' : 'Failed'}`)
        return {
            success: !!result,
            code: [result ? TeamResponseCode.TEAM_CREATION_SUCCESS : TeamResponseCode.TEAM_CREATION_FAILED],
            team: result
        }
    } catch (error) {
        logger.error(error, 'Error creating team')
        logger.error(error)
        throw error
    }
}

export async function invitePlayer(
    context: ResolverContext,
    input: TeamInvitationInput
): Promise<TeamInvitationResponse> {
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
        logger.error(error)
        throw error
    }
}
