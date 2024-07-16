import {FastifyInstance} from 'fastify'
import dbConnector from './mongodb-plugin'
import fastifyMultipart from '@fastify/multipart'
import {serverConfig} from './../config'

import fp, {PluginMetadata} from 'fastify-plugin'

export const restApiPlugin = fp(
    async (fastify: FastifyInstance): Promise<void> => {
        fastify.register(dbConnector)
        fastify.register(fastifyMultipart, {
            limits: {
                fileSize: serverConfig.media.maxFileSize * 1024 * 1024
            }
        })
    },
    {
        name: 'restApiPlugin',
        dependencies: []
    } as PluginMetadata
)
