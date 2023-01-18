const ProductS = require("../Service/productS");
const UnitS = require("../Service/UnitS")
const CropS = require('../Service/CropS')
const MachineS = require('../Service/MachineS')

exports.productCreate = async (req, res) => {
    let { crop, products, Unit } = req.body
    let UnitId = await manageUnit(Unit)
    const createTheProduct = await ProductS.create({ crop, products, UnitId })
    console.log(createTheProduct)
    res.status(createTheProduct.status).send({ Agent_ID: createTheProduct.Agent_ID, Message: createTheProduct.message, status: createTheProduct.status })
}

async function manageUnit(Unit) {
    let theUnit = Unit[0]
    let foundId = (await UnitS.findUnit(theUnit.Unit, theUnit.field)).toString()
    if (!foundId) {
        return (await UnitS.create(theUnit.Unit, theUnit.field)).toString()
    } else {
        return foundId
    }
}

exports.getAllProductUnits = async (req, res) => {
    res.status(200).send({ data: await UnitS.getAll(), Message: "All Units", status: 200 })
}

exports.getAllCrops = async (req, res) => {
    res.status(200).send({ data: (await CropS.getAllCrops()).data, Message: "All Crops", status: 200 })
}

exports.getAllMachines = async (req, res) => {
    res.status(200).send({ data: (await MachineS.getAllCMachines()).data, Message: "All Machines", status: 200 })
}

exports.getFullDetailOfOneProduct = async (req, res) => {
    let idOfProduct = req.query.id
    console.log(idOfProduct)
    let { Capacity, Model, Price, Status, UnitId, ProductID, cropId, machineId, createdAt } = await ProductS.findOneById(idOfProduct)
    // let {Capacity, Model, Price, Status, UnitId, ProductID, cropId, machineId, createdAt} = data
    // console.log(data)
    let { data: { crop } } = await CropS.findCropById(cropId)
    let { data: { Machine_name, Product_name } } = await MachineS.findMachineById(machineId)
    let { field, Unit } = await UnitS.findUnitById(UnitId)
    let DetailedProduct = { Capacity, Model, Price, Status, ProductID, createdAt, Unit: { field, Unit }, Machine_name, Product_name, crop }
    // let {data2} = await MachineS.findCrop(machineId)
    res.status(200).send({ data: DetailedProduct, Message: "get Full Detail View Of Product", status: 200 })
}