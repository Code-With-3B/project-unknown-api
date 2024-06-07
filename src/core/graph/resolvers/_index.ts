import {Resolvers} from '../../../generated/graphql'
import {mergeResolvers} from '@graphql-tools/merge'
import {userResolver} from './user.resolver'

export const resolvers: Resolvers = mergeResolvers([userResolver])
