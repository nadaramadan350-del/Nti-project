const multer = require("multer");
const fs = require("fs");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = "uploads";

    if (req.baseUrl.includes("courses")) {
      dest = "uploads/courses";
    } else if (req.baseUrl.includes("users") || req.baseUrl.includes("auth")) {
      dest = "uploads/users";
    }

    try {
      fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    } catch (err) {
      cb(err, null);
    }
  },

  filename: function (req, file, cb) {
    let fileName = file.originalname;
    let fileType = file.mimetype.split("/")[1];
    if (req.baseUrl.includes("courses")) {
      fileName = `course-${Date.now()}.${fileType}`;
    } else if (req.baseUrl.includes("users") || req.baseUrl.includes("auth")) {
      fileName = `user-${Date.now()}.${fileType}`;
    }

    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype.split("/")[0];

  if (fileType == "image") {
    cb(null, true);
  } else {
    cb(new error(), false);
  }
};

const upload = multer({ storage: diskStorage, fileFilter });

module.exports = upload;
