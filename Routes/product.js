const router = require("express").Router()

const productC = require("../Controller/productC")

router.post("/createProduct", productC.productCreate);
// router.post("/mProductVariantCreate", productC.variantCreate);
router.get("/getAllUnit", productC.getAllProductUnits);
router.get("/getAllCrops", productC.getAllCrops)
router.get("/getAllMachines", productC.getAllMachines)
router.get("/getFullDetailOfOneProduct", productC.getFullDetailOfOneProduct)

module.exports = router;