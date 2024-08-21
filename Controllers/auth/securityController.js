const userdb = require("../../Service/authService/Serviceaccount");
const userdbUser = require("../../Service/authService/Serviceusers");
const { secret } = require("../../Settings/Enviroment/config");
const bcrypt = require("bcrypt");
const { validateUser, validatePassword } = require("../../Models/users");
const { existEmail } = require("../common");
const jwt = require("jsonwebtoken");
const {
  TokenSignup,
  ExisToken,
  TokenDestroy,
} = require("../../Settings/Server/midlewar/TokenService");
const {
  forgotPass,
  resetPass,
} = require("../../Service/authService/ResetPassword");
module.exports = {
  Signin: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email == null && password == null) {
        return res
          .status(400)
          .send({ statusCode: 400, message: "Datos imcompletos" });
      } else {
        let datavalidEmail = await userdb.getUserbyEmail(email);

        if (bcrypt.compareSync(password, datavalidEmail.CUSU_PASSWORD)) {
          const payload = {
            id: datavalidEmail.NUSU_ID,
            rol: datavalidEmail.NUSU_ROLID,
          };
          const token = TokenSignup(payload, secret, "12h");

          return res.status(200).send({
            IdCuenta: datavalidEmail.NUSU_ID,
            IdRol: datavalidEmail.NUSU_ROLID,
            Nombre: datavalidEmail.NOMBRE,
            Token: token,
          });
        } else {
          return res
            .status(401)
            .send({ statusCode: 400, message: "Datos inconsistente" });
        }
      }
    } catch (ex) {
      return res.status(500).send({ statusCode: 500, message: ex.message });
    }
  },
  Signup: async (req, res) => {
    try {
      const newUser = validateUser(req.body);

      if (await existEmail(req.body.correo)) {
        throw new CustomError({ correo: ["email already exists"] }, 400);
      }

      let result = await userdbUser.createUser(newUser);
      res.send({ result });
    } catch (ex) {
      return res.status(500).send({ statusCode: 500, message: ex.message });
    }
  },
  ResetPassword: async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;

      validatePassword(newPassword);

      const decodedToken = jwt.verify(token, secret);
      const userId = decodedToken.id;

      if (!ExisToken(userId)) {
        return res.status(400).json({ message: "Invalid or expired token :D" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await resetPass(userId, hashedPassword);
      

      TokenDestroy(userId);

      res
        .status(200)
        .json({ message: "Password has been successfully reset." });
    } catch (error) {
      next(error);
    }
  },
  ForgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await userdb.getUserbyEmail(email);
      if (!user) {
        const error = new Error("Email does not exist.");
        error.status = 404;
        throw error;
      }

      const userId = await forgotPass(email);
        if (userId.error) {
            throw new Error(userId.error);
        }

        const token = TokenSignup({ id: userId }, secret, '1h'); 
        

      const resetLink = `${req.headers.origin}/reset-password?token=${token}`;
      /* await sendEmail({
        to: user.CUSU_EMAIL,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. -> Ejemplo</p>`,
      }); */

      res.status(200).json({
        message: "Token generated successfully",
        token: token,
        resetLink: resetLink,
      });

      /* res
        .status(200)
        .json({ message: "Password reset link has been sent to your email." }); */
    } catch (error) {
      next(error);
    }
  },
};
