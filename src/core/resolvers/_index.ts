import {Resolvers} from '../../generated/graphql'
import {authResolver} from './auth.resolver'
import {healthResolver} from './health.resolver'
import {highlightResolver} from './highlight.resolver'
import {mergeResolvers} from '@graphql-tools/merge'
import {uploadUrlResolver} from './upload.request.resolver'
import {userResolver} from './user.resolver'

export const resolvers: Resolvers = mergeResolvers([
    authResolver,
    userResolver,
    highlightResolver,
    uploadUrlResolver,
    healthResolver
])
