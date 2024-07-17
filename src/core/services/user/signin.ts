import {ErrorCode} from '../../../constants/error-codes'
import {MongoCollection} from '../../../@types/collections'
import {ResolverContext} from '../../../@types/context'
import {UsersCollection} from '../../../generated/mongo-types'
import {compare} from 'bcrypt'
import {createOrUpdateAccessToken} from '../../db/collections/access.token.db'
import {generateToken} from '../../../constants/auth/utils'
import {logger} from '../../../config'

import {AuthMode, SignInInput, SignInResponse, TokenPayloadInput} from '../../../generated/graphql'
import {
    fetchDocumentForValidEmail,
    fetchDocumentForValidPhone,
    fetchDocumentForValidSocial,
    updateDataInDBWithoutReturn
} from '../../db/utils'

export async function signIn(context: ResolverContext, input: SignInInput): Promise<SignInResponse> {
    if (!input.fbToken) {
        return {success: false, code: [ErrorCode.MISSING_NOTIFICATION_TOKEN]}
    }

    if (input.authMode && Object.values(AuthMode).includes(input.authMode)) {
        switch (input.authMode) {
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
    return {success: false, code: [ErrorCode.INVALID_USER_AUTH_MODE]}
}

async function withEmailPass(context: ResolverContext, input: SignInInput): Promise<SignInResponse> {
    if (!input.email) return {success: false, code: [ErrorCode.MISSING_EMAIL]}
    if (!input.password) return {success: false, code: [ErrorCode.MISSING_PASSWORD]}

    const user = await fetchDocumentForValidEmail<UsersCollection>(context.mongodb, MongoCollection.USER, input.email)
    if (!user) return {success: false, code: [ErrorCode.NO_USER_FOUND]}
    const isValid = await compare(input.password, user.password)
    if (!isValid) return {success: false, code: [ErrorCode.INCORRECT_PASSWORD]}
    const payload: TokenPayloadInput = {
        id: user.id,
        createdAt: user.createdAt ?? `${user.createdAt}`
    }
    const token = await generateToken(context.mongodb, payload)
    const updateFields: Partial<UsersCollection> = {}
    updateFields.fbToken = input.fbToken ?? ''
    updateFields.updatedAt = new Date().toISOString()
    await updateDataInDBWithoutReturn<UsersCollection>(context.mongodb, MongoCollection.USER, user.id, updateFields)
    await createOrUpdateAccessToken(context.mongodb, token, {id: user.id, createdAt: user.createdAt ?? ''})
    logger.info(`Added firebase notification token added`)
    return {success: !!token, code: [token ? ErrorCode.TOKEN_GRANTED : ErrorCode.TOKEN_DENIED], token: token}
}

async function withPhonePass(context: ResolverContext, input: SignInInput): Promise<SignInResponse> {
    if (!input.phone) return {success: false, code: [ErrorCode.MISSING_PHONE]}
    if (!input.password) return {success: false, code: [ErrorCode.MISSING_PASSWORD]}

    const user = await fetchDocumentForValidPhone<UsersCollection>(context.mongodb, MongoCollection.USER, input.phone)
    if (!user) return {success: false, code: [ErrorCode.NO_USER_FOUND]}
    const isValid = await compare(input.password, user.password)
    if (!isValid) return {success: false, code: [ErrorCode.INCORRECT_PASSWORD]}
    const payload: TokenPayloadInput = {
        id: user.id,
        createdAt: user.createdAt ?? `${user.createdAt}`
    }
    const token = await generateToken(context.mongodb, payload)
    const updateFields: Partial<UsersCollection> = {}
    updateFields.fbToken = input.fbToken ?? ''
    updateFields.updatedAt = new Date().toISOString()
    await updateDataInDBWithoutReturn<UsersCollection>(context.mongodb, MongoCollection.USER, user.id, updateFields)
    logger.info(`Added firebase notification token added`)
    return {success: !!token, code: [token ? ErrorCode.TOKEN_GRANTED : ErrorCode.TOKEN_DENIED], token: token}
}

async function withSocial(context: ResolverContext, input: SignInInput): Promise<SignInResponse> {
    if (!input.email) return {success: false, code: [ErrorCode.MISSING_EMAIL]}

    const user = await fetchDocumentForValidSocial<UsersCollection>(
        context.mongodb,
        MongoCollection.USER,
        input.email,
        input.authMode
    )
    if (!user) return {success: false, code: [ErrorCode.NO_USER_FOUND]}
    const payload: TokenPayloadInput = {
        id: user.id,
        createdAt: user.createdAt ?? `${user.createdAt}`
    }
    const token = await generateToken(context.mongodb, payload)
    const updateFields: Partial<UsersCollection> = {}
    updateFields.fbToken = input.fbToken ?? ''
    updateFields.updatedAt = new Date().toISOString()
    await updateDataInDBWithoutReturn<UsersCollection>(context.mongodb, MongoCollection.USER, user.id, updateFields)
    logger.info(`Added firebase notification token added`)
    return {success: !!token, code: [token ? ErrorCode.TOKEN_GRANTED : ErrorCode.TOKEN_DENIED], token: token}
}
