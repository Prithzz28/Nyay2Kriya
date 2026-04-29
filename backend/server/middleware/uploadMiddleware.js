const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/tiff",
      "image/bmp",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only PDF and common image files are supported for OCR upload"));
    }

    return cb(null, true);
  },
});

module.exports = {
  upload,
};
