const TempOtp = require("../Model/TempOtp");

exports.create = async (data) => {
    return await TempOtp.create(data)
}

exports.findOnly = async (number) => {
    return await TempOtp.findOne({number})
}

exports.deleteOnly = async (number) => {
    return await TempOtp.deleteOne({number})
}