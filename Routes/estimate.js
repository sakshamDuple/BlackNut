const router = require("express").Router()

const estimateC = require("../Controller/estimateC")

router.get("/", estimateC.getAll);
router.post("/create", estimateC.create);
router.post("/getById", estimateC.getById)
router.get("/getDetailedEstimateById", estimateC.getDetailedEstimateById)
router.get("/getEstimatesByAgentId", estimateC.getEstimatesByAgentId)
router.get("/getProductReport", estimateC.getReportsFromEstimates)
router.get("/getAgentReport", estimateC.getAgentReportsFromEstimates)
router.put("/updateEstimateToQuotation",estimateC.updateEstimateToQuotation)
router.get("/otpRecieve", estimateC.customerOtpRecieve);
router.get("/quotationPdf", estimateC.getPdfById)

module.exports = router;