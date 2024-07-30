import {MongoCollection} from '../../../@types/collections'
import {ResolverContext} from '../../../@types/context'
import {TeamResponseCode} from '../../../constants/auth/response-codes/team'
import {TeamsCollection} from '../../../generated/mongo-types'
import {logger} from '../../../config'

import {UpdateTeamInput, UpdateTeamResponse} from '../../../generated/team'
import {fetchDocumentByField, updateDataInDBWithoutReturn} from '../../db/utils'

export async function updateTeam(context: ResolverContext, input: UpdateTeamInput): Promise<UpdateTeamResponse> {
    try {
        logger.info('Initiating team update')

        const team = await fetchDocumentByField<TeamsCollection>(context.mongodb, MongoCollection.TEAM, 'id', input.id)
        if (!team) {
            logger.error(`Team not found with id: ${input.id}`)
            return {success: false, code: [TeamResponseCode.INVALID_TEAM_ID]}
        }

        const updateFields: Partial<TeamsCollection> = {}

        if (input.name && input.name != team.name) updateFields.name = input.name
        if (input.description && input.description != team.description) updateFields.description = input.description
        if (input.game && input.game != team.game) updateFields.game = input.game
        if (input.teamProfilePicture && input.teamProfilePicture != team.teamProfilePicture)
            updateFields.teamProfilePicture = input.teamProfilePicture
        if (input.teamBannerPicture && input.teamBannerPicture != team.teamBannerPicture)
            updateFields.teamBannerPicture = input.teamBannerPicture
        if (input.status && input.status != team.status) updateFields.status = input.status

        if (Object.keys(updateFields).length > 0) {
            updateFields.updatedAt = new Date().toISOString()
            const isValidUpdate = await updateDataInDBWithoutReturn<TeamsCollection>(
                context.mongodb,
                MongoCollection.TEAM,
                team.id,
                updateFields
            )

            if (isValidUpdate) {
                logger.info(`Team update successful for teamID: ${input.id}`)
            } else {
                logger.error(`Team update failed for teamID: ${input.id}`)
            }
            return {
                success: isValidUpdate,
                code: [isValidUpdate ? TeamResponseCode.TEAM_UPDATING_SUCCESS : TeamResponseCode.TEAM_UPDATING_FAILED]
            }
        }

        // No fields to update
        logger.info(`No fields to update for userID: ${input.id}`)
        return {
            success: false,
            code: [TeamResponseCode.NO_FIELDS_TO_UPDATE]
        }
    } catch (error) {
        logger.error(error, 'Error updating team')
        throw error
    }
}
