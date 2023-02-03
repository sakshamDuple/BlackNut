const Crop = require('../Model/Crop')

exports.create = async (cropName) => {
    try {
        let crop = await Crop.create({ crop:cropName })
        return { data: crop, message: "crop created successfully", status: 201 }
    } catch (e) {
        console.log(e)
        return { error:e,message: "crop can't be created, got in some issue", status: 400 }
    }
}

exports.findCrop = async (data) => {
    try {
        let foundCrop = await Crop.findOne({ crop: data.cropName })
        return { data: foundCrop, message: foundCrop?"crop retrieved successfully":"crop not found", status: foundCrop? 200:404 }
    } catch (e) {
        console.log(e)
        return { error:e,message: "crop can't be retrieved, got in some issue", status: 400 }
    }
}

exports.findCropById = async (id) => {
    try {
        let foundCrop = await Crop.findById(id)
        return { data: foundCrop, message: foundCrop?"crop retrieved successfully":"crop not found", status: foundCrop? 200:404 }
    } catch (e) {
        console.log(e)
        return { error:e,message: "crop can't be retrieved, got in some issue", status: 400 }
    }
}

exports.findCropByIdAndUpdate = async (id,cropName) => {
    try {
        let updateCrop = await Crop.updateOne({_id:id},{crop:cropName})
        return { data: updateCrop.nModified>0, message: updateCrop.nModified>0?"crop was updated":"crop was not updated", status: updateCrop.nModified>0? 200:400 }
    } catch (e) {
        console.log(e)
        return { error:e,message: "crop can't be retrieved, got in some issue", status: 400 }
    }
}

exports.getAllCrops = async () => {
    try {
        return { data: await Crop.find(), message: "crops retrieved successfully", status: 200 }
    } catch (e) {
        console.log(e)
        return { error:e,message: "crop can't be retrieved, got in some issue", status: 400 }
    }
}