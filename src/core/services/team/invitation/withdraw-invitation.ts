import {MongoCollection} from '../../../../@types/collections'
import {ResolverContext} from '../../../../@types/context'
import {TeamResponseCode} from '../../../../constants/auth/response-codes/team'
import {logger} from '../../../../config'
import {verifyInvitationToken} from '../../../../constants/auth/utils'

import {
    TeamInvitationStatus,
    TeamRole,
    WithdrawTeamInvitationInput,
    WithdrawTeamInvitationResponse
} from '../../../../generated/team'
import {TeamInvitationsCollection, TeamMembersCollection} from '../../../../generated/mongo-types'
import {fetchDocumentByField, findSingleRecord, updateSingleFieldInDB} from '../../../db/utils'

export async function withdrawTeamInvitation(
    context: ResolverContext,
    input: WithdrawTeamInvitationInput
): Promise<WithdrawTeamInvitationResponse> {
    try {
        logger.info('Initiating team invitation withdrawing request')

        if (!input.invitationId) {
            logger.error('Invitation ID is not provided')
            return {success: false, code: [TeamResponseCode.INVITATION_ID_MISSING]}
        }

        const invitation = await fetchDocumentByField<TeamInvitationsCollection>(
            context.mongodb,
            MongoCollection.TEAM_INVITATION,
            'id',
            input.invitationId
        )

        if (!invitation || invitation.status != TeamInvitationStatus.Sent) {
            logger.error('Invitation expired or removed')
            return {success: false, code: [TeamResponseCode.INVITATION_EXPIRED]}
        }

        if (invitation && invitation.expiration) {
            const isLive = verifyInvitationToken(invitation.expiration)
            if (!isLive) {
                logger.error('Invitation expired or removed')
                return {success: false, code: [TeamResponseCode.INVITATION_EXPIRED]}
            }
        }

        if (!input.whoIsWithdrawing) {
            logger.error('Who is wWithdrawing is not provided')
            return {success: false, code: [TeamResponseCode.REJECTOR_ID_MISSING]}
        }

        // Check if whoIsWithdrawing is must be owner or manager of the team
        // Others are not allowed to withdraw request
        const members = await findSingleRecord<TeamMembersCollection>(context.mongodb, MongoCollection.TEAM_MEMBER, {
            teamId: invitation.teamId,
            userId: input.whoIsWithdrawing
        })

        if (members) {
            const hasOwnerOrManager = members.role.some(member => {
                return member === TeamRole.Owner || member === TeamRole.Manager
            })
            if (!hasOwnerOrManager) {
                logger.error('Other user is trying to withdraw this invitation')
                return {success: false, code: [TeamResponseCode.INVITATION_WITHDRAW_ACCESS_DENIED]}
            }
        } else {
            logger.error('Other user is trying to withdraw this invitation')
            return {success: false, code: [TeamResponseCode.INVITATION_WITHDRAW_ACCESS_DENIED]}
        }

        const isValidUpdate = await updateSingleFieldInDB<TeamInvitationsCollection>(
            context.mongodb,
            MongoCollection.TEAM_INVITATION,
            invitation.id,
            'status',
            TeamInvitationStatus.Withdrawn
        )
        await updateSingleFieldInDB<TeamInvitationsCollection>(
            context.mongodb,
            MongoCollection.TEAM_INVITATION,
            invitation.id,
            'updatedAt',
            new Date().toISOString()
        )
        return {
            success: isValidUpdate,
            code: [
                isValidUpdate ? TeamResponseCode.INVITATION_WITHDRAWN : TeamResponseCode.INVITATION_FAILED_TO_WITHDRAW
            ]
        }
    } catch (error) {
        logger.error(error, 'Error rejecting team invitation')
        throw error
    }
}
