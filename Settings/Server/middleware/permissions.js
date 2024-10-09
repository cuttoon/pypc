const jwt = require("jsonwebtoken");
const { TokenDestroy, ExisToken } = require("./TokenService");

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;
  console.log("req.header", req.headers);
  if (!authorization) {
    return next();
  }
  const [type, token] = authorization.split(" ");
  if (type.toLowerCase() !== "bearer") {
    return next();
  }
  jwt.verify(token, secret, async (err, decodedToken) => {
    if (err) {
      console.log("Error verificando el token:", err.message);
      return resp
        .status(403)
        .send({ statusCode: 403, message: "Token inválido" });
    }
    try {
      if (ExisToken(decodedToken.id)) {
        req.Token = token;
        req.user = decodedToken;
        next();
      } else {
        console.log("Token no válido o no encontrado en el servicio");
        resp.status(500).send({ statusCode: 500, message: "Invalid Token" });
      }
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  });
};
module.exports.Filter = (req, resp, next) => (req.user ? next() : next(401));
module.exports.Destroy = (req, resp, next) => {
  //delete Tokens[req.token]
  if (TokenDestroy(req.user.id)) {
    resp.send({ status: 200, mesage: "Closed" });
  } else {
    resp.send({ status: 500, mesage: "Error token" });
  }
};
