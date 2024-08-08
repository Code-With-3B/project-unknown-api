import {MongoCollection} from '../../../@types/collections'
import {ResolverContext} from '../../../@types/context'
import {OrgResponseCode} from '../../../constants/auth/response-codes/org'
import {logger} from '../../../config'
import {updateTeamMemberInTeam} from '../../db/collections/team'
import {upsertTeamMember} from '../../db/collections/team-invitation'
import {v4 as uuid} from 'uuid'

import { Team, TeamStatus} from '../../../generated/team'
import {OrganizationCollection, TeamMembersCollection} from '../../../generated/mongo-types'
import {doesDocumentExistByField, insertDataInDB} from '../../db/utils'
import { CreateOrgInput, CreateOrgResponse } from '../../../generated/org'

export async function createOrg(context: ResolverContext, input: CreateOrgInput): Promise<CreateOrgResponse> {
    try {
        logger.info(input, `Creating organization. for userId ${input.ownerId}`)

        const errorCodes = []

        if (!input.name || input.name.trim().length < 4) errorCodes.push(OrgResponseCode.INVALID_ORG_NAME)
        else if (await doesDocumentExistByField(context.mongodb, MongoCollection.ORG, {name: input.name}))
            errorCodes.push(OrgResponseCode.DUPLICATE_ORG_NAME)

        if (!input.game || input.game.length < 2) errorCodes.push(OrgResponseCode.INVALID_GAME_NAME)

        if (!input.description) errorCodes.push(OrgResponseCode.INVALID_ORG_DESCRIPTION)
        if (
            !input.ownerId ||
            input.ownerId.length == 0 ||
            !(await doesDocumentExistByField(context.mongodb, MongoCollection.USER, {id: input.ownerId}))
        ) {
            errorCodes.push(OrgResponseCode.INVALID_OWNER_ID)
        }

        if (errorCodes.length > 0) {
            logger.error(errorCodes, 'Error creating organization')
            return {success: false, code: errorCodes}
        }

        const document: OrganizationCollection = {
            id: uuid(),
            name: input.name,
            game: input.game,
            teamProfilePicture: input.teamProfilePicture ?? '',
            teamBannerPicture: input.teamBannerPicture ?? '',
            description: input.description,
            status: TeamStatus.Public,
            createdAt: new Date().toISOString()
        }

        const result = await insertDataInDB<OrganizationCollection, Team>(context.mongodb, MongoCollection.TEAM, document)
        const teamMember: TeamMembersCollection = {
            id: uuid(),
            teamId: result.id,
            userId: input.ownerId,
            roles: ['OWNER']
        }

        const newMember = await upsertTeamMember(
            context.mongodb,
            {
                userId: teamMember.userId,
                teamId: result.id
            },
            teamMember
        )
        if (newMember) {
            await updateTeamMemberInTeam(context.mongodb, result.id, newMember)
            return {
                success: true,
                code: [OrgResponseCode.ORG_CREATION_SUCCESS],
                team: result
            }
        }
        logger.info(`Organization creation ${result ? 'Success' : 'Failed'}`)
        return {
            success: !!result,
            code: [result ? OrgResponseCode.ORG_CREATION_SUCCESS : OrgResponseCode.ORG_CREATION_FAILED],
            team: result
        }
    } catch (error) {
        logger.error(error, 'Error creating organization')
        logger.error(error)
        throw error
    }
}
