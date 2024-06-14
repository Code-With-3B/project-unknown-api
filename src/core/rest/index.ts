import {ErrorCode} from '../../constants/error-codes'
import {FastifyReply} from 'fastify'
import {RestParamsInput} from '../../generated/graphql'
import {checkAccessTokenIsValid} from '../graph/services/access.token.service'
import fs from 'fs'
import {isEmpty} from 'ramda'
import {logger} from '../../config'
import path from 'path'
import {pipeline} from 'stream'
import {promisify} from 'util'
import {uploadDir} from './utils'

import {FastifyInstance, FastifyRequest} from 'fastify'
import {GridFSBucket, GridFSBucketWriteStreamOptions} from 'mongodb'

const pump = promisify(pipeline)

export async function registerRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.post('/upload/:userId/:mediaType', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const {userId, mediaType} = request.params as RestParamsInput
            const db = fastify.mongo.db
            if (!db) {
                logger.error('Database connection not available.')
                return reply.status(500).send({success: false, error: ErrorCode.DATABASE_CONNECTION})
            }

            const token = request.headers.authorization ?? ''
            if (isEmpty(token)) {
                logger.error('Authorization token is missing.')
                return reply.status(500).send({success: false, error: ErrorCode.NOT_AUTHENTICATED})
            }

            const isActive = await checkAccessTokenIsValid(db, token)
            if (!isActive) {
                logger.error('Invalid authorization token provided.')
                return reply.status(500).send({success: false, error: ErrorCode.NOT_AUTHENTICATED})
            }

            logger.info(`Received upload request from user ${userId} for ${mediaType}.`)
            const data = await request.file()
            if (!data) {
                logger.error('Media not attached in the request.')
                return reply.send({success: false, error: ErrorCode.MEDIA_NOT_ATTACHED})
            }

            const filePath = path.join(uploadDir, data.filename)

            await pump(data.file, fs.createWriteStream(filePath))

            // Create a unified GridFSBucket under a single collection named 'media'
            const bucket = new GridFSBucket(db, {
                bucketName: 'media' // Unified bucket for all media types
            })

            // Naming convention for files to indicate "nested" structure
            const uploadFilename = `${userId}/${mediaType}/${Date.now()}-${data.filename}`
            const options: GridFSBucketWriteStreamOptions = {
                contentType: data.mimetype,
                metadata: {
                    userId: userId,
                    mediaType: mediaType,
                    originalFilename: data.filename
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

                const fileId = uploadStream.id
                const downloadUrl = `/download/${userId}/${mediaType}/${fileId}`

                logger.info(`File uploaded to MongoDB successfully.`)
                return reply.send({success: true, message: 'File uploaded successfully.', downloadUrl: downloadUrl})
            } catch (error) {
                logger.error(`Error uploading file to MongoDB: ${error}`)
                return reply.send({success: false, error: ErrorCode.MEDIA_UPLOAD_FAILED})
            } finally {
                fs.unlinkSync(filePath)
            }
        } catch (error) {
            logger.error(`Error uploading file: ${error}`)
            reply.status(500).send({success: false, error: ErrorCode.INTERNAL_SERVER_ERROR})
        }
    })
}
