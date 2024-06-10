import {FastifyInstance} from 'fastify'
import dbConnector from './mongodb-plugin'
import fastifyMultipart from '@fastify/multipart'
import {registerRoutes} from '../core/rest'

import fp, {PluginMetadata} from 'fastify-plugin'

export const restApiPlugin = fp(
    async (fastify: FastifyInstance): Promise<void> => {
        fastify.register(dbConnector)
        fastify.register(fastifyMultipart)
        fastify.register(registerRoutes)
    },
    {
        name: 'restApiPlugin',
        dependencies: []
    } as PluginMetadata
)
