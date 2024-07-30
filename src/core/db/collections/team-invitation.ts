import {MongoCollection} from '../../../@types/collections'
import {logger} from '../../../config'
import {v4 as uuid} from 'uuid'

import {Db, Document, UpdateResult} from 'mongodb'
import {TeamInvitation, TeamInvitationStatus} from '../../../generated/team'

export async function fetchLatestTeamInvitation(
    db: Db,
    teamId: string,
    sendTo: string,
    roles: string[]
): Promise<TeamInvitation | null> {
    try {
        logger.info(`Fetching latest team invitation for teamId: ${teamId}, sendTo: ${sendTo}, roles: ${roles}`)

        const collection = db.collection(MongoCollection.TEAM_INVITATION)
        const query = [
            {
                $match: {
                    teamId: teamId,
                    sendTo: sendTo,
                    roles: {$all: roles},
                    status: TeamInvitationStatus.Sent
                }
            },
            {
                $sort: {createdAt: -1} // Assumes 'createdAt' is the field tracking creation time
            },
            {
                $limit: 1
            }
        ]

        const result = await collection.aggregate(query).next() // Fetches the first document directly
        if (result) {
            logger.info(`Fetched the latest team invitation for teamId: ${teamId}, sendTo: ${sendTo}`)
            return result as TeamInvitation
        } else {
            logger.error(`No team invitations found for teamId: ${teamId}, sendTo: ${sendTo}, roles: ${roles}`)
            return null
        }
    } catch (error) {
        logger.error(`Error fetching the latest team invitation: ${error}`)
        throw error
    }
}

/**
 * Upserts a document in the specified collection based on the provided filter and update data.
 * Handles merging unique values in arrays.
 * @param db The MongoDB database instance.
 * @param collectionName The name of the collection to upsert the document in.
 * @param filter The filter criteria to determine if the document already exists.
 * @param updateData The data to be updated or inserted.
 * @returns {Promise<boolean>} A promise that resolves to true if the document was successfully upserted, otherwise false.
 * @throws {Error} Throws an error if failed to upsert the document.
 */
/**
 * Upserts a document in the specified collection based on the provided filter and update data.
 * Handles merging unique values in arrays.
 * @param db The MongoDB database instance.
 * @param filter The filter criteria to determine if the document already exists.
 * @param updateData The data to be updated or inserted.
 * @returns {Promise<boolean>} A promise that resolves to true if the document was successfully upserted, otherwise false.
 * @throws {Error} Throws an error if failed to upsert the document.
 */
export async function upsertTeamMember(
    db: Db,
    filter: Partial<Document>,
    updateData: Partial<Document>
): Promise<string> {
    try {
        const collectionName = MongoCollection.TEAM_MEMBER
        logger.info(`Upserting document in collection ${collectionName} with filter ${JSON.stringify(filter)}`)
        const collection = db.collection(collectionName)

        // Fetch the existing document
        const existingDoc = await collection.findOne(filter)
        const now = new Date().toISOString()
        const setUpdateData: Partial<Document> = {
            ...updateData
        }

        if (!existingDoc) {
            setUpdateData.createdAt = now
            setUpdateData.id = uuid()
        } else {
            setUpdateData.updatedAt = now
            setUpdateData.id = existingDoc.id
        }

        // Merge arrays if necessary
        Object.keys(updateData).forEach(key => {
            if (Array.isArray(updateData[key])) {
                const existingArray = existingDoc ? existingDoc[key] || [] : []
                setUpdateData[key] = Array.from(new Set([...existingArray, ...updateData[key]]))
            }
        })

        // Perform the upsert
        const updateResult: UpdateResult = await collection.updateOne(filter, {$set: setUpdateData}, {upsert: true})

        if (updateResult.upsertedCount > 0) {
            logger.info(`Document inserted in ${collectionName} with filter ${JSON.stringify(filter)}`)
            return setUpdateData.id
        } else if (updateResult.modifiedCount > 0) {
            logger.info(`Document updated in ${collectionName} with filter ${JSON.stringify(filter)}`)
            return setUpdateData.id
        } else {
            logger.warn(`No document upserted in ${collectionName} with filter ${JSON.stringify(filter)}`)
            return 'No Data updated'
        }
    } catch (error) {
        logger.error(`Error upserting data: ${error}`)
        throw error
    }
}
