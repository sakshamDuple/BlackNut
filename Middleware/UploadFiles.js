const aws = require("aws-sdk");

const s3 = new aws.S3({
    endpoint: "sgp1.digitaloceanspaces.com",
    accessKeyId: "DO00XCWJA3Y3WT2E6MYN",
    secretAccessKey: "zXExL02RRSWc+1Gl6Pvf2ySQMv8NJ7woJFL9/TR25LQ",
    acl: 'public-read',
});

exports.filesUpload = function (key, folderName, data1, type) {
    return new Promise((resolve, reject) => {
        let params = {
            ACL: 'public-read',
            Bucket: 'blacknut' + "/" + folderName,
            Key: key,
            Body: data1,
            contentType: type,
        };
        console.log("Params: ", params);
        s3.upload(params, (err, data) => {
            if (err) {
                reject(new Error("File upload failed", err));
            } else {
                console.log("data :", data)
            }
            resolve();
        });
    });
};

