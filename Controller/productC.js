const ProductS = require("../Service/productS");
const UnitS = require("../Service/UnitS")
const CropS = require('../Service/CropS')
const MachineS = require('../Service/MachineS')
const product = require("../Model/Product");
// var csv = require('csv-express');
const csv = require('csvtojson')
let file = "./matinetNew.csv"

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

exports.generateCsvOfOneMachine = async (req, res) => {
    var filename = "products.csv";
    let id = req.query.id
    let agg = [
        {
            '$match': {
                'machineId': id
            }
        }, {
            '$addFields': {
                'newUnitId': {
                    '$toObjectId': '$UnitId'
                }
            }
        }, {
            '$lookup': {
                'from': 'unitmanages',
                'localField': 'newUnitId',
                'foreignField': '_id',
                'as': 'result'
            }
        }, {
            '$project': {
                'Model': 1,
                'Price': 1,
                'ProductID': 1,
                'createdAt': 1,
                'result.Unit': 1,
                'Capacity': 1
            }
        }
    ]
    let productRes = await product.aggregate(agg)
    // let productC = []
    productRes.map(element => {
        element.Unit = element.result[0].Unit
        delete element.result
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader("Content-Disposition", 'attachment; filename=' + filename);
    res.csv(productRes, true);
}

exports.updateForOneMachineFromCsvFile = async (req, res) => {
    try {
        console.log(req.file)
        // csv().fr
        csv().fromFile(req.file).then(async (jsonObj) => {
            console.log(jsonObj)
            let data = [];
            for (let i = 0; i < 2; i++) {
                if (jsonObj[i].field8) {
                    let ProductDetail = await ProductS.findOneByProductId(jsonObj[i].ProductID);
                    console.log(ProductDetail)
                    data.push(ProductDetail)
                    // if (!user) {
                    //     let element = jsonObj[i].field8.replace(/ /g, "?");
                    //     var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
                    //     var regex = new RegExp(expression);
                    //     var t = element;
                    //     if (element && t.match(regex)) {
                    //         let comanyData = { companyName: jsonObj[i].field7, email: jsonObj[i].field8, password: "12345678", companyType: "company", dateEstablished: 1664476200, location: "demo", bio: "demo", inviteCode: "ZJRA31", role: "C", userType: "web", isAutomatedUser: true }
                    //         console.log("comanyData :", comanyData);
                    //         await createCompany(comanyData)
                    //     }
                    // }
                }
            }
            // res.send(data)
        })
        res.send("nothing")
    } catch (e) {
        console.log(e)
        res.send(e)
    }
}