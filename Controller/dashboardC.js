const Estimate = require("../Model/Estimate")
const dashboardS = require("../Service/dashboardS")



exports.getRecentEstimates = async (req, res) => {
    let RecentEstimates = await dashboardS.getRecentEstimates()
    if (RecentEstimates.status == 200) {
        res.status(RecentEstimates.status).send({ data: RecentEstimates.data, message: RecentEstimates.message, status: RecentEstimates.status })
    } else {
        res.status(RecentEstimates.status).send({ error: RecentEstimates.error, message: RecentEstimates.message, status: RecentEstimates.status })
    }
}

exports.getRecentQuotation = async (req, res) => {
    let AllEstimates = await dashboardS.getRecentQuotation()
    if (AllEstimates.status == 200) {
        res.status(AllEstimates.status).send({ data: AllEstimates.data, message: AllEstimates.message, status: AllEstimates.status })
    } else {
        res.status(AllEstimates.status).send({ error: AllEstimates.error, message: AllEstimates.message, status: AllEstimates.status })
    }
}
exports.getRecentPO = async (req, res) => {

    let AllEstimates = await dashboardS.getAllRecentPO()
    if (AllEstimates.status == 200) {
        res.status(AllEstimates.status).send({ data: AllEstimates.data, message: AllEstimates.message, status: AllEstimates.status })
    } else {
        res.status(AllEstimates.status).send({ error: AllEstimates.error, message: AllEstimates.message, status: AllEstimates.status })
    }
}

exports.getTotalCount = async (req, res) => {
    let details = []
    let EstimateCount = await dashboardS.getEstimateCount()
    
        details.push({ Name: "Estimates", count: EstimateCount })
 

    let QuoteCount = await dashboardS.getQuoteCount()

        details.push({ Name: "Quotations", count: QuoteCount })
  


    let PoCount = await dashboardS.getPoCount()
  
        details.push({ Name: "Purchase Orders", count: PoCount })
  
    console.log(details, "eee")

    res.send(details)
}



exports.getAgentWithMostPurchase = async (req, res) => {
    let Agents = await dashboardS.AgentWithMostPurchase()
    console.log(Agents, "aaaay");

    let AgentsQuotations = await dashboardS.AgentQuotations()
    console.log(AgentsQuotations, "aggentQ");


    const AllEst = await dashboardS.findAllEst()
    console.log(AllEst, "All");
    function performIntersection(arr1, arr2) {

        const intersectionResult = arr1.filter(x => arr2.indexOf(x) !== -1);

        return intersectionResult;

    }
    const result = performIntersection(AllEst, Agents);
    console.log(result, "rr");
    res.send(Agents)
}
exports.getRecentEstimatesSingleAgent = async (req, res) => {
    let id = req.query.id
    let AllRecentEstimates = await dashboardS.getRecentEstimatesOfAgent(id)
    if (AllRecentEstimates) {
        res.send(AllRecentEstimates)
    }

}
exports.getRecentQuotationOfSingleAgent = async (req,res) => {
    let id = req.query.id
    let AllRecentQuotations = await dashboardS.getRecentQuotationOfAgent(id)
    if (AllRecentQuotations) {
        res.send(AllRecentQuotations)
    }
}
exports.getRecentPOOfSingleAgent = async (req,res) => {
    let id = req.query.id
    let AllRecentPO = await dashboardS.getRecentPOAgent(id)
    if (AllRecentPO) {
        res.send(AllRecentPO)
    }
}
exports.getTotalCountAgent=async(req,res)=>{
    let id = req.query.id
    let details = []
    let EstimateCount = await dashboardS.getEstimateCountOfAgent(id)
    let EstimatePrice = await dashboardS.getTotalEstimateForAgent(id)
        details.push({ Name: "Estimates", count: EstimateCount, price: EstimatePrice })
    let QuoteCount = await dashboardS.getQuoteCountOfAgent(id)
    let QuotePrice = await dashboardS.getTotalQuotationForAgent(id)
        details.push({ Name: "Quotations", count: QuoteCount, price: QuotePrice })
    let PoCount = await dashboardS.getPoCountOfAgent(id)
    let PoPrice = await dashboardS.getTotalPOForAgent(id)
        details.push({ Name: "Purchase Orders", count: PoCount, price: PoPrice })
    res.send(details)
}