import {ResolverContext} from '../../@types/context'
import {acceptTeamInvitation} from '../services/team/invitation/accept-invitation'
import {createTeam} from '../services/team/create-team'
import {getAllInvitation} from '../services/team/list-users'
import {rejectTeamInvitation} from '../services/team/invitation/reject-invitation'
import {removeUser} from '../services/team/remove-user'
import {sendTeamInvitation} from '../services/team/invitation/send-invitation'
import {transferOwnership} from '../services/team/transfer-ownership'
import {updateTeam} from '../services/team/update-team'
import {withdrawTeamInvitation} from '../services/team/invitation/withdraw-invitation'

import {
    AcceptTeamInvitationResponse,
    AllTeamInvitationsResponse,
    CreateTeamResponse,
    RejectTeamInvitationResponse,
    RemoveUserResponse,
    Resolvers,
    SendTeamInvitationResponse,
    TransferTeamOwnershipResponse,
    UpdateTeamResponse,
    WithdrawTeamInvitationResponse
} from '../../generated/team'

export const teamResolver: Resolvers = {
    Query: {
        getAllTeamInvitations: (_, {input}, context: ResolverContext): Promise<AllTeamInvitationsResponse> => {
            return getAllInvitation(context, input)
        }
    },
    Mutation: {
        createTeam: (_, {input}, context: ResolverContext): Promise<CreateTeamResponse> => {
            return createTeam(context, input)
        },
        updateTeam: (_, {input}, context: ResolverContext): Promise<UpdateTeamResponse> => {
            return updateTeam(context, input)
        },
        sendTeamInvitation: (_, {input}, context: ResolverContext): Promise<SendTeamInvitationResponse> => {
            return sendTeamInvitation(context, input)
        },
        acceptTeamInvitation: (_, {input}, context: ResolverContext): Promise<AcceptTeamInvitationResponse> => {
            return acceptTeamInvitation(context, input)
        },
        rejectTeamInvitation: (_, {input}, context: ResolverContext): Promise<RejectTeamInvitationResponse> => {
            return rejectTeamInvitation(context, input)
        },
        withdrawTeamInvitation: (_, {input}, context: ResolverContext): Promise<WithdrawTeamInvitationResponse> => {
            return withdrawTeamInvitation(context, input)
        },
        removeUser: (_, {input}, context: ResolverContext): Promise<RemoveUserResponse> => {
            return removeUser(context, input)
        },
        transferTeamOwnership: (_, {input}, context: ResolverContext): Promise<TransferTeamOwnershipResponse> => {
            return transferOwnership(context, input)
        }
    }
}
