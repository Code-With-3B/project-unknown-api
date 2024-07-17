import {MongoCollection} from '../../../@types/collections'
import {ResolverContext} from '../../../@types/context'
import {TeamResponseCode} from '../../../constants/auth/response-codes/team'
import {TeamsCollection} from '../../../generated/mongo-types'
import {logger} from '../../../config'
import {v4 as uuid} from 'uuid'

import {CreateTeamInput, CreateTeamResponse, Team, TeamStatus} from '../../../generated/team'
import {doesDocumentExistByField, insertDataInDB} from '../../db/utils'

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
