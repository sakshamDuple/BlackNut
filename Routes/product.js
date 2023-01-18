const router = require("express").Router()

const productC = require("../Controller/productC")

router.post("/createProduct", productC.productCreate);
router.post("/mProductVariantCreate", productC.variantCreate);
router.get("/getAllUnit", productC.getAllProductUnits);

module.exports = router;