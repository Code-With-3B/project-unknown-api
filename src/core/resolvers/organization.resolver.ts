import {ResolverContext} from '../../@types/context'
import {removeUser} from '../services/team/remove-user'

import {
    CreateOrgResponse,
    RemoveTeamResponse,
    Resolvers,
    UpdateOrgResponse,
} from '../../generated/org'
import { createOrg } from '../services/org/create-org'
import { updateOrg } from '../services/org/update-org'
import { removeOrg } from '../services/org/remove-org'

export const organizationResolver: Resolvers = {
    Mutation: {
        createOrg: (_, {input}, context: ResolverContext): Promise<CreateOrgResponse> => {
            return createOrg(context, input)
        },
        updateOrg: (_, {input}, context: ResolverContext): Promise<UpdateOrgResponse> => {
            return updateOrg(context, input)
        },
        removeOrg: (_, {input}, context: ResolverContext): Promise<RemoveTeamResponse> => {
            return removeOrg(context, input)
        }
    }
}
