import {ErrorCode} from '../../../../constants/error-codes'
import {MongoCollection} from '../../../../@types/collections'
import {ResolverContext} from '../../../../@types/context'
import {UserInteractionCollection} from '../../../../generated/mongo-types'
import {logger} from '../../../../config'
import {v4 as uuid} from 'uuid'

import {
    AccountInteractionType,
    UpdateUserConnectionInput,
    UpdateUserConnectionResponse,
    UserInteraction
} from '../../../../generated/graphql'
import {fetchRelationalData, insertDataInDB, updateDataInDB} from '../../db/utils'

export async function updateUserConnection(
    context: ResolverContext,
    input: UpdateUserConnectionInput
): Promise<UpdateUserConnectionResponse> {
    logger.info(`Received request from ${input.actor} to ${input.actionType} ${input.target}`)
    const actionSuccessMessages = {
        [AccountInteractionType.Follow]: ErrorCode.FOLLOW_USER_SUCCESS,
        [AccountInteractionType.Unfollow]: ErrorCode.UNFOLLOW_USER_SUCCESS,
        [AccountInteractionType.Block]: ErrorCode.BLOCK_USER_SUCCESS
    }
    const actionFailureMessages = {
        [AccountInteractionType.Follow]: ErrorCode.FOLLOW_USER_FAILED,
        [AccountInteractionType.Unfollow]: ErrorCode.UNFOLLOW_USER_FAILED,
        [AccountInteractionType.Block]: ErrorCode.BLOCK_USER_FAILED
    }

    try {
        const actionType = input.actionType
        const query = {actor: input.actor, target: input.target}
        const existingRecord = await fetchRelationalData<UserInteraction>(
            context.mongodb,
            MongoCollection.USER_INTERACTION,
            query
        )
        if (existingRecord[0]) {
            const updateFields: Partial<UserInteractionCollection> = {}
            if (input.actionType != existingRecord[0].actionType) updateFields.actionType = input.actionType
            updateFields.updatedAt = new Date().toISOString()
            const updatedRecord = await updateDataInDB<UserInteractionCollection, UserInteraction>(
                context.mongodb,
                MongoCollection.USER_INTERACTION,
                existingRecord[0].id,
                updateFields
            )
            if (updatedRecord) {
                logger.info(`Updating record successful for recordId: ${existingRecord[0].id}`)
                return {success: true, code: [actionSuccessMessages[actionType]]}
            } else {
                logger.info(`Updating record failed for recordId: ${existingRecord[0].id}`)
                return {success: false, code: [actionFailureMessages[actionType]]}
            }
        } else {
            logger.info(`No existing record found, creating new one`)
            const document: UserInteractionCollection = {
                id: uuid(),
                ...input,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            const createdInteraction = await insertDataInDB<UserInteractionCollection, UserInteraction>(
                context.mongodb,
                MongoCollection.USER_INTERACTION,
                document
            )

            if (createdInteraction) {
                logger.info(`Request completed successfully: ${input.actor} ${actionType} ${input.target}`)
                return {success: true, code: [actionSuccessMessages[actionType]]}
            } else {
                logger.info(`Request failed: ${input.actor} ${actionType} ${input.target}`)
                return {success: false, code: [actionFailureMessages[actionType]]}
            }
        }
    } catch (error) {
        logger.error(`Error during ${input.actionType} ${input.target} for ${input.actor}`, error)
        logger.error(error)
        return {success: false, code: [ErrorCode.GENERIC_ERROR]}
    }
}
