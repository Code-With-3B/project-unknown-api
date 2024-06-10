// errors.ts
export enum ErrorCode {
    // General errors
    GENERIC_ERROR = 'GENERIC_ERROR',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',

    // Server errors
    DATABASE_CONNECTION = 'DATABASE_CONNECTION',

    // User creation errors
    DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',
    DUPLICATE_PHONE = 'DUPLICATE_PHONE',
    USERNAME_UNAVAILABLE = 'USERNAME_UNAVAILABLE',
    INVALID_USERNAME_LENGTH = 'INVALID_USERNAME_LENGTH',

    // User update errors
    EMAIL_ALREADY_USED = 'EMAIL_ALREADY_USED',
    PHONE_ALREADY_USED = 'PHONE_ALREADY_USED',
    USERNAME_NOT_AVAILABLE = 'USERNAME_NOT_AVAILABLE',

    // Sign-in errors
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',

    // Authentication errors
    MISSING_EMAIL = 'MISSING_EMAIL',
    INCORRECT_EMAIL = 'INCORRECT_EMAIL',
    INCORRECT_PHONE = 'INCORRECT_PHONE',
    MISSING_PHONE = 'MISSING_PHONE',
    MISSING_PASSWORD = 'MISSING_PASSWORD',
    INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
    INVALID_PHONE_FORMAT = 'INVALID_PHONE_FORMAT',
    WEAK_PASSWORD = 'WEAK_PASSWORD',

    // Token and authentication errors
    NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
    INVALID_TOKEN = 'INVALID_TOKEN',

    // Media Upload
    MEDIA_UPLOAD_FAILED = 'MEDIA_UPLOAD_FAILED',
    MEDIA_NOT_ATTACHED = 'MEDIA_NOT_ATTACHED',
    MEDIA_UPLOAD_SUCCESS = 'MEDIA_UPLOAD_SUCCESS'
}

export const ErrorMessage: Record<ErrorCode, string> = {
    // General errors
    [ErrorCode.GENERIC_ERROR]: 'An error occurred',
    [ErrorCode.INTERNAL_SERVER_ERROR]: 'Something went wrong',

    [ErrorCode.DATABASE_CONNECTION]: 'Unable to connect database',

    // User creation errors
    [ErrorCode.DUPLICATE_EMAIL]: 'Email already exists',
    [ErrorCode.DUPLICATE_PHONE]: 'Phone number already exists',
    [ErrorCode.USERNAME_UNAVAILABLE]: 'Username is not available',
    [ErrorCode.INVALID_USERNAME_LENGTH]: 'Username must contain atleast 6 characters',

    // User update errors
    [ErrorCode.EMAIL_ALREADY_USED]: 'Email is already in use',
    [ErrorCode.PHONE_ALREADY_USED]: 'Phone number is already in use',
    [ErrorCode.USERNAME_NOT_AVAILABLE]: 'Username is not available',

    // Sign-in errors
    [ErrorCode.USER_NOT_FOUND]: 'User not found',
    [ErrorCode.INCORRECT_PASSWORD]: 'Incorrect password',

    // Authentication errors
    [ErrorCode.MISSING_EMAIL]: 'Email is missing',
    [ErrorCode.INCORRECT_EMAIL]: 'No user found with email',
    [ErrorCode.INCORRECT_PHONE]: 'No user found with phone',
    [ErrorCode.MISSING_PHONE]: 'Phone number is missing',
    [ErrorCode.MISSING_PASSWORD]: 'Password is missing',
    [ErrorCode.INVALID_EMAIL_FORMAT]: 'Invalid email format',
    [ErrorCode.INVALID_PHONE_FORMAT]: 'Invalid phone number format',
    [ErrorCode.WEAK_PASSWORD]: 'Weak password',

    // Token and authentication errors
    [ErrorCode.NOT_AUTHENTICATED]: 'Not authenticated',
    [ErrorCode.INVALID_TOKEN]: 'Invalid token',

    // Media Upload
    [ErrorCode.MEDIA_UPLOAD_FAILED]: 'Media upload failed',
    [ErrorCode.MEDIA_UPLOAD_SUCCESS]: 'Media uploaded successfully',
    [ErrorCode.MEDIA_NOT_ATTACHED]: 'No media found in request'
}
