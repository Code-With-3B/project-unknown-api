import {ErrorCode} from '../../constants/error-codes'
import {PutObjectCommand} from '@aws-sdk/client-s3'
import {ResolverContext} from '../../@types/context'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import {storageController} from '../storage/utils'
import {v4 as uuidv4} from 'uuid'

import {RequestUploadUrlInput, RequestUploadUrlResponse} from '../../generated/graphql'
import {logger, serverConfig} from '../../config'

export async function requestUploadUrl(
    context: ResolverContext,
    input: RequestUploadUrlInput
): Promise<RequestUploadUrlResponse> {
    logger.error(`${context.mongodb.databaseName} : ${JSON.stringify(input)}`)

    const maxSizeInBytes = serverConfig.media.maxFileSize * 1024 * 1024

    const {mediaType, userId, file} = input
    const key = `${userId}/${mediaType}/${uuidv4()}.${file.fileType.split('/')[1]}`
    const contentType = file.fileType

    const fileSizeInBytes = parseInt(file.fileSize, 10) // parse fileSize string to integer
    if (fileSizeInBytes > maxSizeInBytes) {
        return {
            success: false,
            uploadUrl: null,
            code: [ErrorCode.FILE_TOO_LARGE]
        }
    }

    const command = new PutObjectCommand({
        Bucket: 'media',
        Key: key,
        ContentType: contentType
    })

    const url = await getSignedUrl(storageController, command, {expiresIn: serverConfig.media.uploadUrlExpiration})
    return {
        success: !!url,
        uploadUrl: url ?? null,
        code: [url ? ErrorCode.UPLOAD_URL_GRANTED : ErrorCode.UPLOAD_URL_DENIED]
    }
}
