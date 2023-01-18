const router = require("express").Router()
const express = require('express');
const multer = require('multer');

const app = express()

const upload = multer({
    dest: 'uploads/'
});

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, file)
//     },
//     filename: (req, file, cb) => {
//         console.log(file)
//         cb(null, file.originalname)
//     },
// })

// var uploads = multer({ storage: storage })

const productC = require("../Controller/productC")

router.post("/createProduct", productC.productCreate);
router.get("/getAllUnit", productC.getAllProductUnits);
router.get("/getAllCrops", productC.getAllCrops)
router.get("/getAllMachines", productC.getAllMachines)
router.get("/getFullDetailOfOneProduct", productC.getFullDetailOfOneProduct)
router.get("/generateCsvOfOneMachine", productC.generateCsvOfOneMachine)
router.post("/updateForOneMachineFromCsvFile", upload.single("File"), productC.updateForOneMachineFromCsvFile)

module.exports = router;