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
    'accounts-following': [{$match: {}}]
}
