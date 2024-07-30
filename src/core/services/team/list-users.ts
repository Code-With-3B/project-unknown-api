import {MongoCollection} from '../../../@types/collections'
import {ResolverContext} from '../../../@types/context'
import {TeamResponseCode} from '../../../constants/auth/response-codes/team'
import {logger} from '../../../config'

import {AllTeamInvitationsInput, AllTeamInvitationsResponse, TeamInvitation} from '../../../generated/team'
import {doesDocumentExistByField, fetchRelationalData} from '../../db/utils'

export async function getAllInvitation(
    context: ResolverContext,
    input: AllTeamInvitationsInput
): Promise<AllTeamInvitationsResponse> {
    try {
        logger.info(`Fetching all team invitations ${context.mongodb.databaseName} ${JSON.stringify(input)}`)

        if (input.invitedUserId) {
            if (
                !(await doesDocumentExistByField(context.mongodb, MongoCollection.TEAM_INVITATION, {
                    sendTo: input.invitedUserId
                }))
            ) {
                return {success: false, code: [TeamResponseCode.INVITED_USER_ID_MISSING]}
            }
        } else {
            logger.info(`Invited user id is missing`)
            return {success: false, code: [TeamResponseCode.INVITED_USER_ID_MISSING]}
        }

        const invitations: TeamInvitation[] = await fetchRelationalData<TeamInvitation>(
            context.mongodb,
            MongoCollection.TEAM_INVITATION,
            {
                sendTo: input.invitedUserId
            }
        )

        return {
            success: !!invitations,
            code: [invitations ? TeamResponseCode.INVITATIONS_FETCHED : TeamResponseCode.INVITATIONS_FETCHING_FAILED],
            invitations: invitations
        }
    } catch (error) {
        logger.error(error, 'Error fetching all invitations')
        logger.error(error)
        throw error
    }
}
