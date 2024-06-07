import {logger} from '../../config'

import {FastifyReply, FastifyRequest} from 'fastify'

export async function healthCheck(_: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
        reply.send({status: 'OK'})
    } catch (error) {
        throw error
    }
}
export async function uploadFile(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
        const input = request.body
        logger.info(`File upload with inputs: ${JSON.stringify(input)}`)
        reply.send()
    } catch (error) {
        throw error
    }
}
