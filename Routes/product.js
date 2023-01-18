const router = require("express").Router()
const express = require('express');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})
var uploads = multer({ storage: storage })

const productC = require("../Controller/productC")

router.post("/createProduct", productC.productCreate);
router.get("/getAllUnit", productC.getAllProductUnits);
router.get("/getAllCrops", productC.getAllCrops)
router.get("/getAllMachines", productC.getAllMachines)
router.get("/getFullDetailOfOneProduct", productC.getFullDetailOfOneProduct)
router.get("/generateCsvOfOneMachine", productC.generateCsvOfOneMachine)
router.post("/updateForOneMachineFromCsvFile", uploads.single("File"), productC.updateForOneMachineFromCsvFile)

module.exports = router;