const { error } = require("../Middleware/error");
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

exports.findByCropName = async (name) => {
    let foundCrop = await CropS.findCrop({ cropName: name })
    return await product.find({ cropId: foundCrop.data._id })
}

exports.findProductsForMachineId = async (MachineId) => {
    let products = await product.find({ machineId: MachineId })
    return { data: products, message: products.length > 0 ? "retrieval Success" : "not products found", status: products.length > 0 ? 200 : 404 }
}

exports.updateTheProductByMachine = async (MachineId, PrevProduct, Updates) => {
    let thisMachine = await MachineS.findMachineById(MachineId)
    let addProduct = false
    let ProductsToAdd = []
    let addedproductres = { status: 201 }
    console.log(thisMachine.data.Product_name,thisMachine)
    if (thisMachine.data.Product_name == Updates.Product_name && thisMachine.data.Machine_name == Updates.Machine_name) {
        console.log("hii", MachineId, PrevProduct[0], Updates);
        Updates.productDetail.map((element, i) => {
            if (PrevProduct[i] != undefined) {
                PrevProduct[i].Capacity = element.Capacity
                PrevProduct[i].Model = element.Model
                PrevProduct[i].Price = element.Price
                PrevProduct[i].ProductID = element.ProductID
                PrevProduct[i].Status = element.Status
            } else {
                addProduct = true
                element.cropId = thisMachine.data.cropId
                element.machineId = MachineId
                ProductsToAdd.push(element)
            }
        });
        let fails = [], successes = []
        if (ProductsToAdd.length > 0) {
            console.log("ProductsToAdd",ProductsToAdd)
            addedproductres = await addTheseProduct(ProductsToAdd)
            console.log("addedproductres",addedproductres)
            if (addedproductres.status != 201) return addedproductres
        }
        await update(PrevProduct, fails, successes)
        let failure = fails.length == PrevProduct.length
        let success = fails.length == 0
        return { status: failure ? 400 : 200, message: failure ? "Nothing was updated" : success ? "Success, all data were updated successfully" : "Partial Success", data: { fails, successes } }
        // return { data: products, message: products.length > 0 ? "retrieval Success" : "not products found", status: products.length > 0 ? 200 : 404 }
    }
    return { message: "Machine not matched with Update details", status: 400 }
}

let update = (products, fails, successes) => {
    return new Promise(async function (resolve, reject) {
        Promise.all(
            products.map(async element => {
                return new Promise(async function (resolve, reject) {
                    let fail, success;
                    let { Capacity, Model, Price, Unit, _id, ProductID, Status } = element
                    let updateProduct = await updateFunc({ Capacity, Model, Price, _id, ProductID, Status })
                    if (!updateProduct.data) {
                        fails.push(ProductID);
                    } else {
                        successes.push(ProductID)
                    }
                    resolve({ fail, success })
                })
            })
        ).then((data) => {
            resolve(data)
        })
    })
}

let addTheseProduct = async (products) => {
    let e
    e = products.map(element => {
        // let { Capacity, Model, Price, ProductID, Status, cropId, machineId } = element
        if (!element.Capacity || element.Capacity == undefined) return error("Capacity", "missing field")
        if (!element.Price || element.Price == undefined) return error("Price", "missing field")
        if (!element.ProductID || element.ProductID == undefined) return error("ProductID", "missing field")
        if (!element.Status || element.Status == undefined) return error("Status", "missing field")
        if (!element.cropId || element.cropId == undefined) return error("cropId", "missing field")
        if (!element.machineId || element.machineId == undefined) return error("machineId", "missing field")
        return e = "continue"
    });
    if(e != "continue") return e[0]
    console.log("element,element.cropId == undefined")
    return { data: await product.insertMany(products), message: "created products Successfully", status: 201 }
}

exports.findOneByProductId = async (ProductId) => {
    return await product.findOne({ ProductID: ProductId })
}

exports.getAllProducts = async () => {
    return await product.find()
}

exports.deleteOnly = async (id) => {
    try {
        let deleted = await product.deleteOne({ _id: id })
        return { data: deleted.deletedCount > 0, message: deleted.deletedCount > 0 ? "deletion success" : "deletion failed", status: deleted.deletedCount > 0 ? 200 : 400 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "deletion failed", status: 400 }
    }
}

exports.updateProductById = async ({ Capacity, Model, Price, _id }, Status) => {
    let query = { Capacity, Model, Price }
    if (Status) query = { Capacity, Model, Price, Status }
    let updateThisProductDetail = await product.updateOne({ _id }, { $set: query })
    return { data: updateThisProductDetail.nModified > 0, message: updateThisProductDetail.nModified > 0 ? "updated Successfully" : "update Failed", status: updateThisProductDetail.nModified > 0 ? 200 : 400 }
}

let updateFunc = async ({ Capacity, Model, Price, _id, Status }) => {
    let updateThisProductDetail = await product.updateOne({ _id }, { $set: { Capacity, Model, Price, Status } })
    return { data: updateThisProductDetail.nModified > 0, message: updateThisProductDetail.nModified > 0 ? "updated Successfully" : "update Failed", status: updateThisProductDetail.nModified > 0 ? 200 : 400 }
}