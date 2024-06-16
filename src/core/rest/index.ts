import {ErrorCode} from '../../constants/error-codes'
import {FastifyReply} from 'fastify'
import {MongoCollection} from '../../@types/collections'
import {Readable} from 'stream'
import {checkAccessTokenIsValid} from '../graph/services/access.token.service'
import {isEmpty} from 'ramda'
import {logger} from '../../config'

import {FastifyInstance, FastifyRequest} from 'fastify'
import {GridFSBucket, ObjectId} from 'mongodb'
import {MediaType, RestParamsInput} from '../../generated/graphql'

export async function registerRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.post('/upload/:userId/:mediaType', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const {userId, mediaType} = request.params as RestParamsInput
            logger.info(`Received upload request from user ${userId} for ${mediaType}.`)
            if (!Object.values(MediaType).includes(mediaType)) {
                logger.error('Invalid media type')
                return reply.status(500).send({success: false, error: ErrorCode.INVALID_MEDIA_TYPE})
            }
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

            const data = await request.file()
            if (!data) {
                logger.error('Media not attached in the request.')
                return reply.send({success: false, error: ErrorCode.MEDIA_NOT_ATTACHED})
            }

            const fileType = data.mimetype

            const bucket = new GridFSBucket(db, {
                bucketName: MongoCollection.MEDIA
            })
            const uploadStream = bucket.openUploadStream(data.filename, {
                metadata: {
                    userId,
                    mediaType,
                    fileType,
                    uploadedAt: new Date().toISOString()
                }
            })
            const buffer = await data.toBuffer()
            const readBuffer = new Readable()

            readBuffer.push(buffer)
            readBuffer.push(null)

            await new Promise<void>((resolve, reject) => {
                readBuffer
                    .pipe(uploadStream)
                    .on('finish', () => {
                        logger.info('File upload completed')
                        resolve()
                    })
                    .on('error', error => {
                        logger.error('File upload failed')
                        logger.error(error)
                        reject(error)
                    })
            })

            const id = uploadStream.id
            if (!id) {
                return reply.status(404).send({success: false, error: ErrorCode.FILE_NOT_FOUND})
            }

            return reply.send({
                file: id,
                context: ErrorCode.MEDIA_UPLOAD_SUCCESS
            })
        } catch (error) {
            logger.error(`Error uploading file: ${error}`)
            reply.status(500).send({success: false, error: ErrorCode.INTERNAL_SERVER_ERROR})
        }
    })

    fastify.get('/download/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const {id} = request.params as {id: string}
            const db = fastify.mongo.db
            if (!db) {
                logger.error('Database connection not available.')
                return reply.status(500).send({success: false, error: ErrorCode.DATABASE_CONNECTION})
            }

            const bucket = new GridFSBucket(db, {
                bucketName: MongoCollection.MEDIA
            })

            const file = await bucket.find({_id: new ObjectId(id)}).toArray()
            if (!file || file.length === 0) {
                logger.error('File not found.')
                return reply.status(404).send({success: false, error: ErrorCode.FILE_NOT_FOUND})
            }

            const fileBuffer = await new Promise((resolve, reject) => {
                const chunks: Buffer[] = []
                bucket
                    .openDownloadStream(file[0]._id)
                    .on('data', chunk => {
                        chunks.push(chunk)
                    })
                    .on('end', () => {
                        resolve(Buffer.concat(chunks))
                    })
                    .on('error', err => {
                        reject(err)
                    })
            })

            const fileType = file[0].metadata?.fileType
            const filename = file[0].filename

            reply.header('Content-Type', fileType)
            reply.header('Content-Disposition', `attachment; filename="${filename}"`)
            reply.send(fileBuffer)
        } catch (error) {
            logger.error(`Error downloading file`)
            logger.error(error)
            reply.status(500).send({success: false, error: ErrorCode.INTERNAL_SERVER_ERROR})
        }
    })
}
