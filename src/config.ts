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
    port: parseEnv(process.env.FASTIFY_PORT, 3000, Number)
}

export const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})
