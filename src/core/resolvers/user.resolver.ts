import {ResolverContext} from '../../@types/context'

import {CheckDuplicateUserResponse, Resolvers, SignInResponse, User, UserResponse} from '../../generated/graphql'
import {checkUsernameIsDuplicate, createUser, getUsers, signInUser, updateUser} from '../services/user.service'

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
        createUser: (_, {input}, context: ResolverContext): Promise<UserResponse> => {
            return createUser(context, input)
        },
        signInUser: (_, {input}, context: ResolverContext): Promise<SignInResponse> => {
            return signInUser(context, input)
        },
        updateUser: (_, {input}, context: ResolverContext): Promise<UserResponse> => {
            return updateUser(context, input)
        }
    }
}
