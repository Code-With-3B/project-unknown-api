import {MongoCollection} from '../../@types/collections'
import {ResolverContext} from '../../@types/context'
import {TokenInputPayload} from '../../@types/auth'
import {UsersCollection} from './../../generated/mongo-types'
import {generateToken} from '../auth/utils'
import {logger} from '../../config'
import {v4 as uuid} from 'uuid'

import {
    AuthMode,
    CheckDuplicateUserInput,
    CheckDuplicateUserResponse,
    CreateUserInput,
    SignInInput,
    SignInResponse,
    User,
    UserResponse
} from '../../generated/graphql'
import {fetchDocumentByField, fetchDocumentByName, fetchRelationalData, insertDataInDB} from '../db/common'
import {isEmail, isMobilePhone, isStrongPassword} from 'class-validator'

export async function getUsers(context: ResolverContext): Promise<User[] | null> {
    return await fetchRelationalData<User>(context.mongodb, MongoCollection.USER)
}

export async function checkUsernameIsDuplicate(
    context: ResolverContext,
    input: CheckDuplicateUserInput
): Promise<CheckDuplicateUserResponse> {
    const user = await fetchDocumentByName(context.mongodb, MongoCollection.USER, input.username)
    logger.info(`Checking duplicate user ${JSON.stringify(user)}`)
    if (user) return {isDuplicate: true}
    return {isDuplicate: false}
}

export async function createUser(context: ResolverContext, input: CreateUserInput): Promise<UserResponse> {
    if (input.authMode === AuthMode.EmailPass) {
        if (!input.email) throw new Error(`Email is required`)
        if (!input.password) throw Error(`Password is required`)
        if (!isEmail(input.email)) throw new Error(`Invalid email format`)
        if (!isStrongPassword(input.password))
            throw new Error(
                `Password is not strong enough. It should have at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.`
            )
    } else if (input.authMode === AuthMode.PhonePass) {
        if (!input.phone) throw new Error(`Phone number is required`)
        if (!input.password) throw Error(`Password is required`)
        if (!isMobilePhone(input.phone)) throw new Error(`Invalid phone number format`)
        if (!isStrongPassword(input.password))
            throw new Error(
                `Password is not strong enough. It should have at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.`
            )
    } else if (!input.email) throw new Error(`Email is required`)

    const userDocument: UsersCollection = {
        id: uuid(),
        ...input
    }
    const createdUser = await insertDataInDB<UsersCollection, User>(context.mongodb, MongoCollection.USER, userDocument)
    return {success: !!createdUser, user: createdUser}
}

export async function signInUser(context: ResolverContext, input: SignInInput): Promise<SignInResponse> {
    logger.info(`Context ${JSON.stringify(context.mongodb.databaseName)}`)
    if (input.authMode === AuthMode.EmailPass) {
        if (!input.email) throw new Error(`Email is required`)
        if (!input.password) throw Error(`Password is required`)
    } else if (input.authMode === AuthMode.PhonePass) {
        if (!input.phone) throw new Error(`Phone number is required`)
        if (!input.password) throw Error(`Password is required`)
    } else if (!input.email) throw new Error(`Email is required`)

    const user = await fetchDocumentByField<UsersCollection>(
        context.mongodb,
        MongoCollection.USER,
        'email',
        input.email
    )
    if (!user) return {success: false}

    const payload: TokenInputPayload = {
        id: user.id,
        createdAt: user.createdAt ?? `${user.createdAt}`
    }
    const token = await generateToken(context.mongodb, payload)
    return {success: !!token, token: token}
}
