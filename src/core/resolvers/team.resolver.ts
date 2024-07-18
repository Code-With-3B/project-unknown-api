import {ResolverContext} from '../../@types/context'

import {CreateTeamResponse, Resolvers, TeamInvitationResponse} from '../../generated/team'
import {createTeam, invitePlayer} from '../services/team/create-team'

export const teamResolver: Resolvers = {
    Mutation: {
        createTeam: (_, {input}, context: ResolverContext): Promise<CreateTeamResponse> => {
            return createTeam(context, input)
        },
        invitePlayer: (_, {input}, context: ResolverContext): Promise<TeamInvitationResponse> => {
            return invitePlayer(context, input)
        }
    }
}
