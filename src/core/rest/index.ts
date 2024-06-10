import {FastifyInstance} from 'fastify'
import {GridFSBucket} from 'mongodb'
import fs from 'fs'
import {logger} from '../../config'
import path from 'path'
import {pipeline} from 'stream'
import {promisify} from 'util'

const pump = promisify(pipeline)

export async function registerRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.post('/upload', async (request, reply) => {
        try {
            const data = await request.file() // Correctly call file on request object

            const uploadDir = path.join(__dirname, '..', 'uploads')
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir)
            }

            if (data) {
                const filePath = path.join(uploadDir, data.filename)

                // Pipe the file stream to the specified path
                await pump(data.file, fs.createWriteStream(filePath))

                // Construct the file URL to be sent back in the response
                const fileUrl = `http://${request.hostname}:${request.socket.remoteAddress}/${data.filename}`

                const db = fastify.mongo.db
                if (db) {
                    logger.info(`Database info: ${db.databaseName}`)
                    const bucket = new GridFSBucket(db)

                    // Upload the file to MongoDB using GridFS
                    const uploadStream = bucket.openUploadStream(data.filename)
                    const readStream = fs.createReadStream(filePath)
                    readStream.pipe(uploadStream)
                    uploadStream.on('error', error => {
                        console.error('Error uploading file to MongoDB:', error)
                        reply.status(500).send({status: 'error', message: 'Failed to upload file to MongoDB'})
                    })
                    uploadStream.on('finish', () => {
                        console.log('File uploaded to MongoDB successfully')

                        // Construct the file URL to be sent back in the response
                        const fileUrl = `http://${request.hostname}:${request.socket.remoteAddress}/${data.filename}`

                        // Respond to the client with the file path
                        reply.send({status: 'success', filename: data.filename, filePath: fileUrl})

                        // Clean up: remove the file from the server's filesystem
                        fs.unlinkSync(filePath)

                        // Close MongoDB connection
                    })
                }
                // Respond to the client with the file path
                reply.send({status: 'success', filename: data.filename, filePath: fileUrl})
            } else {
                reply.send({status: 'upload failed', filename: null, filePath: null})
            }
        } catch (error) {
            request.log.error(error) // Log error for debugging
            reply.status(500).send({status: 'error', message: error})
        }
    })
}
