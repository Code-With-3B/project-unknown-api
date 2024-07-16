import {MongoCollection} from '../../../@types/collections'
import {ResolverContext} from '../../../@types/context'
import {logger} from '../../../config'

import {CheckDuplicateUserInput, CheckDuplicateUserResponse, User} from '../../../generated/graphql'
import {doesDocumentExistByField, fetchRelationalData} from '../../db/utils'

/**
 * Initiates the process of fetching all users from the database.
 * @param context The resolver context containing the MongoDB database instance.
 * @returns A Promise that resolves to an array of users, or null if no users are found.
 */
export async function getUsers(context: ResolverContext): Promise<User[] | null> {
    logger.info(`Initiating fetching all users from the database.`)
    return await fetchRelationalData<User>(context.mongodb, MongoCollection.USER)
}

/**
 * Checks if the provided username already exists in the database.
 * @param context The resolver context containing the MongoDB database instance.
 * @param input The input containing the username to check for duplication.
 * @returns A Promise that resolves to an object indicating whether the username is a duplicate.
 */
export async function checkUsernameIsDuplicate(
    context: ResolverContext,
    input: CheckDuplicateUserInput
): Promise<CheckDuplicateUserResponse> {
    logger.info(`Checking for duplicate username: ${input.username}`)
    const isDuplicate = await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {
        username: input.username
    })
    if (isDuplicate) return {isDuplicate: true}
    return {isDuplicate: false}
}
