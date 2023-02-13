const { filesUpload } = require("../Middleware/UploadFiles");

const FileUrl = "https://blacknut.sgp1.digitaloceanspaces.com/";

exports.uploadFiles = async function (req, res) {

    console.log(req.file)
    const dateString = Date.now();
    const regex = /[^a-zA-Z0-9.]/g;
    const Key = dateString + "_" + req.file.originalname.replace(regex, "_");
    var url = FileUrl + "BlackNut/" + Key;
    try {
        // exports.filesUpload = function (key, folderName, data1, fileExtension, type) {
        await filesUpload(Key, "BlackNut", req.file.buffer, req.file.mimetype);
    } catch (Ex) {
        console.log("Exception: ", Ex.message);
        return handleError(Ex, res);
    }
    res.status(200).send({
        statusCode: 200,
        message: "Success",
        data: {
            url
        }
    });
};

// exports.uploadFiles2 = upload(req, res, function (error) {
//     if (error) { //instanceof multer.MulterError
//         res.status(500);
//         if (error.code == 'LIMIT_FILE_SIZE') {
//             error.message = 'File Size is too large. Allowed fil size is 200KB';
//             error.success = false;
//         }
//         return res.json(error);
//     } 
//     // else {
//     //     if (!req.file) {
//     //         res.status(500);
//     //         res.json('file not found');
//     //     }
//     //     res.status(200);
//     //     res.json({
//     //         success: true,
//     //         message: 'File uploaded successfully!'
//     //     });
//     // }
// })
