const router = require("express").Router()

const estimateC = require("../Controller/estimateC")

router.get("/", estimateC.getAllQuotation);
router.get("/getOne", estimateC.getQuotationById);
router.get("/getByAgentId", estimateC.getByAgentId);

module.exports = router;