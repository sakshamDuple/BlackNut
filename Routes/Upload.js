const router = require("express").Router()
const { uploadFiles } = require("../Controller/UploadC")

const multer = require("multer");

var storage = multer.memoryStorage();

var uploadDirect = multer({ storage: storage });

// const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: {
//         fieldNameSize: 255,
//         fileSize: maxSize,
//         files: 1,
//         fields: 1
//     }
// });

const uploadPO = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024
    }
}).single('file'); 

router.post('/', uploadDirect.single("file"), uploadFiles)
router.post('/uploadPO', uploadPO, uploadFiles)

module.exports = router;