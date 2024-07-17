import {ResolverContext} from '../../@types/context'
import {getHealthCheck} from '../services/health-check'

import {HealthCheckResponse, Resolvers} from '../../generated/health'

export const healthResolver: Resolvers = {
    Query: {
        healthCheck: (_, {input}, context: ResolverContext): Promise<HealthCheckResponse> => {
            return getHealthCheck(context, input)
        }
    }
}
