import {AccessTokensCollection} from '../../../generated/mongo-types'
import {Db} from 'mongodb'
import {MongoCollection} from '../../../@types/collections'
import {logger} from '../../../config'
import {v4 as uuid} from 'uuid'

import {AccessToken, TokenPayloadInput} from '../../../generated/sign-in'
import {fetchDocumentByField, insertDataInDB} from '../utils'

/**
 * Create or update an access token in the database.
 * @param db The MongoDB database instance.
 * @param token The access token string.
 * @param document The token payload input.
 * @returns {Promise<void>} A promise that resolves when the token is created or updated.
 * @throws {Error} Throws an error if failed to create or update the token
 */
export async function createOrUpdateAccessToken(db: Db, token: string, document: TokenPayloadInput): Promise<void> {
    try {
        const existingToken = await fetchDocumentByField<AccessTokensCollection>(
            db,
            MongoCollection.ACCESS_TOKEN,
            'userId',
            document.id
        )

        if (!existingToken) {
            const newTokenData: AccessTokensCollection = {
                id: uuid(),
                userId: document.id ?? '',
                token,
                createdAt: new Date().toISOString()
            }

            await insertDataInDB<AccessTokensCollection, AccessToken>(db, MongoCollection.ACCESS_TOKEN, newTokenData)

            logger.info(`Creating new token for userID: ${document.id}`)
        } else {
            const updatedTokenData: AccessTokensCollection = {
                ...existingToken,
                token,
                createdAt: new Date().toISOString().toLowerCase()
            }

            await db
                .collection<AccessTokensCollection>(MongoCollection.ACCESS_TOKEN)
                .replaceOne({userId: document.id}, updatedTokenData, {upsert: true})

            logger.info(`Updating token for userID: ${document.id}`)
        }
    } catch (error) {
        logger.error(`Error creating/updating token: ${error}`)
        throw error
    }
}
