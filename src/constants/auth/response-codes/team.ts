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
    TEAM_UPDATING_FAILED = 'TEAM_UPDATING_FAILED',
    TEAM_UPDATING_SUCCESS = 'TEAM_UPDATING_SUCCESS',

    NO_FIELDS_TO_UPDATE = 'NO_FIELDS_TO_UPDATE',

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
    DELETER_ID_INVALID = 'DELETER_ID_INVALID',
    REASON_MISSING = 'REASON_MISSING',

    INVITED_USER_ID_MISSING = 'INVITED_USER_ID_MISSING',

    INVITATIONS_FETCHED = 'INVITATIONS_FETCHED',
    INVITATIONS_FETCHING_FAILED = 'INVITATIONS_FETCHING_FAILED',

    INVITATION_ID_MISSING = 'INVITATION_ID_MISSING',
    INVITATION_NOT_FOUND = 'INVITATION_NOT_FOUND',
    INVITATION_EXPIRED = 'INVITATION_EXPIRED',
    INVITATION_ACCEPTED = 'INVITATION_ACCEPTED',
    INVITATION_WITHDRAWN = 'INVITATION_WITHDRAWN',
    INVITATION_REJECTED = 'INVITATION_REJECTED',
    INVITATION_FAILED_TO_REJECT = 'INVITATION_FAILED_TO_REJECT',
    INVITATION_FAILED_TO_ACCEPT = 'INVITATION_FAILED_TO_ACCEPT',
    INVITATION_FAILED_TO_WITHDRAW = 'INVITATION_FAILED_TO_WITHDRAW',
    FAILED_TO_ACCEPT_INVITATION = 'FAILED_TO_ACCEPT_INVITATION',

    REJECTOR_ID_MISSING = 'REJECTOR_ID_MISSING',
    OTHER_USER_TRYING_TO_REJECT = 'OTHER_USER_TRYING_TO_REJECT',
    OTHER_USER_TRYING_TO_ACCEPT = 'OTHER_USER_TRYING_TO_ACCEPT',
    INVITATION_WITHDRAW_ACCESS_DENIED = 'INVITATION_WITHDRAW_ACCESS_DENIED',
    TEAM_DELETE_ACCESS_DENIED = 'TEAM_DELETE_ACCESS_DENIED',

    TEAM_DELETION_SUCCESS = 'TEAM_DELETION_SUCCESS',
    TEAM_DELETION_FAILED = 'TEAM_DELETION_FAILED',

    REMOVER_ID_MISSING = 'REMOVER_ID_MISSING',
    USER_TO_REMOVE_ID_MISSING = 'USER_TO_REMOVE_ID_MISSING',
    USER_TO_REMOVE_NOT_IN_TEAM = 'USER_TO_REMOVE_NOT_IN_TEAM',
    USER_REMOVED_SUCCESS = 'USER_REMOVED_SUCCESS',
    USER_REMOVED_FAILED = 'USER_REMOVED_FAILED',
    CANT_REMOVE_TEAM_OWNER = 'CANT_REMOVE_TEAM_OWNER',

    REMOVE_USER_ACCESS_DENIED = 'REMOVE_USER_ACCESS_DENIED'
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
    [TeamResponseCode.TEAM_UPDATING_FAILED]: 'Team updating failed',
    [TeamResponseCode.TEAM_UPDATING_SUCCESS]: 'Team has been updated successfully',

    [TeamResponseCode.NO_FIELDS_TO_UPDATE]: 'No Fields to update',

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
    [TeamResponseCode.DELETER_ID_INVALID]: 'Team Deleter id is invalid',
    [TeamResponseCode.REASON_MISSING]: 'Reason to delete is missing',

    [TeamResponseCode.INVITED_USER_ID_MISSING]: 'Invited user id is missing',

    [TeamResponseCode.INVITATIONS_FETCHED]: 'All invitations have been fetched',
    [TeamResponseCode.INVITATIONS_FETCHING_FAILED]: 'Fetching invitations failed',

    [TeamResponseCode.INVITATION_ID_MISSING]: 'Invitation id is missing',
    [TeamResponseCode.INVITATION_NOT_FOUND]: 'Invitation not found',
    [TeamResponseCode.INVITATION_EXPIRED]: 'Invitation has been expired',

    [TeamResponseCode.INVITATION_ACCEPTED]: 'Invitation has been accepted',
    [TeamResponseCode.INVITATION_WITHDRAWN]: 'Invitation has been withdrawn',
    [TeamResponseCode.INVITATION_REJECTED]: 'Invitation has been rejected',
    [TeamResponseCode.INVITATION_FAILED_TO_REJECT]: 'Invitation has been rejected',
    [TeamResponseCode.INVITATION_FAILED_TO_ACCEPT]: 'Invitation has been rejected',
    [TeamResponseCode.INVITATION_FAILED_TO_WITHDRAW]: 'Invitation has been rejected',
    [TeamResponseCode.FAILED_TO_ACCEPT_INVITATION]: 'Failed to accept Invitation',

    [TeamResponseCode.REJECTOR_ID_MISSING]: 'Rejector id is missing',

    [TeamResponseCode.OTHER_USER_TRYING_TO_REJECT]: 'Other user is trying to reject Invitation',
    [TeamResponseCode.OTHER_USER_TRYING_TO_ACCEPT]: 'Other user is trying to accept Invitation',
    [TeamResponseCode.INVITATION_WITHDRAW_ACCESS_DENIED]: 'Other user is trying to reject Invitation',
    [TeamResponseCode.TEAM_DELETE_ACCESS_DENIED]: 'User has not access to delete team',

    [TeamResponseCode.TEAM_DELETION_SUCCESS]: 'Team has been deleted',
    [TeamResponseCode.TEAM_DELETION_FAILED]: 'Team deleting failed',

    [TeamResponseCode.REMOVER_ID_MISSING]: 'Remover id is missing',
    [TeamResponseCode.USER_TO_REMOVE_ID_MISSING]: 'User to id is missing',
    [TeamResponseCode.USER_TO_REMOVE_NOT_IN_TEAM]: 'User to remove is not in team',
    [TeamResponseCode.USER_REMOVED_FAILED]: 'Failed to remove user from team',
    [TeamResponseCode.USER_REMOVED_SUCCESS]: 'User was successfully removed',
    [TeamResponseCode.CANT_REMOVE_TEAM_OWNER]: 'Can not kick team owner from team',

    [TeamResponseCode.REMOVE_USER_ACCESS_DENIED]: 'Remover access denied'
}
