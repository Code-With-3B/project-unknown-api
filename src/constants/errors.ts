// errors.ts
export enum ErrorCode {
    // General errors
    GENERIC_ERROR = 'GENERIC_ERROR',

    // User creation errors
    DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',
    DUPLICATE_PHONE = 'DUPLICATE_PHONE',
    USERNAME_UNAVAILABLE = 'USERNAME_UNAVAILABLE',

    // User update errors
    EMAIL_ALREADY_USED = 'EMAIL_ALREADY_USED',
    PHONE_ALREADY_USED = 'PHONE_ALREADY_USED',
    USERNAME_NOT_AVAILABLE = 'USERNAME_NOT_AVAILABLE',

    // Sign-in errors
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',

    // Authentication errors
    MISSING_EMAIL = 'MISSING_EMAIL',
    MISSING_PHONE = 'MISSING_PHONE',
    MISSING_PASSWORD = 'MISSING_PASSWORD',
    INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
    INVALID_PHONE_FORMAT = 'INVALID_PHONE_FORMAT',
    WEAK_PASSWORD = 'WEAK_PASSWORD',

    // Token and authentication errors
    NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
    INVALID_TOKEN = 'INVALID_TOKEN'
}

export const ErrorHttpStatus: Record<ErrorCode, number> = {
    // General errors
    [ErrorCode.GENERIC_ERROR]: 500,

    // User creation errors
    [ErrorCode.DUPLICATE_EMAIL]: 409,
    [ErrorCode.DUPLICATE_PHONE]: 409,
    [ErrorCode.USERNAME_UNAVAILABLE]: 409,

    // User update errors
    [ErrorCode.EMAIL_ALREADY_USED]: 409,
    [ErrorCode.PHONE_ALREADY_USED]: 409,
    [ErrorCode.USERNAME_NOT_AVAILABLE]: 409,

    // Sign-in errors
    [ErrorCode.USER_NOT_FOUND]: 404,
    [ErrorCode.INCORRECT_PASSWORD]: 401,

    // Authentication errors
    [ErrorCode.MISSING_EMAIL]: 400,
    [ErrorCode.MISSING_PHONE]: 400,
    [ErrorCode.MISSING_PASSWORD]: 400,
    [ErrorCode.INVALID_EMAIL_FORMAT]: 400,
    [ErrorCode.INVALID_PHONE_FORMAT]: 400,
    [ErrorCode.WEAK_PASSWORD]: 400,

    // Token and authentication errors
    [ErrorCode.NOT_AUTHENTICATED]: 401,
    [ErrorCode.INVALID_TOKEN]: 401
}

export const ErrorMessage: Record<ErrorCode, string> = {
    // General errors
    [ErrorCode.GENERIC_ERROR]: 'An error occurred',

    // User creation errors
    [ErrorCode.DUPLICATE_EMAIL]: 'Email already exists',
    [ErrorCode.DUPLICATE_PHONE]: 'Phone number already exists',
    [ErrorCode.USERNAME_UNAVAILABLE]: 'Username is not available',

    // User update errors
    [ErrorCode.EMAIL_ALREADY_USED]: 'Email is already in use',
    [ErrorCode.PHONE_ALREADY_USED]: 'Phone number is already in use',
    [ErrorCode.USERNAME_NOT_AVAILABLE]: 'Username is not available',

    // Sign-in errors
    [ErrorCode.USER_NOT_FOUND]: 'User not found',
    [ErrorCode.INCORRECT_PASSWORD]: 'Incorrect password',

    // Authentication errors
    [ErrorCode.MISSING_EMAIL]: 'Email is missing',
    [ErrorCode.MISSING_PHONE]: 'Phone number is missing',
    [ErrorCode.MISSING_PASSWORD]: 'Password is missing',
    [ErrorCode.INVALID_EMAIL_FORMAT]: 'Invalid email format',
    [ErrorCode.INVALID_PHONE_FORMAT]: 'Invalid phone number format',
    [ErrorCode.WEAK_PASSWORD]: 'Weak password',

    // Token and authentication errors
    [ErrorCode.NOT_AUTHENTICATED]: 'Not authenticated',
    [ErrorCode.INVALID_TOKEN]: 'Invalid token'
}
