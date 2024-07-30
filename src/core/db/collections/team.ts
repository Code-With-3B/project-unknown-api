import {Db} from 'mongodb'
import {MongoCollection} from '../../../@types/collections'
import {TeamsCollection} from '../../../generated/mongo-types'
import {logger} from '../../../config'

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
        logger.info(`Adding data to array field memebers in document with ID ${id} in collection ${collectionName}`)
        const collection = db.collection(collectionName)

        // Ensure the document exists
        const existingDocument = (await collection.findOne({id})) as TeamsCollection | null
        if (!existingDocument) {
            logger.error(`No document found with ID ${id}`)
            throw new Error(`No document found with ID ${id}`)
        }

        logger.debug(`Existing document: ${JSON.stringify(existingDocument)}`)
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
