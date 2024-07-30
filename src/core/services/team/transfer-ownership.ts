import {MongoCollection} from '../../../@types/collections'
import {ResolverContext} from './../../../@types/context'
import {TeamResponseCode} from '../../../constants/auth/response-codes/team'
import {logger} from '../../../config'
import {upsertTeamMember} from '../../db/collections/team-invitation'

import {TeamMembersCollection, TeamsCollection} from '../../../generated/mongo-types'
import {TeamRole, TransferTeamOwnershipInput, TransferTeamOwnershipResponse} from '../../../generated/team'
import {fetchDocumentByField, findSingleRecord} from '../../db/utils'
import {removeOwnerRoleFromTeamMember, updateTeamMemberInTeam} from '../../db/collections/team'

export async function transferOwnership(
    context: ResolverContext,
    input: TransferTeamOwnershipInput
): Promise<TransferTeamOwnershipResponse> {
    logger.info('Initiating request for team ownership transfer')
    try {
        // Not empty checks
        if (!input.teamId) {
            logger.error('Team ID is missing')
            return {success: false, code: [TeamResponseCode.TEAM_ID_MISSING]}
        }
        if (!input.oldOwnerId) {
            logger.error('Old owner ID is missing')
            return {success: false, code: [TeamResponseCode.CURRENT_OWNER_ID_MISSING]}
        }
        if (!input.newOwnerId) {
            logger.error('New owner ID is missing')
            return {success: false, code: [TeamResponseCode.NEW_OWNER_ID_MISSING]}
        }

        // Check team id is valid
        const team = await fetchDocumentByField<TeamsCollection>(
            context.mongodb,
            MongoCollection.TEAM,
            'id',
            input.teamId
        )
        if (!team) {
            logger.error(`Team not found with id: ${input.teamId}`)
            return {success: false, code: [TeamResponseCode.INVALID_TEAM_ID]}
        }

        // Check that the old owner is the current owner, i.e, there will be only one owner at a time
        const currentOwner = await findSingleRecord<TeamMembersCollection>(
            context.mongodb,
            MongoCollection.TEAM_MEMBER,
            {
                teamId: input.teamId,
                userId: input.oldOwnerId
            }
        )

        if (currentOwner) {
            const hasOwnerOrManager = currentOwner.roles.some(role => {
                return role === TeamRole.Owner
            })
            if (!hasOwnerOrManager) {
                logger.error('Only owner can transfer team ownership')
                return {success: false, code: [TeamResponseCode.USER_SHOULD_BE_OWNER_TO_TRANSFER_OWNERSHIP]}
            }
        } else {
            logger.error('Other user is trying to withdraw this invitation')
            return {success: false, code: [TeamResponseCode.CURRENT_OWNER_ID_INVALID]}
        }

        // Check if new owner is in the team or not
        const newOwner = await findSingleRecord<TeamMembersCollection>(context.mongodb, MongoCollection.TEAM_MEMBER, {
            teamId: input.teamId,
            userId: input.newOwnerId
        })
        if (!newOwner) {
            logger.error(`User should be in the team`)
            return {success: false, code: [TeamResponseCode.NEW_OWNER_SHOULD_BE_IN_TEAM]}
        }

        const isValidUpdate = await removeOwnerRoleFromTeamMember(context.mongodb, currentOwner.id)
        if (isValidUpdate) {
            logger.info(`Owner remove from user ${currentOwner.id}`)
            const teamMember = {
                userId: input.newOwnerId,
                role: [TeamRole.Owner]
            }

            const newMember = await upsertTeamMember(
                context.mongodb,
                {
                    userId: teamMember.userId,
                    teamId: input.teamId
                },
                teamMember
            )
            if (newMember) {
                await updateTeamMemberInTeam(context.mongodb, input.teamId, newMember)
                return {
                    success: true,
                    code: [TeamResponseCode.OWNERSHIP_TRANSFER_SUCCESS]
                }
            }
        }
        return {
            success: false,
            code: [TeamResponseCode.OWNERSHIP_TRANSFER_FAILED]
        }
    } catch (error) {
        logger.error(error, 'Error transferring team ownership')
        throw error
    }
}
