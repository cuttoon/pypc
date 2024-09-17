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
  sendEmail,
} = require("../../Service/authService/NewPassword");
const CustomError = require("../../Service/errors");

module.exports = {
  Signin: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email == null && password == null) {
        throw new CustomError("Incomplete data", 400);
      } else {
        let datavalidEmail = await userdb.getUserbyEmail(email);

        if (!datavalidEmail) {
          throw new CustomError("Email not found", 404);
        }

        if (bcrypt.compareSync(password, datavalidEmail.CUSU_PASSWORD)) {
          const payload = {
            id: datavalidEmail.NUSU_ID,
            rol: datavalidEmail.NUSU_ROLID,
          };
          const token = TokenSignup(payload, secret, "1h");

          return res.status(200).send({
            IdCuenta: datavalidEmail.NUSU_ID,
            IdRol: datavalidEmail.NUSU_ROLID,
            Nombre: datavalidEmail.NOMBRE,
            Token: token,
          });
        } else {
          return res
            .status(401)
            .send({ statusCode: 400, message: "Inconsistent data" });
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
        throw new CustomError("Email already exists", 400);
      }

      let result = await userdbUser.createUser(newUser);

      const token = TokenSignup({ id: result }, secret, "1h");

      res.status(200).json({
        message:
          "User created successfully, please check your email to set your password.",
        token: token,
        email: req.body.correo,
      });
    } catch (ex) {
      return res.status(500).send({ message: ex.message });
    }
  },
  ResetPassword: async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;

      validatePassword(newPassword);

      const decodedToken = jwt.verify(token, secret);
      const userId = decodedToken.id;

      if (!ExisToken(userId)) {
        return res.status(400).json({ message: "Invalid or expired token" });
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

      const userId = user.NUSU_ID;
      if (!userId) {
        throw new Error("User ID not found.");
      }

      const result = await forgotPass(email);
      if (result.error) {
        throw new Error(result.error);
      }

      const token = TokenSignup({ id: userId }, secret, "1h");

      res.status(200).json({
        message: "Please check your email to set your password.",
        token: token,
        email: email,
      });
    } catch (error) {
      console.error("Error in ForgotPassword controller:", error);
      next(error);
    }
  },

  SendEmail: async (req, res) => {
    try {
      const { email, subject, text, html } = req.body;
      if (!email || !subject || !html) {
        return res.status(400).send({ message: "All fields are required" });
      }
      const emailResult = await sendEmail(email, subject, text, html);

      if (emailResult.error) {
        return res.status(500).send({ message: emailResult.error });
      }

      res
        .status(200)
        .send({ message: "Email sent successfully", result: emailResult });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
