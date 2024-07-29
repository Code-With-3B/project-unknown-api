import {ErrorCode} from '../../constants/error-codes'
import {PutObjectCommand} from '@aws-sdk/client-s3'
import {ResolverContext} from '../../@types/context'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import {storageController} from '../storage/utils'
import {v4 as uuidv4} from 'uuid'

import {RequestUploadUrlInput, RequestUploadUrlResponse} from '../../generated/upload-media'
import {logger, serverConfig} from '../../config'

/**
 * Generates a pre-signed URL for uploading a file to S3.
 * @param context The resolver context containing the MongoDB database instance.
 * @param input The input data for requesting an upload URL.
 * @returns A Promise that resolves to a RequestUploadUrlResponse with the pre-signed URL or an error code.
 */
export async function requestUploadUrl(
    context: ResolverContext,
    input: RequestUploadUrlInput
): Promise<RequestUploadUrlResponse> {
    logger.info(`Temp ${context.mongodb.databaseName}`) // will remove this comment
    logger.info(`Received request to generate upload URL for userId ${input.userId}`)
    logger.debug(`Input data: ${JSON.stringify(input)}`)

    const maxSizeInBytes = serverConfig.media.maxFileSize * 1024 * 1024
    const {mediaType, userId, file} = input
    const fileExtension = file.fileType.split('/')[1] // Extract file extension
    const key = `${userId}/${mediaType}/${uuidv4()}.${fileExtension}`
    const contentType = file.fileType

    const fileSizeInBytes = parseInt(file.fileSize, 10) // Parse fileSize string to integer

    // Check if file size exceeds the maximum allowed size
    if (fileSizeInBytes > maxSizeInBytes) {
        logger.warn(`File size (${fileSizeInBytes} bytes) exceeds the maximum allowed size of ${maxSizeInBytes} bytes.`)
        return {
            success: false,
            uploadUrl: null,
            code: [ErrorCode.FILE_TOO_LARGE]
        }
    }

    try {
        // Create a PutObjectCommand with the specified parameters
        const command = new PutObjectCommand({
            Bucket: 'media',
            Key: key,
            ContentType: contentType
        })

        // Generate a pre-signed URL with an expiration time
        const url = await getSignedUrl(storageController, command, {expiresIn: serverConfig.media.uploadUrlExpiration})

        logger.info(`Generated pre-signed URL for file upload: ${key}`)
        return {
            success: !!url,
            uploadUrl: url ?? null,
            code: [url ? ErrorCode.UPLOAD_URL_GRANTED : ErrorCode.UPLOAD_URL_DENIED]
        }
    } catch (error) {
        // Log and handle errors
        logger.error(`Error generating upload URL for userId ${userId}: ${error}`)
        return {
            success: false,
            uploadUrl: null,
            code: [ErrorCode.UPLOAD_URL_DENIED]
        }
    }
}
