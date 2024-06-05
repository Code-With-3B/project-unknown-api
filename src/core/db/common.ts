import {MongoCollection} from '../../@types/collections'
import {pipelines} from './pipelines'

import {Db, Document} from 'mongodb'

type PipelineCollectionNames = keyof typeof pipelines

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
        throw error
    }
}

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
        throw new Error('Error inserting document')
    } catch (error) {
        throw error
    }
}

export async function fetchDocumentByName<T>(
    db: Db,
    collectionName: MongoCollection,
    name: string,
    caseInsensitive: boolean = false
): Promise<T | null> {
    const queryOptions = caseInsensitive ? 'i' : ''
    try {
        const collection = db.collection(collectionName)
        const result = await collection.findOne({
            username: {$regex: '^' + name + '$', $options: queryOptions}
        })
        return result as T
    } catch (error) {
        throw error
    }
}

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
        throw error
    }
}
