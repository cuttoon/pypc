const CustomError = require("../Service/errors");
const validator = require("email-validator");
const bcrypt = require("bcrypt");

const user = {
  nombre: "string",
  apellido: "string",
  correo: "string",
  clave: "string",
  rol: "number",
  sexo: "string",
  pais: "number",
  ids: "number",
};

const sequentialCharacter = (password) => {
  for (let i = 0; i < password.length - 2; i++) {
    const charCode1 = password.charCodeAt(i);
    const charCode2 = password.charCodeAt(i + 1);
    const charCode3 = password.charCodeAt(i + 2);
    if (charCode2 === charCode1 + 1 && charCode3 === charCode2 + 1) {
      return true;
    }
  }
  return false;
};

// Regex para la validación de la contraseña
const passwordRegex = /^(?!.*(.)\1{2})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,30}$/;

const validatePassword = (password) => {
  if (!password || !passwordRegex.test(password)) {
    throw new Error("Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters. It cannot have more than two identical characters in a row.");
  }

  if(sequentialCharacter(password)){
    throw new Error('Password cannot contain sequential characters (e.g., 123, abc).');
  }
};

const validateObj = (validate, data) => {
  const error = {};
  const fields = Object.keys(data);

  Object.keys(validate).forEach((ele) => {
    if (!fields.includes(ele) || !data[ele]) {
      if (!isNaN(data[ele])) {
        if (ele == "clave" && data["ids"] == undefined) {
          error[ele] = ["This field may not be blank."];
        } else if (data[ele]?.length === 0 || data[ele] == "") {
          error[ele] = ["This field may not be blank."];
        }
      }
    } else if (Array.isArray(validate[ele])) {
      if (data[ele]?.length === 0 || data[ele] == "") {
        error[ele] = ["This field may not be blank."];
      } else if (!validate[ele].includes(typeof data[ele])) {
        error[ele] = [`This field must be an ${validate[ele][0]} or null`];
      }
    } else {
      if (ele === "sexo" && !["M", "F"].includes(data[ele])) {
        error[ele] = [`This field must be 'M' or 'F' .`];
      }

      if (ele === "rol" && ![1, 2, 3].includes(data[ele])) {
        error[ele] = [`This field must be 1, 2, or 3`];
      }

      if (ele === "correo" && !validator.validate(data[ele])) {
        error[ele] = [`This field must be in email format`];
      }

      if (ele === "clave" && !passwordRegex.test(data[ele])) {
        error[ele] = [
          "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.",
        ];
      }

      if (validate[ele] !== typeof data[ele]) {
        error[ele] = [`This field must be a ${validate[ele]}`];
      }
    }
  });
  return error;
};

const validateUser = (data) => {
  let is_superadmin = 0;
  let is_staff = 0;

  const error = validateObj(user, data);
  if (Object.keys(error).length >= 1) {
    throw new CustomError(error, 400);
  } else {
    switch (data.rol) {
      case 1:
        is_superadmin = 1;
        break;
      case 2:
        is_staff = 1;
        break;
      case 3:
        break;
    }
    if (data.clave != null) {
      data.clave = bcrypt.hashSync(data.clave, 10);
    }

    return data;
  }
};

module.exports = {
  validateUser,
  validatePassword,
};