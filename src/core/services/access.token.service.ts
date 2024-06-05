import {AccessTokensCollection} from '../../generated/mongo-types'
import {Db} from 'mongodb'
import {MongoCollection} from '../../@types/collections'
import {TokenStatus} from '../../generated/graphql'
import {fetchDocumentByField} from '../db/common'
import {logger} from '../../config'

export async function checkAccessTokenIsValid(db: Db, token: string): Promise<boolean> {
    const tokenData = await fetchDocumentByField<AccessTokensCollection>(
        db,
        MongoCollection.ACCESS_TOKEN,
        'token',
        token
    )
    logger.info(`isActive: ${JSON.stringify(tokenData)}`)
    return tokenData?.status === TokenStatus.Active
}
