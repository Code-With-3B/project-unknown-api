import {ResolverContext} from '../../@types/context'
import {logger} from '../../config'
import {requestUploadUrl} from '../services/reuqest-upload-url'

import {RequestUploadUrlResponse, Resolvers} from '../../generated/upload-media'

export const uploadUrlResolver: Resolvers = {
    Query: {
        requestUploadUrl: async (_, {input}, context: ResolverContext): Promise<RequestUploadUrlResponse> => {
            logger.info('uploadUrlResolver')
            return await requestUploadUrl(context, input)
        }
    }
}
