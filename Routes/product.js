const router = require("express").Router()
const express = require('express');
const multer = require('multer');
const csvtojson = require('csvtojson')

const upload = multer({ dest: "./csv_files" });
// const upload = multer({ storage: multer.memoryStorage() })

const productC = require("../Controller/productC");
const { updateProductById } = require("../Service/productS");

router.post("/createProduct", productC.productCreate);
router.post("/createCrop", productC.cropCreate);
router.get("/getAllProducts", productC.getAllProducts);
router.post("/machineCreate", productC.machineCreate);
router.get("/machinesForASelectCrop", productC.machinesForASelectCrop);
router.get("/getAllProductsForSelectCrop", productC.getAllProductsForSelectCropId)
router.get("/getAllProductsForSelectCropName", productC.getAllProductsForSelectCropName)
router.get("/productDetailForASelectMachine", productC.productDetailForASelectMachine);
router.put("/productUpdateForASelectMachine", productC.productUpdateForASelectMachine);
router.get("/getAllUnit", productC.getAllProductUnits);
router.get("/getAllCrops", productC.getAllCrops);
router.get("/getAllMachines", productC.getAllMachines);
router.get("/getFullDetailOfOneProduct", productC.getFullDetailOfOneProduct);
router.get("/generateCsvOfOneMachine", productC.generateCsvOfOneMachine);
router.put("/updateOneProduct", productC.updateOneProduct)
router.patch("/findCropByIdAndUpdate", productC.findCropByIdAndUpdate)
router.delete("/deleteOneProduct", productC.deleteOneProduct)
router.delete("/deleteOneMachine", productC.deleteOneMachine)
router.put("/bulkProductPriceUpdateOfOneMachine", upload.single("file"), async (req, res) => {
    let file = req.file;
    let products = await csvtojson().fromFile(file.path);
    var fails = []
    var successes = []
    let data = await update(products, fails, successes)
    let failure = fails.length == products.length
    let success = fails.length == 0
    return res.send({ status: failure ? 400 : 200, message: failure ? "Nothing was updated" : success ? "Success, all data were updated successfully" : "Partial Success", data: { fails, successes } });
});
router.get("/generateListOfCropsMachines", productC.generateListOfCropsMachines);

let update = (products, fails, successes) => {
    return new Promise(async function (resolve, reject) {
        Promise.all(
            products.map(async element => {
                return new Promise(async function (resolve, reject) {
                    let fail, success;
                    let { Capacity, Model, Price, Unit, _id, ProductID } = element
                    let updateProduct = await updateProductById({ Capacity, Model, Price, _id, ProductID }, Unit)
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

module.exports = router;