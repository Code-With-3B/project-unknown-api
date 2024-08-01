export enum TeamResponseCode {
    // Team Name Validation
    INVALID_TEAM_NAME = 'INVALID_TEAM_NAME',
    INVALID_TEAM_NAME_LENGTH = 'INVALID_TEAM_NAME_LENGTH',
    INVALID_TEAM_NAME_FORMAT = 'INVALID_TEAM_NAME_FORMAT',
    DUPLICATE_TEAM_NAME = 'DUPLICATE_TEAM_NAME',

    // Game Name Validation
    INVALID_GAME_NAME = 'INVALID_GAME_NAME',
    INVALID_GAME_NAME_LENGTH = 'INVALID_GAME_NAME_LENGTH',

    // Owner Validation
    INVALID_OWNER_ID = 'INVALID_OWNER_ID',

    // Team Description Validation
    INVALID_TEAM_DESCRIPTION = 'INVALID_TEAM_DESCRIPTION',

    // Team Creation
    TEAM_CREATION_FAILED = 'TEAM_CREATION_FAILED',
    TEAM_CREATION_SUCCESS = 'TEAM_CREATION_SUCCESS',

    // Team Updating
    TEAM_UPDATING_FAILED = 'TEAM_UPDATING_FAILED',
    TEAM_UPDATING_SUCCESS = 'TEAM_UPDATING_SUCCESS',
    NO_FIELDS_TO_UPDATE = 'NO_FIELDS_TO_UPDATE',

    // Team Deletion
    TEAM_DELETION_SUCCESS = 'TEAM_DELETION_SUCCESS',
    TEAM_DELETION_FAILED = 'TEAM_DELETION_FAILED',
    TEAM_DELETE_ACCESS_DENIED = 'TEAM_DELETE_ACCESS_DENIED',

    // Invitation
    INVALID_TEAM_ID = 'INVALID_TEAM_ID',
    INVALID_SENDER_ID = 'INVALID_SENDER_ID',
    INVALID_RECEIVER_ID = 'INVALID_RECEIVER_ID',
    INVALID_ROLE = 'INVALID_ROLE',
    INVALID_EXPIRATION = 'INVALID_EXPIRATION',

    INVITATION_SENT = 'INVITATION_SENT',
    INVITATION_FAILED = 'INVITATION_FAILED',
    DUPLICATE_INVITATION = 'DUPLICATE_INVITATION',

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

    // Deletion Reason
    TEAM_ID_MISSING = 'TEAM_ID_MISSING',
    DELETER_ID_MISSING = 'DELETER_ID_MISSING',
    DELETER_ID_INVALID = 'DELETER_ID_INVALID',
    REASON_MISSING = 'REASON_MISSING',

    // User Removal
    REMOVER_ID_MISSING = 'REMOVER_ID_MISSING',
    USER_TO_REMOVE_ID_MISSING = 'USER_TO_REMOVE_ID_MISSING',
    USER_TO_REMOVE_NOT_IN_TEAM = 'USER_TO_REMOVE_NOT_IN_TEAM',
    USER_REMOVED_SUCCESS = 'USER_REMOVED_SUCCESS',
    USER_REMOVED_FAILED = 'USER_REMOVED_FAILED',
    CANT_REMOVE_TEAM_OWNER = 'CANT_REMOVE_TEAM_OWNER',
    REMOVE_USER_ACCESS_DENIED = 'REMOVE_USER_ACCESS_DENIED',

    // Ownership Transfer
    CURRENT_OWNER_ID_MISSING = 'CURRENT_OWNER_ID_MISSING',
    NEW_OWNER_ID_MISSING = 'NEW_OWNER_ID_MISSING',
    CURRENT_OWNER_ID_INVALID = 'CURRENT_OWNER_ID_INVALID',
    NEW_OWNER_ID_INVALID = 'NEW_OWNER_ID_INVALID',
    NEW_OWNER_SHOULD_BE_IN_TEAM = 'NEW_OWNER_SHOULD_BE_IN_TEAM',
    USER_SHOULD_BE_OWNER_TO_TRANSFER_OWNERSHIP = 'USER_SHOULD_BE_OWNER_TO_TRANSFER_OWNERSHIP',
    OWNERSHIP_TRANSFER_SUCCESS = 'OWNERSHIP_TRANSFER_SUCCESS',
    OWNERSHIP_TRANSFER_FAILED = 'OWNERSHIP_TRANSFER_FAILED'
}

export const ErrorMessage: Record<TeamResponseCode, string> = {
    // Team Name Validation
    [TeamResponseCode.INVALID_TEAM_NAME]: 'Invalid team name provided',
    [TeamResponseCode.INVALID_TEAM_NAME_LENGTH]: 'Team name must be at least 4 characters long',
    [TeamResponseCode.INVALID_TEAM_NAME_FORMAT]: 'Team name format is incorrect',
    [TeamResponseCode.DUPLICATE_TEAM_NAME]: 'Team name is already taken',

    // Game Name Validation
    [TeamResponseCode.INVALID_GAME_NAME]: 'Invalid game name provided',
    [TeamResponseCode.INVALID_GAME_NAME_LENGTH]: 'Game name must be at least 2 characters long',

    // Owner Validation
    [TeamResponseCode.INVALID_OWNER_ID]: 'Invalid owner ID provided',

    // Team Description Validation
    [TeamResponseCode.INVALID_TEAM_DESCRIPTION]: 'Invalid team description provided',

    // Team Creation
    [TeamResponseCode.TEAM_CREATION_FAILED]: 'Team creation failed',
    [TeamResponseCode.TEAM_CREATION_SUCCESS]: 'Team has been created successfully',

    // Team Updating
    [TeamResponseCode.TEAM_UPDATING_FAILED]: 'Team updating failed',
    [TeamResponseCode.TEAM_UPDATING_SUCCESS]: 'Team has been updated successfully',
    [TeamResponseCode.NO_FIELDS_TO_UPDATE]: 'No fields to update',

    // Team Deletion
    [TeamResponseCode.TEAM_DELETION_SUCCESS]: 'Team has been deleted successfully',
    [TeamResponseCode.TEAM_DELETION_FAILED]: 'Team deletion failed',
    [TeamResponseCode.TEAM_DELETE_ACCESS_DENIED]: 'Access denied to delete the team',

    // Invitation
    [TeamResponseCode.INVALID_TEAM_ID]: 'Invalid team ID provided',
    [TeamResponseCode.INVALID_SENDER_ID]: 'Invalid sender ID provided',
    [TeamResponseCode.INVALID_RECEIVER_ID]: 'Invalid receiver ID provided',
    [TeamResponseCode.INVALID_ROLE]: 'Invalid role specified',
    [TeamResponseCode.INVALID_EXPIRATION]: 'Invalid expiration date provided',

    [TeamResponseCode.INVITATION_SENT]: 'Invitation sent successfully',
    [TeamResponseCode.INVITATION_FAILED]: 'Invitation failed',
    [TeamResponseCode.DUPLICATE_INVITATION]: 'Duplicate invitation exists',

    [TeamResponseCode.INVITATIONS_FETCHED]: 'Invitations fetched successfully',
    [TeamResponseCode.INVITATIONS_FETCHING_FAILED]: 'Failed to fetch invitations',

    [TeamResponseCode.INVITATION_ID_MISSING]: 'Invitation ID is missing',
    [TeamResponseCode.INVITATION_NOT_FOUND]: 'Invitation not found',
    [TeamResponseCode.INVITATION_EXPIRED]: 'Invitation has expired',
    [TeamResponseCode.INVITATION_ACCEPTED]: 'Invitation accepted',
    [TeamResponseCode.INVITATION_WITHDRAWN]: 'Invitation withdrawn',
    [TeamResponseCode.INVITATION_REJECTED]: 'Invitation rejected',
    [TeamResponseCode.INVITATION_FAILED_TO_REJECT]: 'Failed to reject invitation',
    [TeamResponseCode.INVITATION_FAILED_TO_ACCEPT]: 'Failed to accept invitation',
    [TeamResponseCode.INVITATION_FAILED_TO_WITHDRAW]: 'Failed to withdraw invitation',
    [TeamResponseCode.FAILED_TO_ACCEPT_INVITATION]: 'Failed to accept invitation',

    [TeamResponseCode.REJECTOR_ID_MISSING]: 'Rejector ID is missing',
    [TeamResponseCode.OTHER_USER_TRYING_TO_REJECT]: 'Other user is trying to reject invitation',
    [TeamResponseCode.OTHER_USER_TRYING_TO_ACCEPT]: 'Other user is trying to accept invitation',
    [TeamResponseCode.INVITATION_WITHDRAW_ACCESS_DENIED]: 'Access denied to withdraw invitation',

    // Deletion Reason
    [TeamResponseCode.TEAM_ID_MISSING]: 'Team ID is missing',
    [TeamResponseCode.DELETER_ID_MISSING]: 'Deleter ID is missing',
    [TeamResponseCode.DELETER_ID_INVALID]: 'Invalid deleter ID provided',
    [TeamResponseCode.REASON_MISSING]: 'Reason for deletion is missing',

    // User Removal
    [TeamResponseCode.REMOVER_ID_MISSING]: 'Remover ID is missing',
    [TeamResponseCode.USER_TO_REMOVE_ID_MISSING]: 'User to remove ID is missing',
    [TeamResponseCode.USER_TO_REMOVE_NOT_IN_TEAM]: 'User to remove is not in the team',
    [TeamResponseCode.USER_REMOVED_SUCCESS]: 'User was successfully removed',
    [TeamResponseCode.USER_REMOVED_FAILED]: 'Failed to remove user from the team',
    [TeamResponseCode.CANT_REMOVE_TEAM_OWNER]: 'Cannot remove team owner',
    [TeamResponseCode.REMOVE_USER_ACCESS_DENIED]: 'Access denied to remove user',

    // Ownership Transfer
    [TeamResponseCode.CURRENT_OWNER_ID_MISSING]: 'Current owner ID is missing',
    [TeamResponseCode.NEW_OWNER_ID_MISSING]: 'New owner ID is missing',
    [TeamResponseCode.CURRENT_OWNER_ID_INVALID]: 'Invalid current owner ID provided',
    [TeamResponseCode.NEW_OWNER_ID_INVALID]: 'Invalid new owner ID provided',
    [TeamResponseCode.NEW_OWNER_SHOULD_BE_IN_TEAM]: 'New owner should be in the team',
    [TeamResponseCode.USER_SHOULD_BE_OWNER_TO_TRANSFER_OWNERSHIP]: 'User should be the owner to transfer ownership',
    [TeamResponseCode.OWNERSHIP_TRANSFER_SUCCESS]: 'Ownership transferred successfully',
    [TeamResponseCode.OWNERSHIP_TRANSFER_FAILED]: 'Failed to transfer ownership'
}
