import {AccessTokensCollection} from '../../../generated/mongo-types'
import {Db} from 'mongodb'
import {MongoCollection} from '../../../@types/collections'
import {TokenInputPayload} from '../../../@types/auth'
import {TokenStatus} from '../../../generated/graphql'
import {fetchDocumentByField} from '../common'
import {logger} from '../../../config'
import {v4 as uuid} from 'uuid'

export async function createOrUpdateAccessToken(db: Db, token: string, document: TokenInputPayload): Promise<void> {
    const existingToken = await fetchDocumentByField<AccessTokensCollection>(
        db,
        MongoCollection.ACCESS_TOKEN,
        'token',
        token
    )

    logger.info(`Exisitng token: ${JSON.stringify(existingToken)}`)

    const tokenData: AccessTokensCollection = {
        id: existingToken?.id ?? uuid(),
        userId: document.id ?? '',
        token,
        status: TokenStatus.Active,
        createdAt: new Date().toISOString()
    }

    await db
        .collection<AccessTokensCollection>(MongoCollection.ACCESS_TOKEN)
        .replaceOne({token}, tokenData, {upsert: true})
}
