const router = require("express").Router()

const dashboardC = require("../Controller/dashboardC")
router.get("/getRecentEstimates", dashboardC.getRecentEstimates)
router.get("/getRecentQuotes", dashboardC.getRecentQuotation)
router.get("/getRecentPO", dashboardC.getRecentPO)
router.get("/getTotalCount", dashboardC.getTotalCount)
router.get("/getAgentsWithMostPurchase", dashboardC.getAgentWithMostPurchase)

router.get("/getRecentEstimatesOfSingleAgent", dashboardC.getRecentEstimatesSingleAgent)
router.get("/getRecentQuotesOfSingleAgent", dashboardC.getRecentQuotationOfSingleAgent)
router.get("/getRecentPOOfSingleAgent", dashboardC.getRecentPOOfSingleAgent)
router.get("/totalCountOfAgent", dashboardC.getTotalCountAgent)
module.exports = router;