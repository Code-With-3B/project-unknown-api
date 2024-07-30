import {ResolverContext} from '../../@types/context'
import {acceptTeamInvitation} from '../services/team/invitation/accept-invitation'
import {createTeam} from '../services/team/create-team'
import {getAllInvitation} from '../services/team/list-users'
import {rejectTeamInvitation} from '../services/team/invitation/reject-invitation'
import {sendTeamInvitation} from '../services/team/invitation/send-invitation'
import {withdrawTeamInvitation} from '../services/team/invitation/withdraw-invitation'

import {
    AcceptTeamInvitationResponse,
    AllTeamInvitationsResponse,
    CreateTeamResponse,
    RejectTeamInvitationResponse,
    Resolvers,
    SendTeamInvitationResponse,
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
        }
    }
}
