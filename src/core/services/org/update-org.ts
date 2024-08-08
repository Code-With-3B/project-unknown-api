import {MongoCollection} from '../../../@types/collections'
import {ResolverContext} from '../../../@types/context'
import {OrgResponseCode} from '../../../constants/auth/response-codes/org'
import {OrganizationCollection} from '../../../generated/mongo-types'
import {logger} from '../../../config'

import {UpdateOrgInput, UpdateOrgResponse} from '../../../generated/org'
import {fetchDocumentByField, updateDataInDBWithoutReturn} from '../../db/utils'

export async function updateOrg(context: ResolverContext, input: UpdateOrgInput): Promise<UpdateOrgResponse> {
    try {
        logger.info('Initiating organization update')

        const team = await fetchDocumentByField<OrganizationCollection>(context.mongodb, MongoCollection.ORG, 'id', input.id)
        if (!team) {
            logger.error(`Organization not found with id: ${input.id}`)
            return {success: false, code: [OrgResponseCode.INVALID_ORG_ID]}
        }

        const updateFields: Partial<OrganizationCollection> = {}

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
            const isValidUpdate = await updateDataInDBWithoutReturn<OrganizationCollection>(
                context.mongodb,
                MongoCollection.TEAM,
                team.id,
                updateFields
            )

            if (isValidUpdate) {
                logger.info(`Organization update successful for teamID: ${input.id}`)
            } else {
                logger.error(`Organization update failed for teamID: ${input.id}`)
            }
            return {
                success: isValidUpdate,
                code: [isValidUpdate ? OrgResponseCode.ORG_UPDATING_SUCCESS : OrgResponseCode.ORG_UPDATING_FAILED]
            }
        }

        // No fields to update
        logger.info(`No fields to update for userID: ${input.id}`)
        return {
            success: false,
            code: [OrgResponseCode.NO_FIELDS_TO_UPDATE]
        }
    } catch (error) {
        logger.error(error, 'Error updating organization')
        throw error
    }
}
