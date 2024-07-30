import {AuthMode} from '../../generated/sign-in'
import {MongoCollection} from '../../@types/collections'
import {logger} from '../../config'
import {pipelines} from './pipelines'

import {Db, Document} from 'mongodb'

type PipelineCollectionNames = keyof typeof pipelines

/**
 * Fetches relational data from the specified collection based on the provided query.
 * @param db The MongoDB database instance.
 * @param collectionName The name of the collection to fetch data from.
 * @param query Optional query to filter the documents.
 * @returns {Promise<T[]>} A promise that resolves to an array of documents.
 * @throws {Error} Throws an error if failed to fetch the documents.
 */
export async function fetchRelationalData<T>(
    db: Db,
    collectionName: PipelineCollectionNames,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query?: any
): Promise<T[]> {
    try {
        const collection = db.collection(collectionName)
        const finalQuery = JSON.parse(JSON.stringify(pipelines[collectionName]))
        if (query) finalQuery[0] = {$match: query}
        const result: T[] = (await collection.aggregate(finalQuery).toArray()) as T[]
        return result
    } catch (error) {
        logger.error(error, `Error fetching data from collection ${collectionName}`)
        throw error
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function findSingleRecord<T>(db: Db, collectionName: MongoCollection, query: any): Promise<T | null> {
    try {
        const collection = db.collection(collectionName)
        const result = await collection.findOne(query)
        return result as T
    } catch (error) {
        logger.error(error, `Error finding document in ${collectionName} with query ${JSON.stringify(query)}`)
        throw error
    }
}

/**
 * Inserts a document into the specified collection and fetches the inserted document.
 * @param db The MongoDB database instance.
 * @param collectionName The name of the collection to insert the document into.
 * @param document The document to be inserted.
 * @returns {Promise<U>} A promise that resolves to the inserted document.
 * @throws {Error} Throws an error if failed to insert the document.
 */
export async function insertDataInDB<T, U>(db: Db, collectionName: PipelineCollectionNames, document: T): Promise<U> {
    try {
        const collection = db.collection(collectionName)
        const insertedResult = await collection.insertOne(document as Document, {})
        if (insertedResult && insertedResult.acknowledged && insertedResult.insertedId) {
            const result: U[] = await fetchRelationalData<U>(db, collectionName, {
                _id: insertedResult.insertedId
            })
            return result[0]
        }
        throw new Error('Unable to insert data')
    } catch (error) {
        logger.error(error, `Error fetching data from collection ${collectionName}`)
        throw error
    }
}

/**
 * Inserts a document into the specified collection without returning the inserted document.
 * @param db The MongoDB database instance.
 * @param collectionName The name of the collection to insert the document into.
 * @param document The document to be inserted.
 * @returns {Promise<boolean>} A promise that resolves to true if the document was successfully inserted, otherwise false.
 * @throws {Error} Throws an error if failed to insert the document.
 */
export async function insertDataInDBWithoutData<T>(
    db: Db,
    collectionName: PipelineCollectionNames,
    document: T
): Promise<boolean> {
    try {
        const collection = db.collection(collectionName)
        const insertedResult = await collection.insertOne(document as Document, {})
        if (insertedResult && insertedResult.acknowledged && insertedResult.insertedId) return true
        return false
    } catch (error) {
        logger.error(error, `Error fetching data from ${collectionName}`)
        throw error
    }
}

/**
 * Fetches a document from the specified collection based on the provided field name and value.
 * @param db The MongoDB database instance.
 * @param collectionName The name of the collection to fetch the document from.
 * @param fieldName The name of the field to filter the documents by.
 * @param fieldValue The value of the field to filter the documents by.
 * @returns {Promise<T | null>} A promise that resolves to the fetched document or null if no document is found.
 * @throws {Error} Throws an error if failed to fetch the document.
 */
export async function fetchDocumentByField<T>(
    db: Db,
    collectionName: MongoCollection,
    fieldName: keyof T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fieldValue: any
): Promise<T | null> {
    try {
        const collection = db.collection(collectionName)
        const result = await collection.findOne({[fieldName]: fieldValue})
        return result as T
    } catch (error) {
        logger.error(error, `Error fetching data from ${collectionName} with filter ${String(fieldName)}`)
        throw error
    }
}

/**
 * Fetches a document from the specified collection based on a valid email and authentication mode.
 * @param db The MongoDB database instance.
 * @param collectionName The name of the collection to fetch the document from.
 * @param email The email to filter the documents by.
 * @returns {Promise<T | null>} A promise that resolves to the fetched document or null if no document is found.
 * @throws {Error} Throws an error if failed to fetch the document.
 */
export async function fetchDocumentForValidEmail<T>(
    db: Db,
    collectionName: MongoCollection,
    email: string
): Promise<T | null> {
    try {
        const collection = db.collection(collectionName)
        const result = await collection.findOne({email, authMode: AuthMode.EmailPass})
        logger.debug(`Fetched document: ${JSON.stringify(result)}`)
        return result as T
    } catch (error) {
        logger.error(error, `Error while fetching email ${email}`)
        throw error
    }
}

/**
 * Fetches a document from the specified collection based on a valid username and authentication modes.
 * @param db The MongoDB database instance.
 * @param collectionName The name of the collection to fetch the document from.
 * @param username The username to filter the documents by.
 * @returns {Promise<T | null>} A promise that resolves to the fetched document or null if no document is found.
 * @throws {Error} Throws an error if failed to fetch the document.
 */
export async function fetchDocumentForValidUsername<T>(
    db: Db,
    collectionName: MongoCollection,
    username: string
): Promise<T | null> {
    try {
        const collection = db.collection(collectionName)
        const result = await collection.findOne({
            username,
            $or: [{authMode: AuthMode.EmailPass}, {authMode: AuthMode.PhonePass}]
        })
        return result as T
    } catch (error) {
        logger.error(error, 'Error while fetching document with filters')
        throw error
    }
}

/**
 * Fetches a document from the specified collection based on a valid phone number and authentication mode.
 * @param db The MongoDB database instance.
 * @param collectionName The name of the collection to fetch the document from.
 * @param phone The phone number to filter the documents by.
 * @returns {Promise<T | null>} A promise that resolves to the fetched document or null if no document is found.
 * @throws {Error} Throws an error if failed to fetch the document.
 */
export async function fetchDocumentForValidPhone<T>(
    db: Db,
    collectionName: MongoCollection,
    phone: string
): Promise<T | null> {
    try {
        const collection = db.collection(collectionName)
        const result = await collection.findOne({phone, authMode: AuthMode.PhonePass})
        return result as T
    } catch (error) {
        logger.error(error, 'Error while fetching document with filters')
        throw error
    }
}

/**
 * Fetches a document from the specified collection based on a valid email and social authentication mode.
 * @param db The MongoDB database instance.
 * @param collectionName The name of the collection to fetch the document from.
 * @param email The email to filter the documents by.
 * @param authMode The social authentication mode to filter the documents by.
 * @returns {Promise<T | null>} A promise that resolves to the fetched document or null if no document is found.
 * @throws {Error} Throws an error if failed to fetch the document.
 */
export async function fetchDocumentForValidSocial<T>(
    db: Db,
    collectionName: MongoCollection,
    email: string,
    authMode: AuthMode
): Promise<T | null> {
    try {
        const collection = db.collection(collectionName)
        const result = await collection.findOne({email, authMode})
        return result as T
    } catch (error) {
        logger.error(error, 'Error while fetching document with filters')
        throw error
    }
}

/**
 * Checks if a document exists in the specified collection based on the provided query.
 * @param db The MongoDB database instance.
 * @param collectionName The name of the collection to check the document existence.
 * @param query The query to filter the documents.
 * @returns {Promise<boolean>} A promise that resolves to true if the document exists, otherwise false.
 * @throws {Error} Throws an error if failed to check the document existence.
 */
export async function doesDocumentExistByField(
    db: Db,
    collectionName: MongoCollection,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any
): Promise<boolean> {
    try {
        const collection = db.collection(collectionName)
        const count = await collection.countDocuments(query)
        return count > 0
    } catch (error) {
        logger.error(error, `Error checking if ${collectionName} exists by ${JSON.stringify(query)}`)
        throw error
    }
}

/**
 * Updates a document in the specified collection based on the provided ID and update fields.
 * @param db The MongoDB database instance.
 * @param collectionName The name of the collection to update the document in.
 * @param id The ID of the document to be updated.
 * @param updateFields The fields to be updated.
 * @returns {Promise<U>} A promise that resolves to the updated document.
 * @throws {Error} Throws an error if failed to update the document.
 */
export async function updateDataInDB<T, U>(
    db: Db,
    collectionName: PipelineCollectionNames,
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateFields: Partial<T>
): Promise<U> {
    try {
        const collection = db.collection(collectionName)

        // Ensure the document exists
        const existingDocument = await collection.findOne({id})
        if (!existingDocument) {
            throw new Error(`No document found with ID ${id}`)
        }

        const updateResult = await collection.updateOne({id}, {$set: updateFields as Document})

        if (updateResult.modifiedCount === 0) {
            throw new Error('Failed to update document')
        }

        // Fetch the updated document
        const updatedDocuments = await fetchRelationalData<U>(db, collectionName, {id})
        return updatedDocuments[0]
    } catch (error) {
        logger.error(error, `Error updating ${collectionName}s data: ${error}`)
        throw error
    }
}

/**
 * Updates a document in the specified collection based on the provided ID and update fields without returning the updated document.
 * @param db The MongoDB database instance.
 * @param collectionName The name of the collection to update the document in.
 * @param id The ID of the document to be updated.
 * @param updateFields The fields to be updated.
 * @returns {Promise<boolean>} A promise that resolves to true if the document was successfully updated, otherwise false.
 * @throws {Error} Throws an error if failed to update the document.
 */
export async function updateDataInDBWithoutReturn<T>(
    db: Db,
    collectionName: PipelineCollectionNames,
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateFields: Partial<T>
): Promise<boolean> {
    try {
        const collection = db.collection(collectionName)

        // Ensure the document exists
        const existingDocument = await collection.findOne({id})
        if (!existingDocument) {
            throw new Error(`No document found with ID ${id}`)
        }

        // Perform the update
        const updateResult = await collection.updateOne({id}, {$set: updateFields as Document})

        if (updateResult.modifiedCount === 0) {
            logger.error('Failed to update document')
            return false
        }

        return true
    } catch (error) {
        logger.error(error, `Error updating ${collectionName}s data`)
        throw error
    }
}

/**
 * Deletes a document from the specified collection based on the provided field name and value.
 * @param db The MongoDB database instance.
 * @param collectionName The name of the collection to delete the document from.
 * @param fieldName The name of the field to filter the documents by.
 * @param fieldValue The value of the field to filter the documents by.
 * @returns {Promise<boolean>} A promise that resolves to true if the document was successfully deleted, otherwise false.
 * @throws {Error} Throws an error if failed to delete the document.
 */
export async function deleteDocumentByField<T>(
    db: Db,
    collectionName: MongoCollection,
    fieldName: keyof T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fieldValue: any
): Promise<boolean> {
    try {
        const collection = db.collection(collectionName)
        const deleteResult = await collection.deleteOne({[fieldName]: fieldValue} as Document)

        if (deleteResult.deletedCount === 1) {
            return true
        } else {
            return false
        }
    } catch (error) {
        logger.error(error, `Error deleting document from ${collectionName} where ${String(fieldName)} = ${fieldValue}`)
        throw error
    }
}

/**
 * Updates a single field in the specified collection based on the provided ID and field name and value.
 * @param db The MongoDB database instance.
 * @param collectionName The name of the collection to update the document in.
 * @param id The ID of the document to be updated.
 * @param fieldName The name of the field to be updated.
 * @param fieldValue The new value of the field.
 * @returns {Promise<boolean>} A promise that resolves to true if the document was successfully updated, otherwise false.
 * @throws {Error} Throws an error if failed to update the document.
 */
export async function updateSingleFieldInDB<T>(
    db: Db,
    collectionName: PipelineCollectionNames,
    id: string,
    fieldName: keyof T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fieldValue: any
): Promise<boolean> {
    try {
        const collection = db.collection(collectionName)

        // Ensure the document exists
        const existingDocument = await collection.findOne({id})
        if (!existingDocument) {
            throw new Error(`No document found with ID ${id}`)
        }

        // Perform the update
        const updateResult = await collection.updateOne({id}, {$set: {[fieldName]: fieldValue}})

        if (updateResult.modifiedCount === 0) {
            logger.error('Failed to update document')
            return false
        }

        return true
    } catch (error) {
        logger.error(error, `Error updating ${collectionName}s data`)
        throw error
    }
}
