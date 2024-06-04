import { ApolloServer } from '@apollo/server'
import { FastifyInstance } from 'fastify'
import { MongoClient } from 'mongodb'
import { ResolverContext } from '../@types/context'
import fastifyApollo from '@as-integrations/fastify'
import { readFileSync } from 'fs'
import { resolvers } from '../resolvers/_index'
import { serverConfig } from '../config'

import fp, { PluginMetadata } from 'fastify-plugin'

const typeDefs = readFileSync('./schema.graphql', 'utf8')

/**
 * Create Apollo Server instance, MongoDB connection, and integrate with Fastify
 * @param {FastifyInstance} fastify - The Fastify instance to integrate with
 * @throws {Error} Throws error if unable to establish MongoDB connection or start ApolloServer
 * @returns {Promise<void>} A Promise indicating the completion of integration process
 */
export const fastifyApolloPlugin = fp(
    async (fastify: FastifyInstance): Promise<void> => {
        const mongodb = await MongoClient.connect(serverConfig.dbUri, {
            maxPoolSize: 20
        })
        const apolloServer = new ApolloServer<ResolverContext>({
            typeDefs,
            resolvers
        })
        await apolloServer.start()
        await fastify.register(fastifyApollo(apolloServer), {
            context: async () => ({
                mongodb: mongodb.db(serverConfig.db)
            })
        })
    },
    {
        name: 'fastifyApolloPlugin',
        fastify: '4.x',
        dependencies: []
    } as PluginMetadata
)
