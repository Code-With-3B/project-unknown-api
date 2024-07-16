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
    fastify: {
        name: 'project unknown',
        host: parseEnv(process.env.FASTIFY_HOST, '::', stringParser),
        port: parseEnv(process.env.FASTIFY_PORT, 3000, Number)
    },
    db: {
        dbUri: parseEnv(process.env.MONGODB_CONNECTION_STRING, '', stringParser),
        db: parseEnv(process.env.MONGODB_DATABASE, '', stringParser),
        poolSize: parseEnv(process.env.DB_POOL_SIZE, 20, Number)
    },
    jwt: {
        jwtSecreteKey: parseEnv(process.env.JWT_SECRET, '', stringParser),
        jwtExpirationTime: parseEnv(process.env.TOKEN_EXPIRATION, '1d', stringParser)
    },
    media: {
        maxFileSize: parseEnv(process.env.MAX_FILE_SIZE, 48, Number),
        uploadUrlExpiration: parseEnv(process.env.UPLOAD_URL_EXPIRATION, 1800, Number)
    },
    storage: {
        region: parseEnv(process.env.CLOUDFLARE_REGION, '', stringParser),
        endpoint: parseEnv(process.env.CLOUDFLARE_ENDPOINT, '', stringParser),
        credentials: {
            accessKeyId: parseEnv(process.env.CLOUDFLARE_ACCESS_KEY_ID, '', stringParser),
            secretAccessKey: parseEnv(process.env.CLOUDFLARE_SECRETE_ACCESS_KEY, '', stringParser)
        }
    }
}

export const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})
