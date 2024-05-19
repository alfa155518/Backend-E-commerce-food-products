const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadDir = path.join(__dirname, '../images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, `frontend/src/images/users`);
    // cb(null, path.join(__dirname, '../images'));
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    } else {
      cb(null, false);
    }
  },
});

function multerFilter(req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb({ msg: 'Not an image! Please upload only images.' }, false);
  }
}
// middleware
const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
  // limits: {
  //   fileSize: 1024 * 1024 * 5,
  // },
});

const uploadUserPhoto = upload.single('photo');

module.exports = {
  uploadUserPhoto,
};
