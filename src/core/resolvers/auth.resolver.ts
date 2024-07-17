import {ResolverContext} from '../../@types/context'
import {signIn} from '../services/user/signin'

import {Resolvers, SignInResponse} from '../../generated/sign-in'

export const authResolver: Resolvers = {
    Mutation: {
        signIn: (_, {input}, context: ResolverContext): Promise<SignInResponse> => {
            return signIn(context, input)
        }
    }
}
