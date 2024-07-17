import {authResolver} from './auth.resolver'
import {healthResolver} from './health.resolver'
import {highlightResolver} from './highlight.resolver'
import {mergeResolvers} from '@graphql-tools/merge'
import {teamResolver} from './team.resolver'
import {uploadUrlResolver} from './upload.request.resolver'
import {userResolver} from './user.resolver'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const resolvers: any = mergeResolvers([
    authResolver,
    userResolver,
    highlightResolver,
    uploadUrlResolver,
    healthResolver,
    teamResolver
])
