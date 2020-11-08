exports.login = {
    type: 'object',
    properties: {
        body : {
            type: 'object',
            properties: {
                'email': {type: "string", format: "email"},
                'password': { type: 'string' }
            },
            required: ['email', 'password'],
            additionalProperties: false
        }
    },  
    required: ['body']
 };

 exports.register = {
    type: 'object',
    properties: {
        body : {
            type: 'object',
            properties: {
                'email': {type: "string", format: "email"},
                'firstName': { type: 'string' },
                'lastName': { type: 'string' },
                'password': { type: 'string' },
                'isAdmin': {type: 'integer', 'enum': [0, 1]}
            },
            required: ['firstName', 'lastName', 'email', 'password'],
            additionalProperties: false
        }
    },  
    required: ['body']
 };
