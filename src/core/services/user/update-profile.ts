import {AuthMode} from '../../../generated/sign-in'
import {ErrorCode} from '../../../constants/error-codes'
import {MongoCollection} from '../../../@types/collections'
import {ResolverContext} from '../../../@types/context'
import {UsersCollection} from '../../../generated/mongo-types'
import {bcryptConfig} from '../../../constants/auth/utils'
import {hash} from 'bcrypt'
import {logger} from '../../../config'

import {UpdateUserInput, User, UserResponse} from '../../../generated/user'
import {doesDocumentExistByField, fetchDocumentByField, updateDataInDBWithoutReturn} from '../../db/utils'
import {isEmail, isMobilePhone, isStrongPassword} from 'class-validator'

/**
 * Updates user information based on the provided input.
 * @param context The resolver context containing the MongoDB database instance.
 * @param input The input data for updating the user.
 * @returns A Promise that resolves to a UserResponse indicating success or failure.
 */
export async function updateUser(context: ResolverContext, input: UpdateUserInput): Promise<UserResponse> {
    logger.info(`Initiating user update for userID: ${input.id}`)

    try {
        // Fetch existing user document
        const user = await fetchDocumentByField<User>(context.mongodb, MongoCollection.USER, 'id', input.id)
        if (!user) {
            logger.error(`User not found with id: ${input.id}`)
            return {success: false, code: [ErrorCode.USER_NOT_FOUND]}
        }

        const updateFields: Partial<UsersCollection> = {}

        // Handle password update
        if (input.password) {
            if (!isStrongPassword(input.password)) {
                logger.error(`Weak password provided for userID: ${input.id}`)
                return {success: false, code: [ErrorCode.WEAK_PASSWORD]}
            }
            updateFields.password = await hash(input.password, bcryptConfig.saltRounds)
        }

        // Handle email update
        if (input.email) {
            if (
                user.authMode === AuthMode.EmailPass ||
                user.authMode === AuthMode.Google ||
                user.authMode === AuthMode.Apple ||
                user.authMode === AuthMode.Facebook
            ) {
                logger.error(`Attempt to modify email for user with auth mode: ${user.authMode}`)
                return {success: false, code: [ErrorCode.CANT_MODIFY_EMAIL]}
            }
            if (!isEmail(input.email)) {
                logger.error(`Invalid email format: ${input.email}`)
                return {success: false, code: [ErrorCode.INVALID_EMAIL_FORMAT]}
            }
            if (user.email !== input.email) {
                if (
                    !(await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {
                        email: input.email
                    }))
                ) {
                    updateFields.email = input.email
                } else {
                    logger.error(`Duplicate email found: ${input.email}`)
                    return {success: false, code: [ErrorCode.DUPLICATE_EMAIL]}
                }
            }
        }

        // Handle phone update
        if (input.phone) {
            if (user.authMode === AuthMode.PhonePass) {
                logger.error(`Attempt to modify phone number for user with PhonePass auth mode`)
                return {success: false, code: [ErrorCode.CANT_MODIFY_PHONE]}
            }
            if (!isMobilePhone(input.phone)) {
                logger.error(`Invalid phone number format: ${input.phone}`)
                return {success: false, code: [ErrorCode.INVALID_PHONE_FORMAT]}
            }
            if (user.phone !== input.phone) {
                if (
                    !(await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {
                        phone: input.phone
                    }))
                ) {
                    updateFields.phone = input.phone
                } else {
                    logger.error(`Duplicate phone number found: ${input.phone}`)
                    return {success: false, code: [ErrorCode.DUPLICATE_PHONE]}
                }
            }
        }

        // Handle username update
        if (input.username) {
            if (input.username.length < 6) {
                logger.error(`Invalid username length: ${input.username}`)
                return {success: false, code: [ErrorCode.INVALID_USERNAME_LENGTH]}
            }
            if (user.username !== input.username) {
                if (
                    !(await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {
                        username: input.username
                    }))
                ) {
                    updateFields.username = input.username
                } else {
                    logger.error(`Username already taken: ${input.username}`)
                    return {success: false, code: [ErrorCode.USERNAME_UNAVAILABLE]}
                }
            }
        }

        // Handle other fields
        if (input.fullName && input.fullName !== user.fullName) updateFields.fullName = input.fullName
        if (input.bio && input.bio !== user.bio) updateFields.bio = input.bio
        if (input.gender && input.gender !== user.gender) updateFields.gender = input.gender
        if (input.birthday && input.birthday !== user.birthday) updateFields.birthday = input.birthday
        if (input.accountVisibility && input.accountVisibility !== user.accountVisibility)
            updateFields.accountVisibility = input.accountVisibility
        if (input.accountState && input.accountState !== user.accountState)
            updateFields.accountState = input.accountState
        if (input.verificationStatus && input.verificationStatus !== user.verificationStatus)
            updateFields.verificationStatus = input.verificationStatus
        if (input.profilePictureUri && input.profilePictureUri !== user.profilePicture)
            updateFields.profilePicture = input.profilePictureUri
        if (input.profileBannerUri && input.profileBannerUri !== user.profileBanner)
            updateFields.profileBanner = input.profileBannerUri
        if (input.location && input.location !== user.location) updateFields.location = input.location

        // If there are fields to update, perform the update operation
        if (Object.keys(updateFields).length > 0) {
            updateFields.updatedAt = new Date().toISOString()
            const isValidUpdate = await updateDataInDBWithoutReturn<UsersCollection>(
                context.mongodb,
                MongoCollection.USER,
                user.id,
                updateFields
            )

            if (isValidUpdate) {
                logger.info(`User update successful for userID: ${input.id}`)
            } else {
                logger.error(`User update failed for userID: ${input.id}`)
            }
            return {
                success: isValidUpdate,
                code: [isValidUpdate ? ErrorCode.USER_UPDATED : ErrorCode.USER_UPDATE_FAILED]
            }
        }

        // No fields to update
        logger.info(`No fields to update for userID: ${input.id}`)
        return {
            success: false,
            code: [ErrorCode.NO_FIELDS_TO_UPDATE]
        }
    } catch (error) {
        logger.error(`Error updating user with userID: ${input.id}`, error)
        return {success: false, code: [ErrorCode.GENERIC_ERROR]}
    }
}
