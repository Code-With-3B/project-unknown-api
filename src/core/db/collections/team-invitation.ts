import {Db} from 'mongodb'
import {MongoCollection} from '../../../@types/collections'
import {logger} from '../../../config'

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
