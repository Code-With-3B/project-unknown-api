import {ResolverContext} from '../../@types/context'
import {createHighlight} from '../services/highlight.service'

import {CreateHighlightResponse, Resolvers} from '../../generated/highlight'

export const highlightResolver: Resolvers = {
    Mutation: {
        createHighlight: (_, {input}, context: ResolverContext): Promise<CreateHighlightResponse> => {
            return createHighlight(context, input)
        }
    }
}
