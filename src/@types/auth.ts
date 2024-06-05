export interface TokenInputPayload {
    id: string
    createdAt: string
}

export interface GraphQLRequestBody {
    operationName?: string
    query?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables?: Record<string, any>
}
