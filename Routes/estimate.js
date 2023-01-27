const router = require("express").Router()

const estimateC = require("../Controller/estimateC")

router.get("/", estimateC.getAll);
router.post("/create", estimateC.create);
router.post("/getById", estimateC.getById)
router.get("/getDetailedEstimateById", estimateC.getDetailedEstimateById)
router.get("/getEstimatesByAgentId", estimateC.getEstimatesByAgentId)
router.put("/updateEstimateToQuotation",estimateC.updateEstimateToQuotation)

module.exports = router;