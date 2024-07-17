import {ResolverContext} from '../../@types/context'
import {signup} from '../services/user/signup'
import {updateUser} from '../services/user/update-profile'
import {updateUserConnection} from '../services/user/update-connection'

import {
    CheckDuplicateUserResponse,
    Resolvers,
    UpdateUserConnectionResponse,
    User,
    UserResponse
} from '../../generated/user'
import {checkUsernameIsDuplicate, getUsers} from '../services/user'

export const userResolver: Resolvers = {
    Query: {
        users: (_, __, context: ResolverContext): Promise<User[] | null> => {
            return getUsers(context)
        },
        checkDuplicateUsername: (_, {input}, context: ResolverContext): Promise<CheckDuplicateUserResponse> => {
            return checkUsernameIsDuplicate(context, input)
        }
    },
    Mutation: {
        signUp: (_, {input}, context: ResolverContext): Promise<UserResponse> => {
            return signup(context, input)
        },
        updateUser: (_, {input}, context: ResolverContext): Promise<UserResponse> => {
            return updateUser(context, input)
        },
        updateUserConnection: (_, {input}, context: ResolverContext): Promise<UpdateUserConnectionResponse> => {
            return updateUserConnection(context, input)
        }
    }
}
