import {ErrorCode} from '../../constants/error-codes'
import {ResolverContext} from '../../@types/context'
import jwt from 'jsonwebtoken'
import {verifyToken} from '../../constants/auth/utils'

import {HealthCheckInput, HealthCheckResponse} from '../../generated/graphql'
import {logger, serverConfig} from '../../config'

export async function getHealthCheck(context: ResolverContext, input: HealthCheckInput): Promise<HealthCheckResponse> {
    logger.info('Attempting health check')
    if (input.token && input.token.length > 0) {
        const isActive = await verifyToken(context.mongodb, input.token)
        logger.info(`Attempting health check is active ${isActive}`)
        if (isActive) {
            const result = jwt.verify(input.token, serverConfig.jwt.jwtSecreteKey)
            logger.info(`Attempting health check is active ${JSON.stringify(result)}`)
            return {code: ErrorCode.ACTIVE_TOKEN}
        } else {
            return {code: ErrorCode.EXPIRED_TOKEN}
        }
    }
    return {code: ErrorCode.SERVER_ACTIVE}
}
