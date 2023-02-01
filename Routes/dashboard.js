const router = require("express").Router()

const dashboardC = require("../Controller/dashboardC")
router.get("/getRecentEstimates",dashboardC.getRecentEstimates )
router.get("/getRecentQuotes",dashboardC.getRecentQuotation)
router.get("/getRecentPO",dashboardC.getRecentPO)
router.get("/getTotalCount",dashboardC.getTotalCount)
router.get("/getAgentsWithMostPurchase",dashboardC.getAgentWithMostPurchase)
module.exports = router; 