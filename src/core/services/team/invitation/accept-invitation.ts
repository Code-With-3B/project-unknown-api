import {MongoCollection} from '../../../../@types/collections'
import {ResolverContext} from '../../../../@types/context'
import {TeamInvitationsCollection} from '../../../../generated/mongo-types'
import {TeamResponseCode} from '../../../../constants/auth/response-codes/team'
import {logger} from '../../../../config'
import {updateTeamMemberInTeam} from '../../../db/collections/team'
import {upsertTeamMember} from '../../../db/collections/team-invitation'
import {verifyInvitationToken} from '../../../../constants/auth/utils'

import {AcceptTeamInvitationInput, AcceptTeamInvitationResponse, TeamInvitationStatus} from '../../../../generated/team'
import {fetchDocumentByField, updateSingleFieldInDB} from '../../../db/utils'

export async function acceptTeamInvitation(
    context: ResolverContext,
    input: AcceptTeamInvitationInput
): Promise<AcceptTeamInvitationResponse> {
    try {
        logger.info('Initiating team invitation accepting request')

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

        if (!input.whoIsAccepting) {
            logger.error('Who is rejecting is not provided')
            return {success: false, code: [TeamResponseCode.REJECTOR_ID_MISSING]}
        }

        if (input.whoIsAccepting != invitation.sendTo) {
            logger.error('Other user is trying to accept this invitation')
            return {success: false, code: [TeamResponseCode.OTHER_USER_TRYING_TO_ACCEPT]}
        }

        const isValidUpdate = await updateSingleFieldInDB<TeamInvitationsCollection>(
            context.mongodb,
            MongoCollection.TEAM_INVITATION,
            invitation.id,
            'status',
            TeamInvitationStatus.Accepted
        )
        await updateSingleFieldInDB<TeamInvitationsCollection>(
            context.mongodb,
            MongoCollection.TEAM_INVITATION,
            invitation.id,
            'updatedAt',
            new Date().toISOString()
        )

        if (isValidUpdate) {
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
                return {
                    success: true,
                    code: [TeamResponseCode.INVITATION_ACCEPTED]
                }
            }
        }
        return {
            success: false,
            code: [TeamResponseCode.INVITATION_FAILED_TO_ACCEPT]
        }
    } catch (error) {
        logger.error(error, 'Error rejecting team invitation')
        throw error
    }
}
