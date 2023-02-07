const { filesUpload } = require("../Middleware/UploadFiles");

const FileUrl = "https://blacknut.sgp1.digitaloceanspaces.com/";
exports.uploadFiles = async function (req, res) {
    //console.log("Upload direct file request: ", req.file);

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