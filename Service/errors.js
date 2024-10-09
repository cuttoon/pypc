class CustomError {    
    constructor(message, statusCode) {
        this.message = message;
        this.name = this.constructor.name;       
        this.statusCode = statusCode;             
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }        
    }
}

module.exports = CustomError;
