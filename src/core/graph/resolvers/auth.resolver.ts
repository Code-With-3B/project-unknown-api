import {ResolverContext} from '../../../@types/context'
import {signIn} from '../services/user/signin'
import {signup} from '../services/user/signup'

import {Resolvers, SignInResponse, UserResponse} from '../../../generated/graphql'

export const authResolver: Resolvers = {
    Mutation: {
        signUp: (_, {input}, context: ResolverContext): Promise<UserResponse> => {
            return signup(context, input)
        },
        signIn: (_, {input}, context: ResolverContext): Promise<SignInResponse> => {
            return signIn(context, input)
        }
    }
}
