import {isNil} from 'ramda'
import pino from 'pino'

export const parseEnv = <T>(envValue: string | undefined, defaultValue: T, parser: (value: string) => T): T => {
    if (envValue) {
        const parsedValue = parser(envValue)
        if (!isNil(parsedValue)) return parsedValue
    }
    return defaultValue
}

export const stringParser = (value: string): string => value

export const serverConfig = {
    name: 'project unknown',
    host: parseEnv(process.env.FASTIFY_HOST, '::', stringParser),
    port: parseEnv(process.env.FASTIFY_PORT, 3000, Number),
    dbUri: parseEnv(process.env.MONGODB_URI, '', stringParser),
    db: parseEnv(process.env.MONGODB_DATABASE, 'project-unknown', stringParser),
    poolSize: parseEnv(process.env.DB_POOL_SIZE, 20, Number),
    jwtSecreteKey: parseEnv(process.env.JWT_SECRET, '', stringParser),
    jwtExpirationTime: parseEnv(process.env.TOKEN_EXPIRATION, '1d', stringParser),
    defaultPassword: parseEnv(process.env.DEFAULT_PASSWORD, '123', stringParser)
}

export const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})
