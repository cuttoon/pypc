const userdb = require("../../Service/authService/Serviceaccount");
const userdbUser = require("../../Service/authService/Serviceusers");
const { secret } = require("../../Settings/Environment/config");
const bcrypt = require("bcrypt");
const { validateUser } = require("../../Models");
const { existEmail } = require("../common");
const {
  TokenSignup,
  ExisToken,
  TokenDestroy,
} = require("../../Settings/Server/middleware/TokenService");
module.exports = {
  Signin: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("recibiendo data", req.body);
      if (email == null && password == null) {
        return res
          .status(400)
          .send({ statusCode: 400, message: "Incomplete data" });
      } else {
        let datavalidEmail = await userdb.getUserbyEmail(email);

        if (!datavalidEmail) {
          return res
            .status(404)
            .send({ statusCode: 404, message: "Email not found" });
        }

        const passwordMatch = bcrypt.compareSync(
          password,
          datavalidEmail.CUSU_PASSWORD
        );
        if (!passwordMatch) {
          return res
            .status(401)
            .send({ statusCode: 401, message: "Invalid password" });
        }

        const payload = {
          id: datavalidEmail.NUSU_ID,
          rol: datavalidEmail.NUSU_ROLID,
        };
        const token = TokenSignup(payload, secret, "1h");

        return res.status(200).send({
          Id: datavalidEmail.NUSU_ID,
          IdRol: datavalidEmail.NUSU_ROLID,
          Name: datavalidEmail.NAME,
          Token: token,
        });
      }
    } catch (ex) {
      return res.status(500).send({ statusCode: 500, message: ex.message });
    }
  },
  Signup: async (req, res) => {
    try {
      const newUser = validateUser(req.body);

      if (await existEmail(req.body.email)) {
        return res
          .status(400)
          .send({ statusCode: 400, message: "Email already exists" });
      }

      let result = await userdbUser.createUser(newUser);

      const token = TokenSignup({ id: result }, secret, "1h");

      res.status(200).json({
        message:
          "User created successfully, please check your email to set your password.",
        token: token,
        email: req.body.email,
      });
    } catch (ex) {
      return res.status(500).send({ message: ex.message });
    }
  },
};