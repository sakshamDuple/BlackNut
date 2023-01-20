const product = require("../Model/Product");
const CropS = require('./CropS')
const MachineS = require('./MachineS')

exports.create = async (data) => {
    try {
        let foundCrop
        let foundMachine
        let foundCropId
        let foundMachineId
        let UnitId = data.UnitId
        if (data.crop) foundCrop = await CropS.findCrop({ cropName: data.crop })
        let { Capacity, Model, Price, ProductID, Status } = data.products[0].productDetail[0]
        // if (data.Unit[0]) foundUnit = await UnitS.findUnit(data.Unit[0].Unit, data.Unit[0].field)
        // if(!foundUnit) foundUnit = await UnitS.create({unitName:data.Unit[0].Unit,field:data.Unit[0].field})
        // if(foundUnit) UnitId = foundUnit._id
        if (foundCrop.data != null) {


            // let prevProduct = foundPrd.products.find((o, i) => {
            //     if (o.Product_name === data.products[0].Product_name) return o
            // });
            // if (prevProduct != null) {
            //     let prevMachine = prevProduct.machines.find((p, i) => {
            //         if (p.Machine_name === data.products[0].machines[0].Machine_name) return p
            //     })
            //     if (prevMachine != null) {
            //         let prevProductDetail = prevMachine.productDetail
            //         prevProductDetail.push(data.products[0].machines[0].productDetail[0])
            //         prevMachine.productDetail = prevProductDetail
            //     } else {
            //         prevMachine = []
            //         prevMachine.push(data.products[0].machines[0])
            //     }
            //     prevProduct.machines = prevMachine
            // } else {
            //     prevProduct = []
            //     console.log(prevProduct)
            //     prevProduct.push(data.products[0])
            // }
            // foundPrd.products = prevProduct
            // let updateProduct = await product.updateOne({_id:foundPrd._id}, { $set: foundPrd })
            // return { data: updateProduct.modifiedCount>0 && foundPrd, message: updateProduct.modifiedCount>0 && "updated Successfully", status: updateProduct.modifiedCount>0 && 200 }


            foundCropId = foundCrop.data._id
            if (data.products[0].Machine_name) foundMachine = await MachineS.findMachine({ Machine_name: data.products[0].Machine_name })
            if (foundMachine.data != null) {
                foundMachineId = foundMachine.data._id
                let createProduct
                // if (Status && ProductID) {createProduct = await product.create({ Capacity, Model, Price, ProductID:ProductID, Status:Status, cropId: foundCropId, machineId: foundMachineId, UnitId })}else{
                //     createProduct = await product.create({ Capacity, Model, Price, cropId: foundCropId, machineId: foundMachineId, UnitId })
                // }
                data.products[0].productDetail.map(productD => {
                    productD.cropId = foundCropId
                    productD.machineId = foundMachineId
                    productD.UnitId = UnitId
                });
                createProduct = await product.insertMany(data.products[0].productDetail)
                return { data: createProduct, message: "productDetail created Successfully", status: 201 }
            }
            let createMachine = await MachineS.create({ Machine_name: data.products[0].Machine_name, Product_name: data.products[0].Product_name, cropId: foundCrop.data._id })
            console.log("ProductID, Status 2", ProductID, Status)
            if (Status && ProductID) return { data: await product.create({ Capacity, Model, Price, ProductID, Status, cropId: foundCrop.data._id, machineId: createMachine.data._id, UnitId }), message: "created Successfully", status: 201 }
            return { data: await product.create({ Capacity, Model, Price, cropId: foundCrop.data._id, machineId: createMachine.data._id, UnitId }), message: "created Successfully", status: 201 }
        } else {
            let createCrop = await CropS.create(data.crop)
            let createMachine = await MachineS.create({ Machine_name: data.products[0].Machine_name, Product_name: data.products[0].Product_name, cropId: createCrop.data._id })
            console.log("ProductID, Status 2", ProductID, Status)
            if (Status && ProductID) return { data: await product.create({ Capacity, Model, Price, ProductID, Status, cropId: createCrop.data._id, machineId: createMachine.data._id, UnitId }), message: "created Successfully", status: 201 }
            return { data: await product.create({ Capacity, Model, Price, cropId: createCrop.data._id, machineId: createMachine.data._id, UnitId }), message: "created Successfully", status: 201 }
        }
    } catch (e) {
        console.log(e)
        return { error: e, message: "creation / updation failed" }
    }
}

exports.findOneById = async (id) => {
    return await product.findById(id)
}

exports.findProductsForMachineId = async (MachineId) => {
    let products = await product.find({ machineId: MachineId })
    return { data: products, message: products.length > 0 ? "retrieval Success" : "not products found", status: products.length > 0 ? 200 : 404 }
}

exports.findOneByProductId = async (ProductId) => {
    return await product.findOne({ ProductID: ProductId })
}

exports.deleteOnly = async (id) => {
    return await product.deleteOne(id)
}

exports.updateProductById = async ({ Capacity, Model, Price, _id }, Unit) => {
    let updateThisProductDetail = await product.updateOne({ _id }, { $set: { Capacity, Model, Price } })
    return { data: updateThisProductDetail.modifiedCount > 0, message: updateThisProductDetail.modifiedCount > 0 ? "updated Successfully" : "update Failed", status: updateThisProductDetail.modifiedCount > 0 ? 200 : 400 }
}