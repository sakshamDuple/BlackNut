const verifiedNumber = require("../Model/verifiedNumber");

exports.create = async (data) => {
    return await verifiedNumber.create(data)        
}

exports.findOnly = async (number) => {
    return await verifiedNumber.findOne({number})
}

exports.deleteOnly = async (number) => {
    return await verifiedNumber.deleteOne({number})
}