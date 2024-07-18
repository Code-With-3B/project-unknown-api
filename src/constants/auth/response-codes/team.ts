export enum TeamResponseCode {
    INVALID_TEAM_NAME = 'INVALID_TEAM_NAME',
    INVALID_TEAM_NAME_LENGTH = 'INVALID_TEAM_NAME_LENGTH',
    INVALID_GAME_NAME = 'INVALID_GAME_NAME',
    INVALID_GAME_NAME_LENGTH = 'INVALID_GAME_NAME_LENGTH',
    INVALID_OWNER_ID = 'INVALID_OWNER_ID',
    INVALID_TEAM_DESCRIPTION = 'INVALID_TEAM_DESCRIPTION',
    DUPLICATE_TEAM_NAME = 'DUPLICATE_TEAM_NAME',
    INVALID_TEAM_NAME_FORMAT = 'INVALID_TEAM_NAME_FORMAT',
    TEAM_CREATION_FAILED = 'TEAM_CREATION_FAILED',

    TEAM_CREATION_SUCCESS = 'TEAM_CREATION_SUCCESS',

    // Invitation
    INVALID_TEAM_ID = 'INVALID_TEAM_ID',
    INVALID_SENDER_ID = 'INVALID_SENDER_ID',
    INVALID_RECEIVER_ID = 'INVALID_RECEIVER_ID',
    INVALID_ROLE = 'INVALID_ROLE',
    INVALID_EXPIRATION = 'INVALID_EXPIRATION'
}

export const ErrorMessage: Record<TeamResponseCode, string> = {
    [TeamResponseCode.INVALID_TEAM_NAME]: 'Invalid team name provided',
    [TeamResponseCode.INVALID_TEAM_NAME_LENGTH]: 'Team name must be 4 letters long',
    [TeamResponseCode.INVALID_GAME_NAME]: 'Invalid game name provided',
    [TeamResponseCode.INVALID_GAME_NAME_LENGTH]: 'Game name must be 2 letters long',
    [TeamResponseCode.INVALID_OWNER_ID]: 'Incorrect owner id',
    [TeamResponseCode.INVALID_TEAM_DESCRIPTION]: 'Invalid team description provided',
    [TeamResponseCode.DUPLICATE_TEAM_NAME]: 'Team name is already taken',
    [TeamResponseCode.INVALID_TEAM_NAME_FORMAT]: 'Team name format is incorrect',
    [TeamResponseCode.TEAM_CREATION_FAILED]: 'Team creation failed',

    [TeamResponseCode.TEAM_CREATION_SUCCESS]: 'Team has been created successfully',

    [TeamResponseCode.INVALID_TEAM_ID]: 'No Team found with this id',
    [TeamResponseCode.INVALID_SENDER_ID]: 'Invalid sender id',
    [TeamResponseCode.INVALID_RECEIVER_ID]: 'Invalid receiver id',
    [TeamResponseCode.INVALID_ROLE]: 'Invalid team role',
    [TeamResponseCode.INVALID_EXPIRATION]: 'Invalid expiry'
}
