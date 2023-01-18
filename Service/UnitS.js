const Unit = require('../Model/Unit')

exports.create = async ({unitName,field}) => {
    let createUnit = await Unit.create({Unit:unitName.toLowerCase().trim(), field})
    return createUnit._id
}

exports.findUnit = async (unitName, field) => {
    let FindUnit = await Unit.findOne({Unit:unitName.toLowerCase().trim(), field})
    if(FindUnit) return FindUnit._id
}

exports.findUnitById = async (id) => {
    return await Unit.findById(id)
}

exports.getAll = async () => {
    return await Unit.find()
}
