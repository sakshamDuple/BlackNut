const router = require("express").Router()

const estimateC = require("../Controller/estimateC")

router.get("/", estimateC.getAllQuotation);
router.get("/getOne", estimateC.getQuotationById);

module.exports = router;