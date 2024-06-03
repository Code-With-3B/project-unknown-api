import {ApolloServer} from '@apollo/server'
import {FastifyInstance} from 'fastify'
import fastifyApollo from '@as-integrations/fastify'
import {readFileSync} from 'fs'
import {resolvers} from '../resolvers/_index'

import fp, {PluginMetadata} from 'fastify-plugin'

const typeDefs = readFileSync('./schema.graphql', 'utf8')

export const fastifyApolloPlugin = fp(
    async (fastify: FastifyInstance): Promise<void> => {
        const apolloServer = new ApolloServer({
            typeDefs,
            resolvers
        })
        await apolloServer.start()
        await fastify.register(fastifyApollo(apolloServer))
    },
    {
        name: 'fastifyApolloPlugin',
        fastify: '4.x',
        dependencies: []
    } as PluginMetadata
)
