const verifiedNumber = require("../Model/verifiedNumber");

exports.create = async (data) => {
    return await verifiedNumber.create(data)        
}

exports.findOnly = async (number) => {
    let findOne = await verifiedNumber.find({ number:number }).sort({createdAt: -1}).limit(1)
    console.log("findOne",findOne[0],await verifiedNumber.findOne({number}))
    return findOne[0]
}

exports.deleteOnly = async (number) => {
    return await verifiedNumber.deleteOne({number})
}