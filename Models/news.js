const CustomError = require("../Service/errors");

const news = {
  ids: "number",
  title: "string",
  content: "string",
  published: "string",
};

const lettersNews = {
  ids: "number",
  title: "string",
  content: "string",
  published: "string",
};

const links = {
  ids: "number",
  title: "string",
  link: "string",
};

const validateObj = (validate, data) => {
  const error = {};
  const fields = Object.keys(data);

  Object.keys(validate).forEach((ele) => {
    if (!fields.includes(ele) || !data[ele]) {
      if (!isNaN(data[ele])) {
        if (data[ele] > 0 && ele == "ids") {
          if (data[ele]?.lenght === 0 || data[ele] == "") {
            error[ele] = ["This field may not be blank."];
          }
        }
      }
    } else if (Array.isArray(validate[ele])) {
      if (data[ele]?.lenght === 0 || data[ele] == "") {
        error[ele] = ["This field may not be blank."];
      } else if (!validate[ele].includes(typeof data[ele])) {
        error[ele] = [`This field must be an ${validate[ele][0]} or null`];
      }
    } else {
      if (["published"].includes(ele) && isNaN(Date.parse(data[ele]))) {
        error[ele] = ["This field must be a valid date."];
      }

      if (validate[ele] !== typeof data[ele] && !["published"].includes(ele)) {
        error[ele] = [`This field must be a ${validate[ele]}.`];
      }
    }
  });
  return error;
};

const validateNews = (data) => {
  const error = validateObj(news, data);

  if (Object.keys(error).length >= 1) {
    throw new CustomError(error, 400);
  } else {
    return data;
  }
};

const validateLettersNews = (data) => {
  const error = validateObj(lettersNews, data);

  if (Object.keys(error).length >= 1) {
      throw new CustomError(error, 400);
  } else {
      return data;
  }
};

const validateLink = (data) => {
  const error = validateObj(links, data);

  if (Object.keys(error).length >= 1) {
      throw new CustomError(error, 400);
  } else {
      return data;
  }
};

module.exports = {
  validateNews,
  validateLettersNews,
  validateLink
};
