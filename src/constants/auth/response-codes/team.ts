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
    INVALID_EXPIRATION = 'INVALID_EXPIRATION',

    INVITATION_SENT = 'INVITATION_SENT',
    INVITATION_FAILED = 'INVITATION_FAILED',

    DUPLICATE_INVITATION = 'DUPLICATE_INVITATION',

    TEAM_ID_MISSING = 'TEAM_ID_MISSING',
    DELETER_ID_MISSING = 'OWNER_ID_MISSING',
    REASON_MISSING = 'REASON_MISSING',

    INVITED_USER_ID_MISSING = 'INVITED_USER_ID_MISSING',

    INVITATIONS_FETCHED = 'INVITATIONS_FETCHED',
    INVITATIONS_FETCHING_FAILED = 'INVITATIONS_FETCHING_FAILED',

    INVITATION_ID_MISSING = 'INVITATION_ID_MISSING',
    INVITATION_NOT_FOUND = 'INVITATION_NOT_FOUND',
    INVITATION_EXPIRED = 'INVITATION_EXPIRED',
    INVITATION_ACCEPTED = 'INVITATION_ACCEPTED',
    INVITATION_WITHDRAWN = 'INVITATION_WITHDRAWN',
    INVITATION_DENIED = 'INVITATION_DENIED',
    FAILED_TO_ACCEPT_INVITATION = 'FAILED_TO_ACCEPT_INVITATION'
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
    [TeamResponseCode.INVALID_EXPIRATION]: 'Invalid expiry',

    [TeamResponseCode.INVITATION_SENT]: 'Invitation sent successfully',
    [TeamResponseCode.INVITATION_FAILED]: 'Invitation failed',

    [TeamResponseCode.DUPLICATE_INVITATION]: 'Invitation already in exists',

    [TeamResponseCode.TEAM_ID_MISSING]: 'Team id is missing',
    [TeamResponseCode.DELETER_ID_MISSING]: 'Team owner id is missing',
    [TeamResponseCode.REASON_MISSING]: 'Reason to delete is missing',

    [TeamResponseCode.INVITED_USER_ID_MISSING]: 'Invited user id is missing',

    [TeamResponseCode.INVITATIONS_FETCHED]: 'All invitations have been fetched',
    [TeamResponseCode.INVITATIONS_FETCHING_FAILED]: 'Fetching invitations failed',

    [TeamResponseCode.INVITATION_ID_MISSING]: 'Invitation id is missing',
    [TeamResponseCode.INVITATION_NOT_FOUND]: 'Invitation not found',
    [TeamResponseCode.INVITATION_EXPIRED]: 'Invitation has been expired',

    [TeamResponseCode.INVITATION_ACCEPTED]: 'Invitation has been accepted',
    [TeamResponseCode.INVITATION_WITHDRAWN]: 'Invitation has been withdrawn',
    [TeamResponseCode.INVITATION_DENIED]: 'Invitation has been rejected',
    [TeamResponseCode.FAILED_TO_ACCEPT_INVITATION]: 'Failed to accept Invitation'
}
