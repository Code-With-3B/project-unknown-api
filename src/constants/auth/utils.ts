import {Db} from 'mongodb'
import {TokenPayloadInput} from '../../generated/sign-in'
import {checkAccessTokenIsValid} from '../../core/services/access.token.service'
import {createOrUpdateAccessToken} from '../../core/db/collections/access.token.db'
import jwt from 'jsonwebtoken'

import {logger, serverConfig} from '../../config'

/**
 * Generate a JWT token with the provided payload.
 * @param payload The payload to be included in the JWT token.
 * @returns The generated JWT token.
 */
export async function generateToken(db: Db, payload: TokenPayloadInput): Promise<string> {
    const token = jwt.sign(payload, serverConfig.jwt.jwtSecreteKey, {
        expiresIn: serverConfig.jwt.jwtExpirationTime,
        algorithm: 'HS256'
    })
    await createOrUpdateAccessToken(db, token, payload)
    return token
}

/**
 * Verify the provided JWT token.
 * @param token The JWT token to verify.
 * @returns A boolean indicating whether the token is valid (true) or not (false).
 */
export async function verifyToken(db: Db, token: string): Promise<boolean> {
    try {
        const isActive = await checkAccessTokenIsValid(db, token)
        if (isActive) {
            await jwt.verify(token, serverConfig.jwt.jwtSecreteKey)
            return true
        }
        return false
    } catch (error) {
        return false
    }
}

export const bcryptConfig = {
    saltRounds: 12 // Increase the number of salt rounds for stronger hashing
}

export function generateTokenForInvitation(expiresIn: string): string {
    const token = jwt.sign({id: 'test'}, serverConfig.invitation.team.jwtSecreteKey, {
        expiresIn
    })
    return token
}

export function verifyInvitationToken(token: string): boolean {
    try {
        jwt.verify(token, serverConfig.invitation.team.jwtSecreteKey)
        logger.error('Invitation is active')
        return true
    } catch (error) {
        logger.error('Invitation is expired')
        return false
    }
}
