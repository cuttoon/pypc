const jwt = require('jsonwebtoken');
const { TokenDestroy, ExisToken} = require('./TokenService')

module.exports = (secret) => (req, resp, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next();
    }
    const [type, token] = authorization.split(' ');
    if (type.toLowerCase() !== 'bearer') {
        return next();
    }    
    jwt.verify(token, secret, async(err, decodedToken) => {
        if (err) {
            return next(403);
        }
        try {    
            console.log("decodedToken", decodedToken)
           if(ExisToken(decodedToken.id)){
               req.Token=token;
               req.user =decodedToken;
               next();
           }else{
            resp.status(500).send({ statusCode: 500, message:"Invalid Token" });
           }
                                      
        } catch (err) {
            resp.status(500).send({ statusCode: 500, message: err.message });
        }        
    });
};
module.exports.Filter = (req, resp, next) => {
    if (req.user) {
        return next();
    }
    return resp.status(401).json({ statusCode: 401, message: 'No autorizado' });
};
module.exports.Destroy = (req, resp, next) => { 
    //delete Tokens[req.token]
     if(TokenDestroy(req.user.id)){
        resp.send({ status:200 , mesage:"Closed" });
     }else{
        resp.send({ status:500 , mesage:"Error token" });
     }
    
};
