import {ErrorCode} from '../../constants/error-codes'
import {MongoCollection} from '../../@types/collections'
import {ResolverContext} from '../../@types/context'
import {insertDataInDB} from '../db/utils'
import {logger} from '../../config'
import {v4 as uuid} from 'uuid'

import {CreateHighlightInput, CreateHighlightResponse, Highlight} from '../../generated/highlight'

/**
 * Creates a new highlight document in the database.
 * @param context The resolver context containing the MongoDB database instance.
 * @param input The input data for creating a highlight.
 * @returns A Promise that resolves to a CreateHighlightResponse indicating success or failure.
 */
export async function createHighlight(
    context: ResolverContext,
    input: CreateHighlightInput
): Promise<CreateHighlightResponse> {
    logger.info(`Creating highlight for userId ${input.userId}`)

    try {
        // Construct highlight document
        const highlightDocument: Highlight = {
            id: uuid(),
            ...input,
            shareCount: 0,
            likes: [],
            comments: [],
            createdAt: new Date().toISOString(),
            updatedAt: null
        }

        // Insert document into the database
        const createdHighlight = await insertDataInDB<Highlight, Highlight>(
            context.mongodb,
            MongoCollection.HIGHLIGHT,
            highlightDocument
        )

        // Log success or failure based on the result of the insertion
        if (createdHighlight) {
            logger.info(`Highlight creation successful: ${createdHighlight.id}`)
            return {success: true, code: [ErrorCode.USER_CREATION_SUCCESS], highlight: createdHighlight}
        } else {
            logger.error(`Highlight creation failed: ${input.userId}`)
            return {success: false, code: [ErrorCode.USER_CREATION_FAILED], highlight: null}
        }
    } catch (error) {
        // Log error and rethrow
        logger.error(`Error creating highlight for userId ${input.userId}: ${error}`)
        throw error
    }
}

/**
 * Updates an existing highlight document in the database. Note: This function appears to create a new highlight.
 * @param context The resolver context containing the MongoDB database instance.
 * @param input The input data for updating a highlight.
 * @returns A Promise that resolves to a CreateHighlightResponse indicating success or failure.
 */
export async function updateHighlight(
    context: ResolverContext,
    input: CreateHighlightInput
): Promise<CreateHighlightResponse> {
    logger.info(`Updating highlight for userId ${input.userId}`)

    try {
        // Construct highlight document
        const highlightDocument: Highlight = {
            id: uuid(),
            ...input,
            shareCount: 0,
            likes: [],
            comments: [],
            createdAt: new Date().toISOString(),
            updatedAt: null
        }

        // Insert document into the database
        const createdHighlight = await insertDataInDB<Highlight, Highlight>(
            context.mongodb,
            MongoCollection.HIGHLIGHT,
            highlightDocument
        )

        // Log success or failure based on the result of the insertion
        if (createdHighlight) {
            logger.info(`Highlight update successful: ${createdHighlight.id}`)
            return {success: true, code: [ErrorCode.USER_CREATION_SUCCESS], highlight: createdHighlight}
        } else {
            logger.error(`Highlight update failed: ${input.userId}`)
            return {success: false, code: [ErrorCode.USER_CREATION_FAILED], highlight: null}
        }
    } catch (error) {
        // Log error and rethrow
        logger.error(`Error updating highlight for userId ${input.userId}: ${error}`)
        throw error
    }
}
