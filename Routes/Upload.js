const router = require("express").Router()
const { uploadFiles } = require("../Controller/UploadC")

const multer = require("multer");

var storage = multer.memoryStorage();
var uploadDirect = multer({ storage: storage });

router.post('/', uploadDirect.single("file"), uploadFiles)

module.exports = router;