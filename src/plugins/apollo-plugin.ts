import {ApolloServer} from '@apollo/server'
import {GraphQLRequestBody} from '../@types/auth'
import {MongoClient} from 'mongodb'
import {ResolverContext} from '../@types/context'
import {checkAccessTokenIsValid} from '../core/services/access.token.service'
import fastifyApollo from '@as-integrations/fastify'
import jwt from 'jsonwebtoken'
import {readFileSync} from 'fs'
import {resolvers} from '../core/resolvers/_index'

import {FastifyInstance, FastifyRequest} from 'fastify'
import fp, {PluginMetadata} from 'fastify-plugin'
import {logger, serverConfig} from '../config'

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
            context: async (req: FastifyRequest) => {
                const body = req.body as GraphQLRequestBody
                const operationName = body.operationName
                logger.info(`Operation : ${operationName}`)

                const publicOperations = ['createUser', 'signInUser']

                if (publicOperations.includes(operationName ?? '')) {
                    return {mongodb: mongodb.db(serverConfig.db)}
                }

                try {
                    const token = req.headers.authorization ?? ''
                    logger.info(`TOKEN is valid: ${token}`)
                    const isActive = await checkAccessTokenIsValid(mongodb.db(serverConfig.db), token)
                    if (isActive) {
                        logger.info(`TOKEN is valid: ${isActive}`)
                        jwt.verify(token, serverConfig.jwtSecreteKey)
                    }
                } catch (error) {
                    logger.error(`Unauthorized Access`)
                    throw Error(`Unauthorized Access`)
                }
                return {mongodb: mongodb.db(serverConfig.db)}
            }
        })
    },
    {
        name: 'fastifyApolloPlugin',
        fastify: '4.x',
        dependencies: []
    } as PluginMetadata
)
