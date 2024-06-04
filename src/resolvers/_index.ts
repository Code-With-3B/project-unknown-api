import { Resolvers } from '../graphql/generated-types'
import { customerResolver } from './customer.resolver'
import { mergeResolvers } from '@graphql-tools/merge'
import { userResolver } from './user.resolver'

export const resolvers: Resolvers = mergeResolvers([customerResolver, userResolver])
