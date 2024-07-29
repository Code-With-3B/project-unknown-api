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
 * Creates a new user in the database based on the provided input and authentication mode.
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
        logger.error('Invalid user authentication mode')
        return {success: false, code: [ErrorCode.INVALID_USER_AUTH_MODE]}
    }
}

/**
 * Validates common fields for user sign-up such as username.
 * @param context The resolver context containing the MongoDB database instance.
 * @param input The input data for creating a new user.
 * @returns A Promise that resolves to an array of error codes if there are any validation errors.
 */
async function validateCommonFields(context: ResolverContext, input: SignUpInput): Promise<string[]> {
    const errors: string[] = []

    if (!input.username || input.username.length < 6) {
        errors.push(ErrorCode.INVALID_USERNAME_LENGTH)
    } else if (await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {username: input.username})) {
        logger.info(`Username already exists: ${input.username}`)
        errors.push(ErrorCode.USERNAME_UNAVAILABLE)
    }
    return errors
}

/**
 * Creates a new user document in the database.
 * @param context The resolver context containing the MongoDB database instance.
 * @param input The input data for creating a new user.
 * @param email The user's email address.
 * @param phone The user's phone number.
 * @param passwordHash The hashed password for the user.
 * @param verificationStatus The verification status of the user.
 * @returns A Promise that resolves to a UserResponse indicating success or failure.
 */
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
        username: input.username,
        fullName: input.username ?? '',
        email,
        phone,
        password: passwordHash,
        gender: GenderType.NotMentioned,
        profilePicture: '',
        profileBanner: '',
        birthday: '',
        location: '',
        bio: '',
        preferredGames: [],
        achievements: [],
        skills: [],
        highlights: [],
        teams: [],
        fbToken: '',
        accountState: AccountStateType.Active,
        accountVisibility: AccountVisibilityType.Public,
        verificationStatus: verificationStatus,
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

/**
 * Handles sign-up using email and password authentication mode.
 * @param context The resolver context containing the MongoDB database instance.
 * @param input The input data for creating a new user.
 * @returns A Promise that resolves to a UserResponse indicating success or failure.
 */
export async function withEmailPass(context: ResolverContext, input: SignUpInput): Promise<UserResponse> {
    logger.info(`Sign-up attempt with email: ${input.email}`)

    if (!input.email) {
        logger.error('Missing email')
        return {success: false, code: [ErrorCode.MISSING_EMAIL]}
    }
    if (!isEmail(input.email)) {
        logger.error('Invalid email format')
        return {success: false, code: [ErrorCode.INVALID_EMAIL_FORMAT]}
    }
    if (!input.password) {
        logger.error('Missing password')
        return {success: false, code: [ErrorCode.MISSING_PASSWORD]}
    }
    if (!isStrongPassword(input.password)) {
        logger.error('Weak password')
        return {success: false, code: [ErrorCode.WEAK_PASSWORD]}
    }
    if (
        await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {
            email: input.email,
            authMode: input.authMode
        })
    ) {
        logger.info(`User already exists with email: ${input.email} and auth mode: ${input.authMode}`)
        return {success: false, code: [ErrorCode.DUPLICATE_EMAIL]}
    }

    const errors = await validateCommonFields(context, input)
    if (errors.length > 0) {
        logger.error('Validation errors: ', errors)
        return {success: false, code: errors}
    }

    const passwordHash = await hash(input.password, bcryptConfig.saltRounds)
    return createUserDocument(context, input, input.email, '', passwordHash, input.verificationStatus)
}

/**
 * Handles sign-up using phone number and password authentication mode.
 * @param context The resolver context containing the MongoDB database instance.
 * @param input The input data for creating a new user.
 * @returns A Promise that resolves to a UserResponse indicating success or failure.
 */
export async function withPhonePass(context: ResolverContext, input: SignUpInput): Promise<UserResponse> {
    logger.info(`Sign-up attempt with phone: ${input.phone}`)

    if (!input.phone) {
        logger.error('Missing phone number')
        return {success: false, code: [ErrorCode.MISSING_PHONE]}
    }
    if (!isMobilePhone(input.phone)) {
        logger.error('Invalid phone number format')
        return {success: false, code: [ErrorCode.INVALID_PHONE_FORMAT]}
    }
    if (!input.password) {
        logger.error('Missing password')
        return {success: false, code: [ErrorCode.MISSING_PASSWORD]}
    }
    if (!isStrongPassword(input.password)) {
        logger.error('Weak password')
        return {success: false, code: [ErrorCode.WEAK_PASSWORD]}
    }

    if (await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {phone: input.phone})) {
        logger.info(`User already exists with phone: ${input.phone} and auth mode: ${input.authMode}`)
        return {success: false, code: [ErrorCode.DUPLICATE_PHONE]}
    }

    const errors = await validateCommonFields(context, input)
    if (errors.length > 0) {
        logger.error('Validation errors: ', errors)
        return {success: false, code: errors}
    }

    const passwordHash = await hash(input.password, bcryptConfig.saltRounds)
    return createUserDocument(context, input, '', input.phone, passwordHash)
}

/**
 * Handles sign-up using social media authentication mode (Google, Facebook, Apple).
 * @param context The resolver context containing the MongoDB database instance.
 * @param input The input data for creating a new user.
 * @returns A Promise that resolves to a UserResponse indicating success or failure.
 */
export async function withSocial(context: ResolverContext, input: SignUpInput): Promise<UserResponse> {
    logger.info(`Sign-up attempt with social media: ${input.authMode} and email: ${input.email}`)

    if (!input.email) {
        logger.error('Missing email')
        return {success: false, code: [ErrorCode.MISSING_EMAIL]}
    }

    if (
        await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {
            email: input.email,
            authMode: input.authMode
        })
    ) {
        logger.info(`User already exists with email: ${input.email} and auth mode: ${input.authMode}`)
        return {success: false, code: [ErrorCode.DUPLICATE_EMAIL]}
    }

    const errors = await validateCommonFields(context, input)
    if (errors.length > 0) {
        logger.error('Validation errors: ', errors)
        return {success: false, code: errors}
    }

    const passwordHash = await hash(uuid(), bcryptConfig.saltRounds)
    return createUserDocument(context, input, input.email, '', passwordHash)
}
