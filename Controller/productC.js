const ProductS = require("../Service/productS");
const UnitS = require("../Service/UnitS")

exports.productCreate = async (req, res) => {
    let { crop, products, Unit } = req.body
    const createTheProduct = await ProductS.create({ crop, products })
    console.log(createTheProduct)
    res.status(createTheProduct.status).send({ Agent_ID: createTheProduct.Agent_ID, Message: createTheProduct.message, status: createTheProduct.status })
}

exports.variantCreate = async (req, res) => {
    let { Capacity, Model, Price, Unit, id } = req.body
    const foundProduct = await ProductS.findOneById(id)
    console.log("foundProduct", foundProduct)
    let UnitId = await manageUnit(Unit)
    const createTheProduct = await ProductS.createVariant(foundProduct, { Capacity, Model, Price, UnitId })
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