import {ResolverContext} from '../../@types/context'

import {
    AcceptTeamInvitationResponse,
    AllTeamInvitationsResponse,
    CreateTeamResponse,
    DeleteTeamResponse,
    Resolvers,
    SendTeamInvitationResponse
} from '../../generated/team'
import {acceptTeamInvitation, getAllInvitation, sendTeamInvitation} from '../services/team/invite-player'
import {createTeam, deleteTeam} from '../services/team/create-team'

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
        deleteTeam: (_, {input}, context: ResolverContext): Promise<DeleteTeamResponse> => {
            return deleteTeam(context, input)
        },
        sendTeamInvitation: (_, {input}, context: ResolverContext): Promise<SendTeamInvitationResponse> => {
            return sendTeamInvitation(context, input)
        },
        acceptTeamInvitation: (_, {input}, context: ResolverContext): Promise<AcceptTeamInvitationResponse> => {
            return acceptTeamInvitation(context, input)
        }
    }
}
