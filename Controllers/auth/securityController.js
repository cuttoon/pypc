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
        return res
          .status(400)
          .send({ statusCode: 400, message: "Incomplete data" });
      } else {
        let datavalidEmail = await userdb.getUserbyEmail(email);

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
        return res.status(400).send({ message: "Email already exists" });
      }

      let result = await userdbUser.createUser(newUser);
  
      const token = TokenSignup({ id: result }, secret, "1h");
  
      const resetLink = `http://127.0.0.1:9090/reset-password`;
  
      const emailResult = await sendEmail(
        req.body.correo,
        "Set Your Password",
        "Please click the link below to set your password.",
        `<p>Please click the link below to set your password:</p><p><a href="${resetLink}">Click aqui</a></p>`
      );
  
      if (emailResult.error) {
        throw new Error(emailResult.error);
      }
      res.status(200).json({
        message: "User created successfully, please check your email to set your password.",
        token: token
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
  
      // Verifica si el usuario existe por email
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
  
      const token = TokenSignup({ id: userId }, secret, "1h");
  
      const resetLink = `http://127.0.0.1:9090/reset-password`;
  
      const subject = "Password Reset Request";
      const text = `To reset your password, click the following link: ${resetLink}`;
      const html = `<p>To reset your password, click the following link:</p><p><a href="${resetLink}">Reset Password</a></p>`;
  
      const result = await sendEmail(email, subject, text, html);
  
      if (result.error) {
        throw new Error(result.error);
      }
  
      res.status(200).json({
        message: result.success || "Password reset email sent successfully.",
        token: token
      });
    } catch (error) {
      console.error("Error in ForgotPassword controller:", error);
      next(error);
    }
  }
};
