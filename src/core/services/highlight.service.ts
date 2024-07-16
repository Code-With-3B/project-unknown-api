import {ErrorCode} from '../../constants/error-codes'
import {MongoCollection} from '../../@types/collections'
import {ResolverContext} from '../../@types/context'
import {insertDataInDB} from '../db/utils'
import {logger} from '../../config'
import {v4 as uuid} from 'uuid'

import {CreateHighlightInput, CreateHighlightResponse, Highlight} from '../../generated/graphql'

export async function createHighlight(
    context: ResolverContext,
    input: CreateHighlightInput
): Promise<CreateHighlightResponse> {
    logger.info(`Creating highlight for userId ${input.userId}`)
    try {
        const highlightDocument: Highlight = {
            id: uuid(),
            ...input,
            shareCount: 0,
            likes: [],
            comments: [],
            createdAt: new Date().toISOString(),
            updatedAt: null
        }

        const createdHighlight = await insertDataInDB<Highlight, Highlight>(
            context.mongodb,
            MongoCollection.HIGHLIGHT,
            highlightDocument
        )
        if (createdHighlight) {
            logger.info(`Creating highlight ${createdHighlight ? 'Successful' : 'Failed'}`)
            return {success: true, code: [ErrorCode.USER_CREATION_SUCCESS], highlight: createdHighlight}
        }
        return {success: !!createdHighlight, code: [ErrorCode.USER_CREATION_FAILED], highlight: null}
    } catch (error) {
        logger.error(error)
        throw error
    }
}

export async function updateHighlight(
    context: ResolverContext,
    input: CreateHighlightInput
): Promise<CreateHighlightResponse> {
    logger.info(`Updating highlight for userId ${input.userId}`)
    try {
        const highlightDocument: Highlight = {
            id: uuid(),
            ...input,
            shareCount: 0,
            likes: [],
            comments: [],
            createdAt: new Date().toISOString(),
            updatedAt: null
        }

        const createdHighlight = await insertDataInDB<Highlight, Highlight>(
            context.mongodb,
            MongoCollection.HIGHLIGHT,
            highlightDocument
        )
        if (createdHighlight) {
            logger.info(`Creating highlight ${createdHighlight ? 'Successful' : 'Failed'}`)
            return {success: true, code: [ErrorCode.USER_CREATION_SUCCESS], highlight: createdHighlight}
        }
        return {success: !!createdHighlight, code: [ErrorCode.USER_CREATION_FAILED], highlight: null}
    } catch (error) {
        logger.error(error)
        throw error
    }
}
