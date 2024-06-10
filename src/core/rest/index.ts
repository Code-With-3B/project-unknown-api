import {FastifyReply} from 'fastify'
import {RestParamsInput} from '../../generated/graphql'
import fs from 'fs'
import {logger} from '../../config'
import path from 'path'
import {pipeline} from 'stream'
import {promisify} from 'util'
import {uploadDir} from './utils'
import {v4 as uuid} from 'uuid'

import {FastifyInstance, FastifyRequest} from 'fastify'
import {GridFSBucket, GridFSBucketWriteStreamOptions} from 'mongodb'

const pump = promisify(pipeline)

export async function registerRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.post('/upload/:userId/:mediaType', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            logger.info(`Params: ${JSON.stringify(request.params)}`)
            const {userId, mediaType} = request.params as RestParamsInput
            const data = await request.file()
            if (!data) {
                return reply.send({status: 'upload failed', filename: null, filePath: null})
            }

            const filePath = path.join(uploadDir, data.filename)

            await pump(data.file, fs.createWriteStream(filePath))
            const db = fastify.mongo.db
            if (!db) {
                return reply.status(500).send({status: 'error', message: 'Database connection error'})
            }

            logger.info(`Params: ${userId}, ${mediaType}`)

            const bucket = new GridFSBucket(db)
            const uploadFilename = `${userId}.${path.extname(data.filename).slice(1)}`
            const options: GridFSBucketWriteStreamOptions = {
                contentType: data.mimetype,
                metadata: {
                    userId: uuid(),
                    mediaType: mediaType
                }
            }
            const uploadStream = bucket.openUploadStream(uploadFilename, options)
            const readStream = fs.createReadStream(filePath)

            try {
                await new Promise((resolve, reject) => {
                    uploadStream.once('error', reject)
                    uploadStream.once('finish', resolve)
                    readStream.pipe(uploadStream)
                })

                logger.info(`File uploaded to MongoDB successfully`)
                return reply.send({status: 'success'})
            } catch (error) {
                logger.error(`Error uploading file to MongoDB: ${error}`)
                reply.send({status: 'success failed'})
            } finally {
                fs.unlinkSync(filePath)
            }
        } catch (error) {
            logger.error(`Error uploading file: ${error}`)
            reply.status(500).send({status: 'error', message: 'Internal server error'})
        }
    })
}
