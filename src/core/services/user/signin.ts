import {ErrorCode} from '../../../constants/error-codes'
import {MongoCollection} from '../../../@types/collections'
import {ResolverContext} from '../../../@types/context'
import {UsersCollection} from '../../../generated/mongo-types'
import {compare} from 'bcrypt'
import {generateToken} from '../../../constants/auth/utils'
import {logger} from '../../../config'

import {AuthMode, SignInInput, SignInResponse, TokenPayloadInput} from '../../../generated/sign-in'
import {
    fetchDocumentForValidEmail,
    fetchDocumentForValidPhone,
    fetchDocumentForValidSocial,
    fetchDocumentForValidUsername,
    updateDataInDBWithoutReturn
} from '../../db/utils'

/**
 * Handles the sign-in process based on the provided input and authentication mode.
 * @param context The resolver context, which includes the MongoDB instance.
 * @param input The sign-in input containing user credentials and other information.
 * @returns {Promise<SignInResponse>} A promise that resolves to the sign-in response.
 */
export async function signIn(context: ResolverContext, input: SignInInput): Promise<SignInResponse> {
    if (!input.fbToken) {
        logger.info('Missing Firebase notification token')
        return {success: false, code: [ErrorCode.MISSING_NOTIFICATION_TOKEN]}
    }

    if (input.authMode && Object.values(AuthMode).includes(input.authMode)) {
        logger.info(`Sign-in attempt with auth mode: ${input.authMode}`)
        switch (input.authMode) {
            case AuthMode.UsernamePass:
                return withUsernamePass(context, input)
            case AuthMode.EmailPass:
                return withEmailPass(context, input)
            case AuthMode.PhonePass:
                return withPhonePass(context, input)
            case AuthMode.Google:
            case AuthMode.Facebook:
            case AuthMode.Apple:
                return withSocial(context, input)
        }
    }
    logger.error('Invalid user authentication mode')
    return {success: false, code: [ErrorCode.INVALID_USER_AUTH_MODE]}
}

/**
 * Handles sign-in using username and password authentication mode.
 * @param context The resolver context, which includes the MongoDB instance.
 * @param input The sign-in input containing username and password.
 * @returns {Promise<SignInResponse>} A promise that resolves to the sign-in response.
 */
async function withUsernamePass(context: ResolverContext, input: SignInInput): Promise<SignInResponse> {
    if (!input.username) {
        logger.info('Missing username')
        return {success: false, code: [ErrorCode.MISSING_USERNAME]}
    }
    if (!input.password) {
        logger.info('Missing password')
        return {success: false, code: [ErrorCode.MISSING_PASSWORD]}
    }

    const user = await fetchDocumentForValidUsername<UsersCollection>(
        context.mongodb,
        MongoCollection.USER,
        input.username
    )
    if (!user) {
        logger.info(`No user found for username: ${input.username}`)
        return {success: false, code: [ErrorCode.NO_USER_FOUND]}
    }
    const isValid = await compare(input.password, user.password)
    if (!isValid) {
        logger.info('Incorrect password')
        return {success: false, code: [ErrorCode.INCORRECT_PASSWORD]}
    }
    const payload: TokenPayloadInput = {
        id: user.id,
        createdAt: user.createdAt ?? `${user.createdAt}`
    }
    const token = await generateToken(context.mongodb, payload)
    const updateFields: Partial<UsersCollection> = {}
    updateFields.fbToken = input.fbToken ?? ''
    updateFields.updatedAt = new Date().toISOString()
    await updateDataInDBWithoutReturn<UsersCollection>(context.mongodb, MongoCollection.USER, user.id, updateFields)
    logger.info(`Firebase notification token added for user: ${user.id}`)
    return {success: !!token, code: [token ? ErrorCode.TOKEN_GRANTED : ErrorCode.TOKEN_DENIED], token: token}
}

/**
 * Handles sign-in using email and password authentication mode.
 * @param context The resolver context, which includes the MongoDB instance.
 * @param input The sign-in input containing email and password.
 * @returns {Promise<SignInResponse>} A promise that resolves to the sign-in response.
 */
async function withEmailPass(context: ResolverContext, input: SignInInput): Promise<SignInResponse> {
    if (!input.email) {
        logger.info('Missing email')
        return {success: false, code: [ErrorCode.MISSING_EMAIL]}
    }
    if (!input.password) {
        logger.info('Missing password')
        return {success: false, code: [ErrorCode.MISSING_PASSWORD]}
    }

    const user = await fetchDocumentForValidEmail<UsersCollection>(context.mongodb, MongoCollection.USER, input.email)
    if (!user) {
        logger.info(`No user found for email: ${input.email}`)
        return {success: false, code: [ErrorCode.NO_USER_FOUND]}
    }
    const isValid = await compare(input.password, user.password)
    if (!isValid) {
        logger.info('Incorrect password')
        return {success: false, code: [ErrorCode.INCORRECT_PASSWORD]}
    }
    const payload: TokenPayloadInput = {
        id: user.id,
        createdAt: user.createdAt ?? `${user.createdAt}`
    }
    const token = await generateToken(context.mongodb, payload)
    const updateFields: Partial<UsersCollection> = {}
    updateFields.fbToken = input.fbToken ?? ''
    updateFields.updatedAt = new Date().toISOString()
    await updateDataInDBWithoutReturn<UsersCollection>(context.mongodb, MongoCollection.USER, user.id, updateFields)
    logger.info(`Firebase notification token added for user: ${user.id}`)
    return {success: !!token, code: [token ? ErrorCode.TOKEN_GRANTED : ErrorCode.TOKEN_DENIED], token: token}
}

/**
 * Handles sign-in using phone number and password authentication mode.
 * @param context The resolver context, which includes the MongoDB instance.
 * @param input The sign-in input containing phone number and password.
 * @returns {Promise<SignInResponse>} A promise that resolves to the sign-in response.
 */
async function withPhonePass(context: ResolverContext, input: SignInInput): Promise<SignInResponse> {
    if (!input.phone) {
        logger.info('Missing phone number')
        return {success: false, code: [ErrorCode.MISSING_PHONE]}
    }
    if (!input.password) {
        logger.info('Missing password')
        return {success: false, code: [ErrorCode.MISSING_PASSWORD]}
    }

    const user = await fetchDocumentForValidPhone<UsersCollection>(context.mongodb, MongoCollection.USER, input.phone)
    if (!user) {
        logger.info(`No user found for phone number: ${input.phone}`)
        return {success: false, code: [ErrorCode.NO_USER_FOUND]}
    }
    const isValid = await compare(input.password, user.password)
    if (!isValid) {
        logger.info('Incorrect password')
        return {success: false, code: [ErrorCode.INCORRECT_PASSWORD]}
    }
    const payload: TokenPayloadInput = {
        id: user.id,
        createdAt: user.createdAt ?? `${user.createdAt}`
    }
    const token = await generateToken(context.mongodb, payload)
    const updateFields: Partial<UsersCollection> = {}
    updateFields.fbToken = input.fbToken ?? ''
    updateFields.updatedAt = new Date().toISOString()
    await updateDataInDBWithoutReturn<UsersCollection>(context.mongodb, MongoCollection.USER, user.id, updateFields)
    logger.info(`Firebase notification token added for user: ${user.id}`)
    return {success: !!token, code: [token ? ErrorCode.TOKEN_GRANTED : ErrorCode.TOKEN_DENIED], token: token}
}

/**
 * Handles sign-in using social media authentication mode (Google, Facebook, Apple).
 * @param context The resolver context, which includes the MongoDB instance.
 * @param input The sign-in input containing email and authentication mode.
 * @returns {Promise<SignInResponse>} A promise that resolves to the sign-in response.
 */
async function withSocial(context: ResolverContext, input: SignInInput): Promise<SignInResponse> {
    if (!input.email) {
        logger.info('Missing email')
        return {success: false, code: [ErrorCode.MISSING_EMAIL]}
    }

    const user = await fetchDocumentForValidSocial<UsersCollection>(
        context.mongodb,
        MongoCollection.USER,
        input.email,
        input.authMode
    )
    if (!user) {
        logger.info(`No user found for email: ${input.email} with auth mode: ${input.authMode}`)
        return {success: false, code: [ErrorCode.NO_USER_FOUND]}
    }
    const payload: TokenPayloadInput = {
        id: user.id,
        createdAt: user.createdAt ?? `${user.createdAt}`
    }
    const token = await generateToken(context.mongodb, payload)
    const updateFields: Partial<UsersCollection> = {}
    updateFields.fbToken = input.fbToken ?? ''
    updateFields.updatedAt = new Date().toISOString()
    await updateDataInDBWithoutReturn<UsersCollection>(context.mongodb, MongoCollection.USER, user.id, updateFields)
    logger.info(`Firebase notification token added for user: ${user.id}`)
    return {success: !!token, code: [token ? ErrorCode.TOKEN_GRANTED : ErrorCode.TOKEN_DENIED], token: token}
}
