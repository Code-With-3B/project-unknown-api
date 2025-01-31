import {Db} from 'mongodb'
import {MongoCollection} from '../../../@types/collections'
import {logger} from '../../../config'

import {TeamMembersCollection, TeamsCollection} from '../../../generated/mongo-types'

/**
 * Updates a document in the specified collection by adding new data to an array field.
 * @param db The MongoDB database instance.
 * @param collectionName The name of the collection to update the document in.
 * @param id The ID of the document to be updated.
 * @param arrayField The name of the array field to which new data should be added.
 * @param newData The new data to be added to the array field.
 * @returns {Promise<boolean>} A promise that resolves to true if the document was successfully updated, otherwise false.
 * @throws {Error} Throws an error if failed to update the document.
 */
export async function updateTeamMemberInTeam(db: Db, id: string, memberId: string): Promise<boolean> {
    try {
        const collectionName = MongoCollection.TEAM
        logger.info(`Adding data to array field members in document with ID ${id} in collection ${collectionName}`)
        const collection = db.collection(collectionName)

        // Ensure the document exists
        const existingDocument = (await collection.findOne({id})) as TeamsCollection | null
        if (!existingDocument) {
            logger.error(`No document found with ID ${id}`)
            throw new Error(`No document found with ID ${id}`)
        }

        // Check if the newData is already present in the array
        const existingArray = existingDocument.members
        if (existingArray && existingArray.includes(memberId)) {
            logger.info(`Data ${memberId} is already present in the array, skipping update`)
            return true
        }

        // Perform the update
        const updateResult = await collection.updateOne(
            {id},
            {
                $addToSet: {['members']: memberId},
                $set: {updatedAt: new Date().toISOString()}
            }
        )

        if (updateResult.modifiedCount === 0) {
            logger.error('Failed to update team member in team')
            return false
        }

        logger.info(`Document with ID ${id} updated successfully`)
        return true
    } catch (error) {
        logger.error(`Error updating data: ${error}`)
        throw error
    }
}

export async function removeTeamMemberFromTeam(db: Db, teamId: string, memberId: string): Promise<boolean> {
    try {
        const collectionName = MongoCollection.TEAM
        logger.info(
            `Removing data from array field members in document with ID ${teamId} in collection ${collectionName}`
        )
        const collection = db.collection(collectionName)

        // Ensure the document exists
        const existingDocument = (await collection.findOne<TeamsCollection>({id: teamId})) as TeamsCollection | null
        if (!existingDocument) {
            logger.error(`No document found with ID ${teamId}`)
            throw new Error(`No document found with ID ${teamId}`)
        }

        logger.debug(`Existing document: ${JSON.stringify(existingDocument)}`)
        // Check if the memberId is present in the array
        const existingArray = existingDocument.members
        if (!existingArray || !existingArray.includes(memberId)) {
            logger.info(`Data ${memberId} is not present in the array, skipping update`)
            return true
        }

        // Perform the update
        const updateResult = await collection.updateOne(
            {id: teamId},
            {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                $pull: {['members']: {$eq: memberId}} as any, // Corrected the $pull operator usage
                $set: {updatedAt: new Date().toISOString()}
            }
        )

        if (updateResult.modifiedCount === 0) {
            logger.error('Failed to remove team member from team')
            return false
        }

        logger.info(`Document with ID ${teamId} updated successfully`)
        return true
    } catch (error) {
        logger.error(`Error updating data: ${error}`)
        throw error
    }
}

export async function removeOwnerRoleFromTeamMember(db: Db, id: string): Promise<boolean> {
    try {
        const collectionName = MongoCollection.TEAM_MEMBER
        const collection = db.collection(collectionName)

        // Ensure the document exists
        const existingDocument = (await collection.findOne({id})) as TeamMembersCollection | null
        if (!existingDocument) {
            logger.error(`No document found with ID ${id}`)
            throw new Error(`No document found with ID ${id}`)
        }

        // Check if the memberId has OWNER role
        const existingRoles = existingDocument.roles
        const hasOwnerRole = existingRoles.includes('OWNER')
        if (!hasOwnerRole) {
            logger.info(`User does not have OWNER role, skipping update`)
            return true
        }

        // Remove OWNER role from the array
        const newRoles = existingRoles.filter(role => role !== 'OWNER')

        // If the array is empty, add NOT_MENTIONED
        if (newRoles.length === 0) {
            newRoles.push('NOT_MENTIONED')
        }

        // Perform the update
        const updateResult = await collection.updateOne(
            {id},
            {
                $set: {
                    roles: newRoles,
                    updatedAt: new Date().toISOString()
                }
            }
        )

        if (updateResult.modifiedCount === 0) {
            logger.error('Failed to update team member in team')
            return false
        }

        logger.info(`Document with ID ${id} updated successfully`)
        return true
    } catch (error) {
        logger.error(`Error updating data: ${error}`)
        throw error
    }
}
