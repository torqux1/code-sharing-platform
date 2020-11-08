exports.index = {
    type: 'object',
    properties: {
        query: {
            type: 'object',
            properties: {
                page: {type: ["string","integer"], "pattern": "^[0-9]+$"},
                limit: {type: ["string","integer"], "pattern": "^[0-9]+$"},
                relations: {
                    type: 'array',
                    items: { type: 'string', 'enum': ['creator', 'tags']},
                    minItems: 1
                }
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
                snippetId: { type: "string" }
            },
            required: ['snippetId']
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
                name: {type: 'string'},
                code: {type: 'string'},
                description: {type: 'string'},
                tags: {type: 'array', items: {type: 'string'}},
                isShared: {type: 'integer', 'enum': [0, 1]}
            },
            required: ['name','code','description','tags','isShared'],
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
                snippetId: {type: 'string'}
            },
            required: ['snippetId']
        },
        body: {
            type: 'object',
            properties: {
                action: { type: 'string', 'enum': ['like', 'dislike']},
            },
            required: [ "action" ],
            additionalProperties: false
        }
    },
    required: ['params', 'body']
};

exports.destroy = {
    type: 'object',
    properties: {
        params: {
            type: 'object',
            properties: {
                snippetId: {type: 'string'}
            },
            required: ['snippetId']
        }
    },
    required: ['params']
};

