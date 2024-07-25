import {ErrorCode} from '../../../constants/error-codes'
import {MongoCollection} from '../../../@types/collections'
import {ResolverContext} from '../../../@types/context'
import {UsersCollection} from '../../../generated/mongo-types'
import {VerificationStatusType} from './../../../generated/user'
import {bcryptConfig} from '../../../constants/auth/utils'
import {hash} from 'bcrypt'
import {logger} from '../../../config'
import {v4 as uuid} from 'uuid'

import {
    AccountStateType,
    AccountVisibilityType,
    AuthMode,
    GenderType,
    SignUpInput,
    UserResponse
} from '../../../generated/user'
import {doesDocumentExistByField, insertDataInDBWithoutData} from '../../db/utils'
import {isEmail, isMobilePhone, isStrongPassword} from 'class-validator'

/**
 * Creates a new user in the database.
 * @param context The resolver context containing the MongoDB database instance.
 * @param input The input data for creating a new user.
 * @returns A Promise that resolves to a UserResponse indicating success or failure.
 */
export async function signup(context: ResolverContext, input: SignUpInput): Promise<UserResponse> {
    logger.info(`Initiating user sign-up with ${input.authMode == AuthMode.PhonePass ? input.phone : input.email}`)

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
    } else {
        return {success: false, code: [ErrorCode.INVALID_USER_AUTH_MODE]}
    }
}

async function validateCommonFields(context: ResolverContext, input: SignUpInput): Promise<string[]> {
    const errors: string[] = []

    if (!input.username || input.username.length < 6) {
        errors.push(ErrorCode.INVALID_USERNAME_LENGTH)
    } else if (await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {username: input.username})) {
        logger.info(`Username already exists ${input.username}`)
        errors.push(ErrorCode.USERNAME_UNAVAILABLE)
    }
    return errors
}

async function createUserDocument(
    context: ResolverContext,
    input: SignUpInput,
    email: string,
    phone: string,
    passwordHash: string,
    verificationStatus: VerificationStatusType = VerificationStatusType.VerifiedUser
): Promise<UserResponse> {
    const id = uuid()
    const userDocument: UsersCollection = {
        id,
        authMode: input.authMode,
        fullName: input.fullName ?? input.username,
        username: input.username,
        email,
        phone,
        bio: '',
        birthday: input.birthday ?? '',
        password: passwordHash,
        gender: input?.gender ?? GenderType.PreferNotSay,
        accountState: AccountStateType.Active,
        accountVisibility: AccountVisibilityType.Public,
        verificationStatus: verificationStatus,
        fbToken: '',
        preferredGames: [],
        achievements: [],
        skills: [],
        highlights: [],
        createdAt: new Date().toISOString()
    }

    const createdUser = await insertDataInDBWithoutData<UsersCollection>(
        context.mongodb,
        MongoCollection.USER,
        userDocument
    )
    logger.info(`User onboarding ${createdUser ? 'Successful' : 'Failed'}`)

    return {
        success: !!createdUser,
        code: [createdUser ? ErrorCode.USER_CREATION_SUCCESS : ErrorCode.USER_CREATION_FAILED]
    }
}

export async function withEmailPass(context: ResolverContext, input: SignUpInput): Promise<UserResponse> {
    if (!input.email) return {success: false, code: [ErrorCode.MISSING_EMAIL]}
    if (!isEmail(input.email)) return {success: false, code: [ErrorCode.INVALID_EMAIL_FORMAT]}
    if (!input.password) return {success: false, code: [ErrorCode.MISSING_PASSWORD]}
    if (!isStrongPassword(input.password)) return {success: false, code: [ErrorCode.WEAK_PASSWORD]}
    if (
        await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {
            email: input.email,
            authMode: input.authMode
        })
    ) {
        logger.info(`User already exists with ${input.email} and ${input.authMode}`)
        return {success: false, code: [ErrorCode.DUPLICATE_EMAIL]}
    }

    const errors = await validateCommonFields(context, input)
    if (errors.length > 0) return {success: false, code: errors}

    const passwordHash = await hash(input.password, bcryptConfig.saltRounds)
    return createUserDocument(context, input, input.email, '', passwordHash, input.verificationStatus)
}

export async function withPhonePass(context: ResolverContext, input: SignUpInput): Promise<UserResponse> {
    if (!input.phone) return {success: false, code: [ErrorCode.MISSING_PHONE]}
    if (!isMobilePhone(input.phone)) return {success: false, code: [ErrorCode.INVALID_EMAIL_FORMAT]}
    if (!input.password) return {success: false, code: [ErrorCode.MISSING_PASSWORD]}
    if (!isStrongPassword(input.password)) return {success: false, code: [ErrorCode.WEAK_PASSWORD]}

    if (await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {phone: input.phone})) {
        logger.info(`User already exists with ${input.phone} and ${input.authMode}`)
        return {success: false, code: [ErrorCode.DUPLICATE_PHONE]}
    }

    const errors = await validateCommonFields(context, input)
    if (errors.length > 0) return {success: false, code: errors}

    const passwordHash = await hash(input.password, bcryptConfig.saltRounds)
    return createUserDocument(context, input, '', input.phone, passwordHash)
}

export async function withSocial(context: ResolverContext, input: SignUpInput): Promise<UserResponse> {
    if (!input.email) return {success: false, code: [ErrorCode.MISSING_EMAIL]}

    if (
        await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {
            email: input.email,
            authMode: input.authMode
        })
    ) {
        logger.info(`User already exists with ${input.email} and ${input.authMode}`)
        return {success: false, code: [ErrorCode.DUPLICATE_EMAIL]}
    }

    const errors = await validateCommonFields(context, input)
    if (errors.length > 0) return {success: false, code: errors}

    const passwordHash = await hash(uuid(), bcryptConfig.saltRounds)
    return createUserDocument(context, input, input.email, '', passwordHash)
}
