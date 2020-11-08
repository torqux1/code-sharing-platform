exports.index = {
    type: 'object',
    properties: {
        query: {
            type: 'object',
            properties: {
                page: {type: ['string','integer'], 'pattern': '^[0-9]+$'},
                limit: {type: ['string','integer'], 'pattern': '^[0-9]+$'},
                sort: {type: 'string', 'enum': ['countUsedInSnippets', 'countLikesInSnippets']}
            }
        }
    }
};

exports.show = {
    type: 'object',
    properties: {
        params: {
            type: 'object',
            properties: {
                tagId: {type: 'string'}
            },
            required: ['tagId']
        }
    },
    required: ['params']
};

exports.store = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                name : { type: 'string' }
            },
            required: ['name'],
            additionalProperties: false
        }
    },
    required: ['body']
};

exports.update = {
    type: 'object',
    properties: {
        params: {
            type: 'object',
            properties: {
                tagId: {type: 'string'}
            },
            required: ['tagId']
        },
        body: {
            type: 'object',
            properties: {
                countUsedInSnippets: { type: 'integer', 'minimum': 0 },
                countLikesInSnippets: { type: 'integer', 'minimum': 0 }
            },
            minProperties: 1,
            additionalProperties: false
        }
    },
    required: ['params', 'body']
};