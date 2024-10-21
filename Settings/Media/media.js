const multer = require("multer");
const upload = require("./storage");
const CustomError = require("../../Service/errors");

const {
  deleteFiles,
  picturesAssingBody,
  materialsAssingBody,
  reportsAssingBody,
  pdfsAssignBody
} = require("./common");

const media = upload.fields([{ name: "picture", maxCount: 1 }]);

const checkPictures = (req, resp, next) => {
  media(req, resp, function (err) {
    console.log("Archivos recibidos:", req.files);
    const files = JSON.parse(JSON.stringify(req.files));
    const reqBody = JSON.parse(JSON.stringify(req.body));

    if (err) {
      console.log("Error en checkPictures:", err);
      deleteFiles(files);
      if (err instanceof CustomError) {
        return next(err);
      }
      if (err instanceof multer.MulterError) {
        return next(
          new CustomError(
            { code: err.code, field: err.field, error: err.message },
            400
          )
        );
      }
    } else {
      if (Object.keys(files).length <= 1) {
        req.body = picturesAssingBody(files, reqBody);
        return next();
      } else {
        req.body = picturesAssingBody(files, reqBody);
        return next();
      }
    }
  });
};

const materials = upload.fields([{ name: "material", maxCount: 1 }]);

const checkMaterials = (req, resp, next) => {
  materials(req, resp, function (err) {
    const files = JSON.parse(JSON.stringify(req.files));
    const reqBody = JSON.parse(JSON.stringify(req.body));
    if (err instanceof multer.MulterError) {
      return next(
        new CustomError(
          { code: err.code, field: err.field, error: err.message },
          400
        )
      );
    }
    req.body = materialsAssingBody(files, reqBody);
    return next();
  });
};

const reports = upload.fields([{ name: "filepath", maxCount: 1 }]);

const checkreports = (req, resp, next) => {
  reports(req, resp, function (err) {
    const files = JSON.parse(JSON.stringify(req.files));
    const reqBody = JSON.parse(JSON.stringify(req.body));
    if (err instanceof multer.MulterError) {
      return next(
        new CustomError(
          { code: err.code, field: err.field, error: err.message },
          400
        )
      );
    }
    req.body = reportsAssingBody(files, reqBody);
    return next();
  });
};

const pdfUpload = upload.fields([{ name: "pdffiles", maxCount: 10 }]);

const checkPDFs = (req, res, next) => {
  pdfUpload(req, res, function (err) {
    const files = JSON.parse(JSON.stringify(req.files));
    const reqBody = JSON.parse(JSON.stringify(req.body));

    if (err instanceof multer.MulterError) {
      return next(
        new CustomError(
          { code: err.code, field: err.field, error: err.message },
          400
        )
      );
    }

    req.body = pdfsAssignBody(files, reqBody);
    return next();
  });
};

module.exports = { checkPictures, checkMaterials, checkreports, checkPDFs };
