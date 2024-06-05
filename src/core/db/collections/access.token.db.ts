import {AccessTokensCollection} from '../../../generated/mongo-types'
import {Db} from 'mongodb'
import {MongoCollection} from '../../../@types/collections'
import {TokenInputPayload} from '../../../@types/auth'
import {logger} from '../../../config'
import {v4 as uuid} from 'uuid'

import {AccessToken, TokenStatus} from '../../../generated/graphql'
import {fetchDocumentByField, insertDataInDB} from '../common'

export async function createOrUpdateAccessToken(db: Db, token: string, document: TokenInputPayload): Promise<void> {
    const existingToken = await fetchDocumentByField<AccessTokensCollection>(
        db,
        MongoCollection.ACCESS_TOKEN,
        'userId',
        document.id
    )

    logger.info(`Exisitng token: ${JSON.stringify(existingToken)}`)

    if (!existingToken) {
        logger.info(`Creating new token: ${JSON.stringify(document)}`)
        const tokenData: AccessTokensCollection = {
            id: uuid(),
            userId: document.id ?? '',
            token,
            status: TokenStatus.Active,
            createdAt: new Date().toISOString()
        }
        await insertDataInDB<AccessTokensCollection, AccessToken>(db, MongoCollection.ACCESS_TOKEN, tokenData)
    } else {
        logger.info(`Updating existing token: ${JSON.stringify(document)}`)
        const tokenData: AccessTokensCollection = {
            id: existingToken.id,
            userId: existingToken.userId,
            token,
            status: TokenStatus.Active,
            createdAt: new Date().toISOString().toLowerCase()
        }
        await db
            .collection<AccessTokensCollection>(MongoCollection.ACCESS_TOKEN)
            .replaceOne({userId: document.id}, tokenData, {upsert: true})
    }
}
