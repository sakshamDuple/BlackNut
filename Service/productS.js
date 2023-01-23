const product = require("../Model/Product");
const CropS = require('./CropS')
const MachineS = require('./MachineS')

exports.create = async (data) => {
    try {
        let foundCrop
        let foundMachine
        let foundCropId
        let foundMachineId
        if (data.crop) foundCrop = await CropS.findCrop({ cropName: data.crop })
        let productToCreate = data.products[0].productDetail
        if (foundCrop.data != null) {
            foundCropId = foundCrop.data._id
            if (data.products[0].Machine_name) foundMachine = await MachineS.findMachine({ Machine_name: data.products[0].Machine_name })
            if (foundMachine.data != null) {
                foundMachineId = foundMachine.data._id
                let createProduct
                productToCreate.map(productD => {
                    productD.cropId = foundCropId
                    productD.machineId = foundMachineId
                });
                createProduct = await product.insertMany(productToCreate)
                return { data: createProduct, message: "productDetail created Successfully", status: 201 }
            }
            let createMachine = await MachineS.create({ Machine_name: data.products[0].Machine_name, Product_name: data.products[0].Product_name, cropId: foundCrop.data._id })
            productToCreate.map(productD => {
                productD.cropId = foundCropId
                productD.machineId = createMachine.data._id
            });
            return { data: await product.insertMany(productToCreate), message: "created Successfully", status: 201 }
        } else {
            let createCrop = await CropS.create(data.crop)
            let createMachine = await MachineS.create({ Machine_name: data.products[0].Machine_name, Product_name: data.products[0].Product_name, cropId: createCrop.data._id })
            productToCreate.map(productD => {
                productD.cropId = createCrop.data._id
                productD.machineId = createMachine.data._id
            });
            return { data: await product.insertMany(productToCreate), message: "created Successfully", status: 201 }
        }
    } catch (e) {
        console.log(e)
        return { error: e, message: "creation / updation failed" }
    }
}

exports.findOneById = async (id) => {
    return await product.findById(id)
}

exports.findByCropId = async (id) => {
    return await product.find({cropId:id})
}

exports.findProductsForMachineId = async (MachineId) => {
    let products = await product.find({ machineId: MachineId })
    return { data: products, message: products.length > 0 ? "retrieval Success" : "not products found", status: products.length > 0 ? 200 : 404 }
}

exports.findOneByProductId = async (ProductId) => {
    return await product.findOne({ ProductID: ProductId })
}

exports.getAllProducts = async () => {
    return await product.find()
}

exports.deleteOnly = async (id) => {
    return await product.deleteOne(id)
}

exports.updateProductById = async ({ Capacity, Model, Price, _id }, Unit) => {
    let updateThisProductDetail = await product.updateOne({ _id }, { $set: { Capacity, Model, Price } })
    return { data: updateThisProductDetail.modifiedCount > 0, message: updateThisProductDetail.modifiedCount > 0 ? "updated Successfully" : "update Failed", status: updateThisProductDetail.modifiedCount > 0 ? 200 : 400 }
}