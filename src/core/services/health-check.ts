import {ErrorCode} from '../../constants/error-codes'
import {ResolverContext} from '../../@types/context'
import {logger} from '../../config'
import {verifyToken} from '../../constants/auth/utils'

import {HealthCheckInput, HealthCheckResponse} from '../../generated/graphql'

export async function getHealthCheck(context: ResolverContext, input: HealthCheckInput): Promise<HealthCheckResponse> {
    logger.info('Attempting health check')
    if (input.token && input.token.length > 0) {
        const isActive = await verifyToken(context.mongodb, input.token)
        if (isActive) {
            return {code: ErrorCode.ACTIVE_TOKEN}
        } else {
            return {code: ErrorCode.EXPIRED_TOKEN}
        }
    }
    return {code: ErrorCode.SERVER_ACTIVE}
}
