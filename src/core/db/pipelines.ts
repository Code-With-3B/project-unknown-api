export const pipelines = {
    'users': [
        {$match: {}},
        {
            $lookup: {
                from: 'accounts-following',
                localField: 'following',
                foreignField: 'follower',
                as: 'following'
            }
        }
    ],
    'access-tokens': [{$match: {}}],
    'user-connection-interactions': [{$match: {}}],
    'highlights': [{$match: {}}],
    'teams': [{$match: {}}],
    'team-invitations': [{$match: {}}],
    'team-members': [{$match: {}}]
}
