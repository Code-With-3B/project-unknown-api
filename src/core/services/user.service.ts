import {MongoCollection} from '../../@types/collections'
import {ResolverContext} from '../../@types/context'
import {UsersCollection} from './../../generated/mongo-types'
import {logger} from '../../config'
import {v4 as uuid} from 'uuid'

import {
    AuthMode,
    CheckDuplicateUserInput,
    CheckDuplicateUserResponse,
    CreateUserInput,
    SignInInput,
    SignInResponse,
    TokenPayloadInput,
    UpdateUserInput,
    User,
    UserResponse
} from '../../generated/graphql'
import {bcryptConfig, generateToken} from '../../constants/auth/utils'
import {compare, hash} from 'bcrypt'
import {
    fetchDocumentByField,
    fetchDocumentByName,
    fetchRelationalData,
    insertDataInDB,
    updateDataInDB
} from '../db/utils'
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

    const user1 = await fetchDocumentByField<UsersCollection>(
        context.mongodb,
        MongoCollection.USER,
        'phone',
        input.phone
    )
    if (user1) throw new Error(`Phone is already used. Please try with another email.`)

    const user2 = await fetchDocumentByField<UsersCollection>(
        context.mongodb,
        MongoCollection.USER,
        'email',
        input.email
    )
    if (user2) throw new Error(`Email is already used. Please try with another email.`)

    const userDocument: UsersCollection = {
        id: uuid(),
        ...input,
        password: await hash(input.password ?? '9q$cx?^0BzuF,0(', bcryptConfig.saltRounds),
        createdAt: new Date().toISOString().toString()
    }
    const user3 = await fetchDocumentByName(context.mongodb, MongoCollection.USER, input.username)
    if (user3) throw new Error(`Username not available`)

    const createdUser = await insertDataInDB<UsersCollection, User>(context.mongodb, MongoCollection.USER, userDocument)
    return {success: !!createdUser, user: createdUser}
}

export async function updateUser(context: ResolverContext, input: UpdateUserInput): Promise<UserResponse> {
    logger.info(`Updating user with id: ${input.id}`)

    const user = await fetchDocumentByField<User>(context.mongodb, MongoCollection.USER, 'id', input.id)
    if (!user) {
        throw new Error(`User not found with id: ${input.id}`)
    }

    // Validate and prepare the update document
    const updateFields: Partial<UsersCollection> = {}

    if (input.email) {
        if (!isEmail(input.email)) throw new Error(`Invalid email format`)
        const emailExists = await fetchDocumentByField<UsersCollection>(
            context.mongodb,
            MongoCollection.USER,
            'email',
            input.email
        )
        if (emailExists && emailExists.id !== input.id) throw new Error(`Email is already used`)
        updateFields.email = input.email
    }

    if (input.phone) {
        if (!isMobilePhone(input.phone)) throw new Error(`Invalid phone number format`)
        const phoneExists = await fetchDocumentByField<UsersCollection>(
            context.mongodb,
            MongoCollection.USER,
            'phone',
            input.phone
        )
        if (phoneExists && phoneExists.id !== input.id) throw new Error(`Phone is already used`)
        updateFields.phone = input.phone
    }

    if (input.password) {
        if (!isStrongPassword(input.password)) {
            throw new Error(
                `Password is not strong enough. It should have at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.`
            )
        }
        updateFields.password = await hash(input.password, bcryptConfig.saltRounds) // Hash the new password with stronger configuration
    }

    if (input.username) {
        const usernameExists = await fetchDocumentByField<User>(
            context.mongodb,
            MongoCollection.USER,
            'username',
            input.username
        )
        if (usernameExists && usernameExists.id !== input.id) throw new Error(`Username not available`)
        updateFields.username = input.username
    }

    if (input.fullName) {
        updateFields.fullName = input.fullName
    }

    if (input.bio) {
        updateFields.bio = input.bio
    }

    if (input.profilePictureUri) {
        updateFields.profilePictureUri = input.profilePictureUri
    }

    if (input.profileBannerUri) {
        updateFields.profileBannerUri = input.profileBannerUri
    }

    const updatedUser = await updateDataInDB<UsersCollection, User>(
        context.mongodb,
        MongoCollection.USER,
        user.id,
        updateFields
    )

    return {success: !!updatedUser, user: updatedUser}
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
    logger.info(`User details: ${JSON.stringify(user)}`)
    const newPassword = input.password ?? '9q$cx?^0BzuF,0('
    logger.info(`New hashed: ${newPassword}`)
    const flg = await compare(newPassword, user.password)
    logger.info(`User details password match: ${flg}`)
    if (!flg) {
        return {success: false, error: 'Incorrect password'}
    }
    const payload: TokenPayloadInput = {
        id: user.id,
        createdAt: user.createdAt ?? `${user.createdAt}`
    }
    const token = await generateToken(context.mongodb, payload)
    return {success: !!token, token: token}
}
