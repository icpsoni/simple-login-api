const path = require("path");

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = fileTypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  // Check mime
  const mimetype = fileTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error : Images Only for Profile Picture!");
  }
}

// Exporting checkFileType
module.exports = checkFileType;
