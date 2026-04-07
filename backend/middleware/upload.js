const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeName = path.basename(file.originalname || "resume", ext).replace(/[^a-zA-Z0-9_-]/g, "-");
    cb(null, `${Date.now()}-${safeName}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const allowed = [".pdf", ".doc", ".docx"];

  if (!allowed.includes(ext)) {
    const error = new Error("File type not supported. Only .pdf, .doc, .docx are allowed.");
    error.code = "INVALID_FILE_TYPE";
    return cb(error);
  }

  cb(null, true);
}

const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  uploadResume,
};
