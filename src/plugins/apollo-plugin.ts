import {ApolloServer} from '@apollo/server'
import {ErrorCode} from '../constants/error-codes'
import {GraphQlRequestBody} from '../generated/sign-in'
import {ResolverContext} from '../@types/context'
import {checkAccessTokenIsValid} from '../core/services/access.token.service'
import fastifyApollo from '@as-integrations/fastify'
import {isEmpty} from 'ramda'
import jwt from 'jsonwebtoken'
import {readFileSync} from 'fs'
import {resolvers} from '../core/resolvers/_index'

import {FastifyInstance, FastifyRequest} from 'fastify'
import {FieldNode, OperationDefinitionNode, parse} from 'graphql'
import fp, {PluginMetadata} from 'fastify-plugin'
import {logger, serverConfig} from '../config'

const typeDefs = [
    readFileSync('src/schemas/health.graphql', 'utf8'),
    readFileSync('src/schemas/highlight.graphql', 'utf8'),
    readFileSync('src/schemas/sign-in.graphql', 'utf8'),
    readFileSync('src/schemas/upload-media.graphql', 'utf8'),
    readFileSync('src/schemas/user.graphql', 'utf8'),
    readFileSync('src/schemas/team.graphql', 'utf8')
].join('\n')
/**
 * Create Apollo Server instance, MongoDB connection, and integrate with Fastify
 * @param {FastifyInstance} fastify - The Fastify instance to integrate with
 * @throws {Error} Throws error if unable to establish MongoDB connection or start ApolloServer
 * @returns {Promise<void>} A Promise indicating the completion of integration process
 */

export const fastifyApolloPlugin = fp(
    async (fastify: FastifyInstance): Promise<void> => {
        const apolloServer = new ApolloServer<ResolverContext>({
            typeDefs,
            resolvers
        })

        await apolloServer.start()
        await fastify.register(fastifyApollo(apolloServer), {
            context: async (req: FastifyRequest) => {
                const mongodb = fastify.mongo.db
                if (mongodb) {
                    const body = req.body as GraphQlRequestBody
                    const {query, operationName} = body
                    logger.info(`Received request for operation: ${operationName}`)
                    let actualFieldName = operationName?.toLowerCase() ?? ''

                    if (query) {
                        try {
                            const parsedQuery = parse(query)
                            const operationDefinition = parsedQuery.definitions.find(
                                def => def.kind === 'OperationDefinition'
                            ) as OperationDefinitionNode

                            if (operationDefinition && operationDefinition.selectionSet.selections.length > 0) {
                                const firstSelection = operationDefinition.selectionSet.selections[0] as FieldNode
                                const fieldName = firstSelection.name.value
                                logger.info(`Actual operation in service: ${fieldName}`)
                                actualFieldName = fieldName
                            }
                        } catch (error) {
                            logger.error('Failed to parse the query.', error)
                        }
                    }

                    const publicOperations = ['__schema', 'signUp', 'signIn', 'checkDuplicateUsername', 'healthCheck']
                    if (publicOperations.includes(actualFieldName)) {
                        logger.info('Public operation, no authentication required.')
                        return {mongodb}
                    }

                    if (mongodb) {
                        const token = req.headers.authorization ?? ''
                        if (isEmpty(token)) {
                            logger.error('Authorization token is missing.')
                            throw new Error(ErrorCode.NOT_AUTHENTICATED)
                        }

                        const isActive = await checkAccessTokenIsValid(mongodb, token)
                        if (isActive) {
                            jwt.verify(token, serverConfig.jwt.jwtSecreteKey)
                            logger.info('Authorization token is valid.')
                            return {mongodb}
                        } else {
                            logger.error('Invalid authorization token provided.')
                            throw new Error(ErrorCode.NOT_AUTHENTICATED)
                        }
                    }
                } else throw Error('Unable to connect to database!!')
                return {mongodb}
            }
        })
    },
    {
        name: 'fastifyApolloPlugin',
        fastify: '4.x',
        dependencies: []
    } as PluginMetadata
)
