import {MongoCollection} from '../../../@types/collections'
import {ResolverContext} from '../../../@types/context'
import {OrgResponseCode} from '../../../constants/auth/response-codes/org'
import {logger} from '../../../config'
import {removeTeamMemberFromTeam} from '../../db/collections/team'

import {RemoveUserInput, RemoveUserResponse, TeamRole} from '../../../generated/team'
import {OrganizationCollection, TeamMembersCollection} from '../../../generated/mongo-types'
import {deleteDocumentByField, fetchDocumentByField, findSingleRecord} from '../../db/utils'

export async function removeOrg(context: ResolverContext, input: RemoveUserInput): Promise<RemoveUserResponse> {
    logger.info(`Initiating request to remove user from team`)
    try {
        if (!input.teamId) {
            logger.error('Team ID is missing')
            return {success: false, code: [OrgResponseCode.ORG_ID_MISSING]}
        }
        if (!input.whoIsRemover) {
            logger.error('Remover ID is missing')
            return {success: false, code: [OrgResponseCode.REMOVER_ID_MISSING]}
        }
        if (!input.whomToRemove) {
            logger.error('ID of user to remove is missing')
            return {success: false, code: [OrgResponseCode.USER_TO_REMOVE_ID_MISSING]}
        }

        // Check valid team
        const team = await fetchDocumentByField<OrganizationCollection>(
            context.mongodb,
            MongoCollection.ORG,
            'id',
            input.teamId
        )
        if (!team) {
            logger.error(`Team not found with id: ${input.teamId}`)
            return {success: false, code: [OrgResponseCode.INVALID_ORG_ID]}
        }

        // Check remover has access to remove other players from team
        const remover = await findSingleRecord<TeamMembersCollection>(context.mongodb, MongoCollection.ORG, {
            teamId: team.id,
            userId: input.whoIsRemover
        })
        if (!remover) {
            logger.error('Remover is not a team member')
            return {success: false, code: [OrgResponseCode.REMOVE_USER_ACCESS_DENIED]}
        }

        const removerHasOwnerOrManagerRole = remover.roles.some(
            role => role === TeamRole.Owner || role === TeamRole.Manager
        )
        if (!removerHasOwnerOrManagerRole) {
            logger.error('User other than owner or manager is trying to remove a user')
            return {success: false, code: [OrgResponseCode.REMOVE_USER_ACCESS_DENIED]}
        }

        // Check is user valid team member
        const userToRemove = await findSingleRecord<TeamMembersCollection>(
            context.mongodb,
            MongoCollection.ORG,
            {
                teamId: team.id,
                userId: input.whomToRemove
            }
        )
        if (!userToRemove) {
            logger.error(`User not found in team with id: ${input.teamId}`)
            return {success: false, code: [OrgResponseCode.USER_TO_REMOVE_NOT_IN_ORG]}
        }

        const userToRemoveIsOwner = userToRemove.roles.some(role => role === TeamRole.Owner)
        if (userToRemoveIsOwner) {
            logger.error('Cannot remove the team owner from the team')
            return {success: false, code: [OrgResponseCode.CANT_REMOVE_ORG_OWNER]}
        }

        const isRemoved = await removeTeamMemberFromTeam(context.mongodb, team.id, userToRemove.id)
        if (isRemoved) {
            await deleteDocumentByField(context.mongodb, MongoCollection.ORG, 'id', userToRemove.id)
        }

        return {
            success: isRemoved,
            code: [isRemoved ? OrgResponseCode.USER_REMOVED_SUCCESS : OrgResponseCode.USER_REMOVED_FAILED]
        }
    } catch (error) {
        logger.error(error, 'Error removing user from team')
        throw error
    }
}
