import {ErrorCode} from '../../../constants/error-codes'
import {MongoCollection} from '../../../@types/collections'
import {ResolverContext} from '../../../@types/context'
import {UsersCollection} from '../../../generated/mongo-types'
import {bcryptConfig} from '../../../constants/auth/utils'
import {hash} from 'bcrypt'
import {logger} from '../../../config'

import {AuthMode, UpdateUserInput, User, UserResponse} from '../../../generated/graphql'
import {doesDocumentExistByField, fetchDocumentByField, updateDataInDBWithoutReturn} from '../../db/utils'
import {isEmail, isMobilePhone, isStrongPassword} from 'class-validator'

export async function updateUser(context: ResolverContext, input: UpdateUserInput): Promise<UserResponse> {
    logger.info(`Initiating user update for userID: ${input.id}`)

    try {
        const user = await fetchDocumentByField<User>(context.mongodb, MongoCollection.USER, 'id', input.id)
        if (!user) {
            logger.error(`User not found with id: ${input.id}`)
            return {success: false, code: [ErrorCode.USER_NOT_FOUND]}
        }

        const updateFields: Partial<UsersCollection> = {}

        if (input.password) {
            if (!isStrongPassword(input.password)) {
                logger.error(`Weak password provided`)
                return {success: false, code: [ErrorCode.WEAK_PASSWORD]}
            }
            updateFields.password = await hash(input.password, bcryptConfig.saltRounds)
        }

        if (input.email) {
            if (
                user.authMode === AuthMode.EmailPass ||
                user.authMode === AuthMode.Google ||
                user.authMode === AuthMode.Apple ||
                user.authMode === AuthMode.Facebook
            ) {
                return {success: false, code: [ErrorCode.CANT_MODIFY_EMAIL]}
            }
            if (!isEmail(input.email)) {
                logger.error(`Invalid email format: ${input.email}`)
                return {success: false, code: [ErrorCode.INVALID_EMAIL_FORMAT]}
            }
            if (user.email != input.email) {
                if (
                    !(await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {
                        email: input.email
                    }))
                )
                    updateFields.email = input.email
                else return {success: false, code: [ErrorCode.DUPLICATE_EMAIL]}
            }
        }

        if (input.phone) {
            if (user.authMode === AuthMode.PhonePass) {
                return {success: false, code: [ErrorCode.CANT_MODIFY_PHONE]}
            }
            if (!isMobilePhone(input.phone)) {
                logger.error(`Invalid phone number format: ${input.phone}`)
                return {success: false, code: [ErrorCode.INVALID_PHONE_FORMAT]}
            }
            if (user.phone != input.phone) {
                if (
                    !(await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {
                        phone: input.phone
                    }))
                )
                    updateFields.phone = input.phone
                else return {success: false, code: [ErrorCode.DUPLICATE_PHONE]}
            }
        }

        if (input.username) {
            if (input.username.length < 6) {
                logger.error(`Invalid username length: ${input.username}`)
                return {success: false, code: [ErrorCode.INVALID_USERNAME_LENGTH]}
            }
            if (user.username != input.username) {
                if (
                    !(await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {
                        username: input.username
                    }))
                )
                    updateFields.username = input.username
                else return {success: false, code: [ErrorCode.USERNAME_UNAVAILABLE]}
            }
        }
        if (input.fullName && input.fullName != user.fullName) updateFields.fullName = input.fullName
        if (input.bio && input.bio != user.bio) updateFields.bio = input.bio
        if (input.gender && input.gender != user.gender) updateFields.gender = input.gender
        if (input.birthday && input.birthday != user.birthday) updateFields.birthday = input.birthday
        if (input.accountVisibility && input.accountVisibility != user.accountVisibility)
            updateFields.accountVisibility = input.accountVisibility
        if (input.accountState && input.accountState != user.accountState)
            updateFields.accountState = input.accountState
        if (input.verificationStatus && input.verificationStatus != user.verificationStatus)
            updateFields.verificationStatus = input.verificationStatus

        if (Object.keys(updateFields).length > 0) {
            updateFields.updatedAt = new Date().toISOString()
            const isValidUpdate = await updateDataInDBWithoutReturn<UsersCollection>(
                context.mongodb,
                MongoCollection.USER,
                user.id,
                updateFields
            )

            logger.info(`User update successful for userID: ${input.id}`)
            return {
                success: isValidUpdate,
                code: [isValidUpdate ? ErrorCode.USER_UPDATED : ErrorCode.USER_UPDATE_FAILED]
            }
        }
        return {
            success: false,
            code: [ErrorCode.NO_FIELDS_TO_UPDATE]
        }
    } catch (error) {
        logger.error(`Error updating user with userID: ${input.id} with: ${error}`)
        logger.error(error)
        throw error
    }
}
