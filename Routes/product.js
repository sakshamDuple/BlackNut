const router = require("express").Router()
const express = require('express');
const multer = require('multer');
const csvtojson = require('csvtojson')

const upload = multer({ dest: "./csv_files" });
// const upload = multer({ storage: multer.memoryStorage() })

const productC = require("../Controller/productC")

router.post("/createProduct", productC.productCreate);
router.get("/getAllUnit", productC.getAllProductUnits);
router.get("/getAllCrops", productC.getAllCrops)
router.get("/getAllMachines", productC.getAllMachines)
router.get("/getFullDetailOfOneProduct", productC.getFullDetailOfOneProduct)
router.get("/generateCsvOfOneMachine", productC.generateCsvOfOneMachine)
router.get("/bulkProduct", upload.single("file"), async (req, res) => {
    let file = req.file;
    let products = await csvtojson().fromFile(file.path);
    console.log(products)
    return res.send({ statusCode: 200, message: "Success", data: { products } });
});

module.exports = router;