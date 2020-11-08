const Err = function (code, description) {
    this.code = code;
    this.description = description;
};


module.exports = {
    SUCC_OPERATION: new Err(0, 'Operation successful'),
    SUCC_CREATED: new Err(10, 'Resource created successfully'),
    BAD_REQUEST: new Err(24, 'Bad request'),
    NOT_AUTHORIZED: new Err(103, 'You don\'t have access. Please pass username and password or token'),
    ACCESS_FORBIDDEN: new Err(104, 'Not permitted access to the selected resource'),
    CONFLICT_REQUEST: new Err(201, 'The request could not be completed due to a conflict with the current state of the target resource'),
    NO_SUCH_RESOURCE: new Err(202, 'Resource does not exist'),
    SERVER_ERROR: new Err(203, 'Internal Server Error'),
    TAG_ALRAEDY_EXISTS: new Err(204, 'Tag with such name already exists'),
    USER_ALREADY_EXISTS: new Err(205, 'User with such email already exists. Please enter a new email'), 
    VALIDATION_ERR: new Err(206, 'Request validation failed'), 
    
};

