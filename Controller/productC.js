const ProductS = require("../Service/productS");
const UnitS = require("../Service/UnitS");
const CropS = require("../Service/CropS");
const MachineS = require("../Service/MachineS");
const product = require("../Model/Product");
var csv = require("csv-express");
// const csv = require('csvtojson')

exports.productCreate = async (req, res) => {
  let { crop, products, Unit } = req.body;
  let UnitId;
  if (Unit) UnitId = await manageUnit(Unit);
  const createTheProduct = await ProductS.create({ crop, products, UnitId });
  console.log(createTheProduct);
  res.status(createTheProduct.status).send({
    data: createTheProduct.data,
    message: createTheProduct.message,
    status: createTheProduct.status,
  });
};

async function manageUnit(Unit) {
  let theUnit = Unit[0];
  let foundId = await UnitS.findUnit(theUnit.Unit, theUnit.field);
  if (foundId) foundId = foundId.toString();
  if (!foundId) {
    return (
      await UnitS.create({ unitName: theUnit.Unit, field: theUnit.field })
    ).toString();
  } else {
    return foundId;
  }
}

exports.getAllProductUnits = async (req, res) => {
  res
    .status(200)
    .send({ data: await UnitS.getAll(), message: "All Units", status: 200 });
};

exports.getAllCrops = async (req, res) => {
  res.status(200).send({
    data: (await CropS.getAllCrops()).data,
    message: "All Crops",
    status: 200,
  });
};

exports.getAllMachines = async (req, res) => {
  let all_machine = await MachineS.getAllMachines()
  res.status(all_machine.status).send(all_machine);
};
exports.getAllMachinesAlphabets = async (req, res) => {
  let number = req.query.number;
  let all_machine = await MachineS.getAllMachinesAlphabers(number)
  res.status(all_machine.status).send(all_machine);
};

exports.getAllProducts = async (req, res) => {
  res.status(200).send({
    data: await ProductS.getAllProducts(),
    message: "All Products",
    status: 200,
  });
};

exports.getAllProductsForSelectCropId = async (req, res) => {
  let products = await ProductS.findByCropId(req.query.id)
  res.status(200).send({
    data: products,
    message: products.length > 0 ? "All Products For Select Crop" : "no products for this crop",
    status: products.length > 0 ? 200 : 404,
  });
};

exports.getAllProductsForSelectCropName = async (req, res) => {
  let products = await ProductS.findByCropName(req.query.name)
  res.status(200).send({
    data: products,
    message: products.length > 0 ? "All Products For Select Crop" : "no products for this crop",
    status: products.length > 0 ? 200 : 404,
  });
};

exports.getFullDetailOfOneProduct = async (req, res) => {
  let idOfProduct = req.query.id;
  console.log(idOfProduct);
  let {
    Capacity,
    Model,
    Price,
    Status,
    UnitId,
    ProductID,
    cropId,
    machineId,
    createdAt,
  } = await ProductS.findOneById(idOfProduct);
  // let {Capacity, Model, Price, Status, UnitId, ProductID, cropId, machineId, createdAt} = data
  // console.log(data)
  let {
    data: { crop },
  } = await CropS.findCropById(cropId);
  let {
    data: { Machine_name, Product_name },
  } = await MachineS.findMachineById(machineId);
  // let { field, Unit } = await UnitS.findUnitById(UnitId);
  let DetailedProduct = {
    Capacity,
    Model,
    Price,
    Status,
    ProductID,
    createdAt,
    Machine_name,
    Product_name,
    crop,
  };
  // let {data2} = await MachineS.findCrop(machineId)
  res.status(200).send({
    data: DetailedProduct,
    message: "get Full Detail View Of Product",
    status: 200,
  });
};

exports.toGetAllDetailsOfProduct = async (id) => {
  let idOfProduct = id;
  let {
    Capacity,
    Model,
    Price,
    Status,
    ProductID,
    cropId,
    machineId,
    createdAt,
    Gst
  } = await ProductS.findOneById(idOfProduct);
  let {
    data: { crop },
  } = await CropS.findCropById(cropId);
  let {
    data: { Machine_name, Product_name },
  } = await MachineS.findMachineById(machineId);
  // let { field, Unit } = await UnitS.findUnitById(UnitId);
  let DetailedProduct = {
    Capacity,
    Model,
    Price,
    Status,
    ProductID,
    createdAt,
    Machine_name,
    Product_name,
    crop,
    Gst
  };
  return DetailedProduct
}

// exports.getFullDetailOfTheseProducts = async (products) => {
//   products
// }

exports.cropCreate = async (req, res) => {
  let crop = req.body.crop;
  let createdCrop = await CropS.create(crop);
  res.status(createdCrop.status).json(createdCrop);
};

exports.machineCreate = async (req, res) => {
  let Machine_name = req.body.Machine_name;
  let Product_name = req.body.Product_name;
  let cropId = req.body.cropId;
  let createdCrop = await MachineS.create({
    Machine_name,
    Product_name,
    cropId,
  });
  res.status(createdCrop.status).json(createdCrop);
};

exports.machinesForASelectCrop = async (req, res) => {
  let cropId = req.query.cropId;
  let machines = await MachineS.findMachineByCropId(cropId);
  res.status(machines.status).json(machines);
};

exports.productDetailForASelectMachine = async (req, res) => {
  let machineId = req.query.machineId;
  let products = await ProductS.findProductsForMachineId(machineId);
  res.status(products.status).json(products);
};

exports.productUpdateForASelectMachine = async (req, res) => {
  let updateProductsList = req.body
  let machineId = req.query.machineId;
  let products = await ProductS.findProductsForMachineId(machineId);
  if (!products.data) return res.status(products.status).json(products);
  let updateProcess = await ProductS.updateTheProductByMachine(machineId, products.data, updateProductsList)
  res.status(updateProcess.status).json(updateProcess);
};

exports.generateCsvOfAll = async (req, res) => {
  var filename = "products.csv";
  let id = req.query.id;
  let agg = [
    // {
    //   $match: {
    //     machineId: id,
    //   },
    // },
    {
      '$lookup': {
        'from': 'crops',
        'let': {
          'cropId': {
            '$toObjectId': '$cropId'
          }
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$eq': [
                  '$_id', '$$cropId'
                ]
              }
            }
          }, {
            '$project': {
              '_id': 0,
              'crop': 1
            }
          }
        ],
        'as': 'result1'
      }
    }, {
      '$lookup': {
        'from': 'machines',
        'let': {
          'machineId': {
            '$toObjectId': '$machineId'
          }
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$eq': [
                  '$_id', '$$machineId'
                ]
              }
            }
          }, {
            '$project': {
              '_id': 0,
              'Product_name': 1,
              'Machine_name': 1
            }
          }
        ],
        'as': 'result2'
      }
    },
    {
      $project: {
        Model: 1,
        Price: 1,
        ProductID: 1,
        // createdAt: 1,
        Capacity: 1,
        // updateAt: 1,
        crop: { $arrayElemAt: ["$result1.crop", 0] },
        Product_name: { '$arrayElemAt': ["$result2.Product_name", 0] },
        Machine_name: { '$arrayElemAt': ["$result2.Machine_name", 0] },
      },
    },
  ];
  let productRes = await product.aggregate(agg);
  //   let productRes = await product.find({machineId: id});
  console.log(productRes);
  // let productC = []
  //   productRes.map((element) => {
  //     element.Unit = element.result[0].Unit;
  //     delete element.result;
  //   });
  console.log(productRes);
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=" + filename);
  res.csv(productRes, true);
};

exports.generateCsvOfOneMachine = async (req, res) => {
  var filename = "products.csv";
  let id = req.query.id;
  let agg = [
    // {
    //   $match: {
    //     machineId: id,
    //   },
    // },
    {
      '$lookup': {
        'from': 'crops',
        'let': {
          'cropId': {
            '$toObjectId': '$cropId'
          }
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$eq': [
                  '$_id', '$$cropId'
                ]
              }
            }
          }, {
            '$project': {
              '_id': 0,
              'crop': 1
            }
          }
        ],
        'as': 'result1'
      }
    }, {
      '$lookup': {
        'from': 'machines',
        'let': {
          'machineId': {
            '$toObjectId': '$machineId'
          }
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$eq': [
                  '$_id', '$$machineId'
                ]
              }
            }
          }, {
            '$project': {
              '_id': 0,
              'Product_name': 1,
              'Machine_name': 1
            }
          }
        ],
        'as': 'result2'
      }
    },
    {
      $project: {
        Model: 1,
        Price: 1,
        ProductID: 1,
        // createdAt: 1,
        Capacity: 1,
        // updateAt: 1,
        crop: { $arrayElemAt: ["$result1.crop", 0] },
        Product_name: { '$arrayElemAt': ["$result2.Product_name", 0] },
        Machine_name: { '$arrayElemAt': ["$result2.Machine_name", 0] },
      },
    },
  ];
  let productRes = await product.aggregate(agg);
  //   let productRes = await product.find({machineId: id});
  console.log(productRes);
  // let productC = []
  //   productRes.map((element) => {
  //     element.Unit = element.result[0].Unit;
  //     delete element.result;
  //   });
  console.log(productRes);
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=" + filename);
  res.csv(productRes, true);
};

exports.generateListOfCropsMachines = async (req, res) => {
  let machines = await MachineS.getAllMachines();
  let crops = await CropS.getAllCrops();
  let machineToShow = [];
  machines.data.map((machine) => {
    let crop = crops.data.find((crop) => machine.cropId == crop._id.toString());
    machine.crop = crop.crop;
    machineToShow.push({
      _id: machine._id,
      Machine_name: machine.Machine_name,
      Product_name: machine.Product_name,
      createdAt: machine.createdAt,
      crop: machine.crop,
    });
  });
  res.status(machines.status).json({
    data: machineToShow,
    status: 200,
    message: "retrieved successfully",
  });
};

exports.updateOneProduct = async (req, res) => {
  let { Capacity, Model, Price, _id, ProductID, Status } = req.body
  let updateProduct = await ProductS.updateProductById({ Capacity, Model, Price, _id, ProductID }, Status)
  res.status(updateProduct.status).send({ data: updateProduct.data, message: updateProduct.message, status: updateProduct.status })
}

exports.findCropByIdAndUpdate = async (req,res) => {
  let {cropName, id} = req.body
  let updateCrop = await CropS.findCropByIdAndUpdate(id, cropName)
  res.status(updateCrop.status).send(updateCrop)
}

exports.deleteOneProduct = async (req, res) => {
  let id = req.query.id
  let deleted = await ProductS.deleteOnly(id)
  res.status(deleted.status).send(deleted)
}

exports.deleteOneMachine = async (req, res) => {
  let id = req.query.id
  console.log(id)
  let deleted = { status: 400, message: "nothing was deleted" }
  let productsInThisMachine = await ProductS.findProductsForMachineId(id)
  let idsToDelete = []
  if (productsInThisMachine.data == null) return res.status(productsInThisMachine.status).send(productsInThisMachine)
  productsInThisMachine.data.forEach(element => {
    idsToDelete.push(element._id)
  });
  let deletedProducts = await ProductS.deleteMutliProducts(idsToDelete)
  if (deletedProducts.status == 200) { deleted = await MachineS.deleteThisMachine(id) }
  res.status(deleted.status).send(deleted)
}