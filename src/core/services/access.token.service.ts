import {Db} from 'mongodb'
import {MongoCollection} from '../../@types/collections'
import {doesDocumentExistByField} from '../db/utils'

/**
 * Generate a JWT token with the provided payload.
 * @param db The MongoDB database instance.
 * @param payload The payload to be included in the JWT token.
 * @returns The generated JWT token.
 */
export async function checkAccessTokenIsValid(db: Db, token: string): Promise<boolean> {
    return await doesDocumentExistByField(db, MongoCollection.ACCESS_TOKEN, {token})
}
