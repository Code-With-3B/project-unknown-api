import {Resolvers, User} from '../graphql/generated-types'

export const userResolver: Resolvers = {
    Query: {
        user: (): User => {
            return {name: 'user'}
        }
    }
}
