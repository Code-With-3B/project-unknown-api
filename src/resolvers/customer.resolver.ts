import {Customer, Resolvers} from '../graphql/generated-types'

export const customerResolver: Resolvers = {
    Query: {
        customer: (): Customer => {
            return {name: 'customer'}
        }
    }
}
