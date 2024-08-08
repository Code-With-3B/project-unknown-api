export enum OrgResponseCode {
    // ORG Name Validation
    INVALID_ORG_NAME = 'INVALID_ORG_NAME',
    INVALID_ORG_NAME_LENGTH = 'INVALID_ORG_NAME_LENGTH',
    INVALID_ORG_NAME_FORMAT = 'INVALID_ORG_NAME_FORMAT',
    DUPLICATE_ORG_NAME = 'DUPLICATE_ORG_NAME',

    // Game Name Validation
    INVALID_GAME_NAME = 'INVALID_GAME_NAME',
    INVALID_GAME_NAME_LENGTH = 'INVALID_GAME_NAME_LENGTH',

    // Owner Validation
    INVALID_OWNER_ID = 'INVALID_OWNER_ID',

    // ORG Description Validation
    INVALID_ORG_DESCRIPTION = 'INVALID_ORG_DESCRIPTION',

    // ORG Creation
    ORG_CREATION_FAILED = 'ORG_CREATION_FAILED',
    ORG_CREATION_SUCCESS = 'ORG_CREATION_SUCCESS',

    // ORG Updating
    ORG_UPDATING_FAILED = 'ORG_UPDATING_FAILED',
    ORG_UPDATING_SUCCESS = 'ORG_UPDATING_SUCCESS',
    NO_FIELDS_TO_UPDATE = 'NO_FIELDS_TO_UPDATE',

    // ORG Deletion
    ORG_DELETION_SUCCESS = 'ORG_DELETION_SUCCESS',
    ORG_DELETION_FAILED = 'ORG_DELETION_FAILED',
    ORG_DELETE_ACCESS_DENIED = 'ORG_DELETE_ACCESS_DENIED',

    // Invitation
    INVALID_ORG_ID = 'INVALID_ORG_ID',
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

    INVITED_USER_ID_MISSING = 'INVITED_USER_ID_MISSING',
    REJECTOR_ID_MISSING = 'REJECTOR_ID_MISSING',
    OTHER_USER_TRYING_TO_REJECT = 'OTHER_USER_TRYING_TO_REJECT',
    OTHER_USER_TRYING_TO_ACCEPT = 'OTHER_USER_TRYING_TO_ACCEPT',
    INVITATION_WITHDRAW_ACCESS_DENIED = 'INVITATION_WITHDRAW_ACCESS_DENIED',

    // Deletion Reason
    ORG_ID_MISSING = 'ORG_ID_MISSING',
    DELETER_ID_MISSING = 'DELETER_ID_MISSING',
    DELETER_ID_INVALID = 'DELETER_ID_INVALID',
    REASON_MISSING = 'REASON_MISSING',

    // User Removal
    REMOVER_ID_MISSING = 'REMOVER_ID_MISSING',
    USER_TO_REMOVE_ID_MISSING = 'USER_TO_REMOVE_ID_MISSING',
    USER_TO_REMOVE_NOT_IN_ORG = 'USER_TO_REMOVE_NOT_IN_ORG',
    USER_REMOVED_SUCCESS = 'USER_REMOVED_SUCCESS',
    USER_REMOVED_FAILED = 'USER_REMOVED_FAILED',
    CANT_REMOVE_ORG_OWNER = 'CANT_REMOVE_ORG_OWNER',
    REMOVE_USER_ACCESS_DENIED = 'REMOVE_USER_ACCESS_DENIED',

    // Ownership Transfer
    CURRENT_OWNER_ID_MISSING = 'CURRENT_OWNER_ID_MISSING',
    NEW_OWNER_ID_MISSING = 'NEW_OWNER_ID_MISSING',
    CURRENT_OWNER_ID_INVALID = 'CURRENT_OWNER_ID_INVALID',
    NEW_OWNER_ID_INVALID = 'NEW_OWNER_ID_INVALID',
    NEW_OWNER_SHOULD_BE_IN_ORG = 'NEW_OWNER_SHOULD_BE_IN_ORG',
    USER_SHOULD_BE_OWNER_TO_TRANSFER_OWNERSHIP = 'USER_SHOULD_BE_OWNER_TO_TRANSFER_OWNERSHIP',
    OWNERSHIP_TRANSFER_SUCCESS = 'OWNERSHIP_TRANSFER_SUCCESS',
    OWNERSHIP_TRANSFER_FAILED = 'OWNERSHIP_TRANSFER_FAILED'
}

export const ErrorMessage: Record<OrgResponseCode, string> = {
    // ORG Name Validation
    [OrgResponseCode.INVALID_ORG_NAME]: 'Invalid ORG name provided',
    [OrgResponseCode.INVALID_ORG_NAME_LENGTH]: 'ORG name must be at least 4 characters long',
    [OrgResponseCode.INVALID_ORG_NAME_FORMAT]: 'ORG name format is incorrect',
    [OrgResponseCode.DUPLICATE_ORG_NAME]: 'ORG name is already taken',

    // Game Name Validation
    [OrgResponseCode.INVALID_GAME_NAME]: 'Invalid game name provided',
    [OrgResponseCode.INVALID_GAME_NAME_LENGTH]: 'Game name must be at least 2 characters long',

    // Owner Validation
    [OrgResponseCode.INVALID_OWNER_ID]: 'Invalid owner ID provided',

    // ORG Description Validation
    [OrgResponseCode.INVALID_ORG_DESCRIPTION]: 'Invalid ORG description provided',

    // ORG Creation
    [OrgResponseCode.ORG_CREATION_FAILED]: 'ORG creation failed',
    [OrgResponseCode.ORG_CREATION_SUCCESS]: 'ORG has been created successfully',

    // ORG Updating
    [OrgResponseCode.ORG_UPDATING_FAILED]: 'ORG updating failed',
    [OrgResponseCode.ORG_UPDATING_SUCCESS]: 'ORG has been updated successfully',
    [OrgResponseCode.NO_FIELDS_TO_UPDATE]: 'No fields to update',

    // ORG Deletion
    [OrgResponseCode.ORG_DELETION_SUCCESS]: 'ORG has been deleted successfully',
    [OrgResponseCode.ORG_DELETION_FAILED]: 'ORG deletion failed',
    [OrgResponseCode.ORG_DELETE_ACCESS_DENIED]: 'Access denied to delete the ORG',

    // Invitation
    [OrgResponseCode.INVALID_ORG_ID]: 'Invalid ORG ID provided',
    [OrgResponseCode.INVALID_SENDER_ID]: 'Invalid sender ID provided',
    [OrgResponseCode.INVALID_RECEIVER_ID]: 'Invalid receiver ID provided',
    [OrgResponseCode.INVALID_ROLE]: 'Invalid role specified',
    [OrgResponseCode.INVALID_EXPIRATION]: 'Invalid expiration date provided',

    [OrgResponseCode.INVITATION_SENT]: 'Invitation sent successfully',
    [OrgResponseCode.INVITATION_FAILED]: 'Invitation failed',
    [OrgResponseCode.DUPLICATE_INVITATION]: 'Duplicate invitation exists',

    [OrgResponseCode.INVITATIONS_FETCHED]: 'Invitations fetched successfully',
    [OrgResponseCode.INVITATIONS_FETCHING_FAILED]: 'Failed to fetch invitations',

    [OrgResponseCode.INVITATION_ID_MISSING]: 'Invitation ID is missing',
    [OrgResponseCode.INVITATION_NOT_FOUND]: 'Invitation not found',
    [OrgResponseCode.INVITATION_EXPIRED]: 'Invitation has expired',
    [OrgResponseCode.INVITATION_ACCEPTED]: 'Invitation accepted',
    [OrgResponseCode.INVITATION_WITHDRAWN]: 'Invitation withdrawn',
    [OrgResponseCode.INVITATION_REJECTED]: 'Invitation rejected',
    [OrgResponseCode.INVITATION_FAILED_TO_REJECT]: 'Failed to reject invitation',
    [OrgResponseCode.INVITATION_FAILED_TO_ACCEPT]: 'Failed to accept invitation',
    [OrgResponseCode.INVITATION_FAILED_TO_WITHDRAW]: 'Failed to withdraw invitation',
    [OrgResponseCode.FAILED_TO_ACCEPT_INVITATION]: 'Failed to accept invitation',

    [OrgResponseCode.INVITED_USER_ID_MISSING]: 'Invited user id is missing',
    [OrgResponseCode.REJECTOR_ID_MISSING]: 'Rejector ID is missing',
    [OrgResponseCode.OTHER_USER_TRYING_TO_REJECT]: 'Other user is trying to reject invitation',
    [OrgResponseCode.OTHER_USER_TRYING_TO_ACCEPT]: 'Other user is trying to accept invitation',
    [OrgResponseCode.INVITATION_WITHDRAW_ACCESS_DENIED]: 'Access denied to withdraw invitation',

    // Deletion Reason
    [OrgResponseCode.ORG_ID_MISSING]: 'ORG ID is missing',
    [OrgResponseCode.DELETER_ID_MISSING]: 'Deleter ID is missing',
    [OrgResponseCode.DELETER_ID_INVALID]: 'Invalid deleter ID provided',
    [OrgResponseCode.REASON_MISSING]: 'Reason for deletion is missing',

    // User Removal
    [OrgResponseCode.REMOVER_ID_MISSING]: 'Remover ID is missing',
    [OrgResponseCode.USER_TO_REMOVE_ID_MISSING]: 'User to remove ID is missing',
    [OrgResponseCode.USER_TO_REMOVE_NOT_IN_ORG]: 'User to remove is not in the ORG',
    [OrgResponseCode.USER_REMOVED_SUCCESS]: 'User was successfully removed',
    [OrgResponseCode.USER_REMOVED_FAILED]: 'Failed to remove user from the ORG',
    [OrgResponseCode.CANT_REMOVE_ORG_OWNER]: 'Cannot remove ORG owner',
    [OrgResponseCode.REMOVE_USER_ACCESS_DENIED]: 'Access denied to remove user',

    // Ownership Transfer
    [OrgResponseCode.CURRENT_OWNER_ID_MISSING]: 'Current owner ID is missing',
    [OrgResponseCode.NEW_OWNER_ID_MISSING]: 'New owner ID is missing',
    [OrgResponseCode.CURRENT_OWNER_ID_INVALID]: 'Invalid current owner ID provided',
    [OrgResponseCode.NEW_OWNER_ID_INVALID]: 'Invalid new owner ID provided',
    [OrgResponseCode.NEW_OWNER_SHOULD_BE_IN_ORG]: 'New owner should be in the ORG',
    [OrgResponseCode.USER_SHOULD_BE_OWNER_TO_TRANSFER_OWNERSHIP]: 'User should be the owner to transfer ownership',
    [OrgResponseCode.OWNERSHIP_TRANSFER_SUCCESS]: 'Ownership transferred successfully',
    [OrgResponseCode.OWNERSHIP_TRANSFER_FAILED]: 'Failed to transfer ownership'
}
