import {FastifyInstance} from 'fastify'

import fp, {PluginMetadata} from 'fastify-plugin'
import {healthCheck, uploadFile} from '../core/rest'

export const restApiPlugin = fp(
    async (fastify: FastifyInstance): Promise<void> => {
        fastify.get('/status', healthCheck)
        fastify.get('/upload', uploadFile)
    },
    {
        name: 'restApiPlugin',
        dependencies: []
    } as PluginMetadata
)
