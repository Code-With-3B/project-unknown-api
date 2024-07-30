import {MongoCollection} from '../../../../@types/collections'
import {ResolverContext} from '../../../../@types/context'
import {TeamInvitationsCollection} from '../../../../generated/mongo-types'
import {TeamResponseCode} from '../../../../constants/auth/response-codes/team'
import {logger} from '../../../../config'
import {verifyInvitationToken} from '../../../../constants/auth/utils'

import {RejectTeamInvitationInput, RejectTeamInvitationResponse, TeamInvitationStatus} from '../../../../generated/team'
import {fetchDocumentByField, updateSingleFieldInDB} from '../../../db/utils'

export async function rejectTeamInvitation(
    context: ResolverContext,
    input: RejectTeamInvitationInput
): Promise<RejectTeamInvitationResponse> {
    try {
        logger.info('Initiating team invitation rejection request')

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

        if (!input.whoIsRejecting) {
            logger.error('Who is rejecting is not provided')
            return {success: false, code: [TeamResponseCode.REJECTOR_ID_MISSING]}
        }

        if (input.whoIsRejecting != invitation.sendTo) {
            logger.error('Other user is trying to reject this invitation')
            return {success: false, code: [TeamResponseCode.OTHER_USER_TRYING_TO_REJECT]}
        }

        const isValidUpdate = await updateSingleFieldInDB<TeamInvitationsCollection>(
            context.mongodb,
            MongoCollection.TEAM_INVITATION,
            invitation.id,
            'status',
            TeamInvitationStatus.Rejected
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
            code: [isValidUpdate ? TeamResponseCode.INVITATION_REJECTED : TeamResponseCode.INVITATION_FAILED_TO_REJECT]
        }
    } catch (error) {
        logger.error(error, 'Error rejecting team invitation')
        throw error
    }
}
