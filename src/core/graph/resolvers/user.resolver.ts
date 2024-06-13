import {ResolverContext} from '../../../@types/context'

import {CheckDuplicateUserResponse, Resolvers, SignInResponse, User, UserResponse} from '../../../generated/graphql'
import {checkUsernameIsDuplicate, getUsers, signIn, signup, updateUser} from '../services/user.service'

export const userResolver: Resolvers = {
    Query: {
        users: (_, __, context: ResolverContext): Promise<User[] | null> => {
            return getUsers(context)
        },
        checkDuplicate: (_, {input}, context: ResolverContext): Promise<CheckDuplicateUserResponse> => {
            return checkUsernameIsDuplicate(context, input)
        }
    },
    Mutation: {
        signUp: (_, {input}, context: ResolverContext): Promise<UserResponse> => {
            return signup(context, input)
        },
        signIn: (_, {input}, context: ResolverContext): Promise<SignInResponse> => {
            return signIn(context, input)
        },
        updateUser: (_, {input}, context: ResolverContext): Promise<UserResponse> => {
            return updateUser(context, input)
        }
    }
}
