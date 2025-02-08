const multer = require("multer");
const storage = multer.memoryStorage();  // Store files in memory
const upload = multer({ storage });  // Configure multer with storage

module.exports = { upload };  // Export upload middleware
