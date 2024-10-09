const jwt = require('jsonwebtoken');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();


TokenSignup = function(payload, secret, expiration) {
  let _Token = jwt.sign(payload, secret, { expiresIn: expiration });
  myCache.set(payload.id, _Token);  // Almacenar el token usando userId
  return _Token;  // Asegúrate de retornar el JWT correctamente
}

ExisToken = function(userId){
    let bStatus =false;
   try{
    let data=  myCache.get(userId);
    if(data){
        bStatus=true
    }
    
   }catch(error){
     console.log("(error => (token service exist)) :" + error)
     bStatus=false;
   }   
   return bStatus;
}

TokenDestroy = function(value){
    let bStatus =true;
    try{
        myCache.del(value)
       }catch(error){
         console.log("(error => (token service del)) :" + error)
         bStatus=false;
       }   
    
    return bStatus
}

module.exports = {
    TokenSignup ,
    TokenDestroy,
    ExisToken
};