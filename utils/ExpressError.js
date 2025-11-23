
// In ExpressError class
class ExpressError extends Error{
    constructor(statusCode, message){
        super();
        this.statusCode = statusCode;  // Changed from this.status
        this.message = message;
    };
};
module.exports=ExpressError;