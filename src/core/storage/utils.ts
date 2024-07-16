import {S3Client} from '@aws-sdk/client-s3'
import {serverConfig} from '../../config'

export const storageController = new S3Client(serverConfig.storage)
