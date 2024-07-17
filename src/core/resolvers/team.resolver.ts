import {ResolverContext} from '../../@types/context'
import {createTeam} from '../services/team/create-team'

import {CreateTeamResponse, Resolvers} from '../../generated/team'

export const teamResolver: Resolvers = {
    Mutation: {
        createTeam: (_, {input}, context: ResolverContext): Promise<CreateTeamResponse> => {
            return createTeam(context, input)
        }
    }
}
