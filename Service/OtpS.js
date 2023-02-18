const TempOtp = require("../Model/TempOtp");

exports.create = async (data) => {
    return await TempOtp.create(data)
}

exports.findOnly = async (number) => {
    let findOne = await TempOtp.find({ number:number }).sort({createdAt: -1}).limit(1)
    console.log("findOne",findOne[0],await TempOtp.findOne({number}))
    return findOne[0]
}

exports.deleteOnly = async (number) => {
    return await TempOtp.deleteOne({number})
}