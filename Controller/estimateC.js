const EstimateS = require("../Service/estimateS")

exports.getAll = async (req, res) => {
    let AllEstimates = await EstimateS.getAllEstimates()
    if (AllEstimates.status == 200) {
        res.status(AllEstimates.status).send({ data: AllEstimates.data, Message: AllEstimates.message, status: AllEstimates.status })
    } else {
        res.status(AllEstimates.status).send({ error: AllEstimates.error, Message: AllEstimates.message, status: AllEstimates.status })
    }
}

exports.getAllQuotation = async (req, res) => {
    let AllEstimates = await EstimateS.getAllQuotation()
    if (AllEstimates.status == 200) {
        res.status(AllEstimates.status).send({ data: AllEstimates.data, Message: AllEstimates.message, status: AllEstimates.status })
    } else {
        res.status(AllEstimates.status).send({ error: AllEstimates.error, Message: AllEstimates.message, status: AllEstimates.status })
    }
}

exports.getQuotationById = async (req, res) => {
    let AllEstimates = await EstimateS.getQuotationById(req.query.id)
    if (AllEstimates.status == 200) {
        res.status(AllEstimates.status).send({ data: AllEstimates.data, Message: AllEstimates.message, status: AllEstimates.status })
    } else {
        res.status(AllEstimates.status).send({ error: AllEstimates.error, Message: AllEstimates.message, status: AllEstimates.status })
    }
}

exports.getByAgentId = async (req, res) => {
    let AllEstimates = await EstimateS.getByAgentId(req.query.id)
    if (AllEstimates.status == 200) {
        res.status(AllEstimates.status).send({ data: AllEstimates.data, Message: AllEstimates.message, status: AllEstimates.status })
    } else {
        res.status(AllEstimates.status).send({ error: AllEstimates.error, Message: AllEstimates.message, status: AllEstimates.status })
    }
}

exports.create = async (req, res) => {
    let estimate = req.body
    let createdEstimate = await EstimateS.create(estimate)
    res.status(createdEstimate.status).send({ data: createdEstimate.data, error:createdEstimate.error, Message: createdEstimate.message, status: createdEstimate.status })
}

exports.getById = async (req, res) => {
    let id = req.query.id
    let Estimate = await EstimateS.getEstimateById(id)
    if (Estimate.status == 200) {
        res.status(Estimate.status).send({ data: Estimate.data, Message: Estimate.message, status: Estimate.status })
    } else {
        res.status(Estimate.status).send({ error: Estimate.error, Message: Estimate.message, status: Estimate.status })
    }
}

exports.getDetailedEstimateById = async (req, res) => {
    let id = req.query.id
    let Estimate = await EstimateS.getDetailEstimateById(id)
    if (Estimate.status == 200) {
        res.status(Estimate.status).send({ data: Estimate.data, Message: Estimate.message, status: Estimate.status })
    } else {
        res.status(Estimate.status).send({ error: Estimate.error, Message: Estimate.message, status: Estimate.status })
    }
}

exports.updateEstimateToQuotation = async (req,res) => {
    let id = req.query.id
    let Estimate = await EstimateS.updateEstimateToQuotation(id)
    if (Estimate.status == 200) {
        res.status(Estimate.status).send({ data: Estimate.data, Message: Estimate.message, status: Estimate.status })
    } else {
        res.status(Estimate.status).send({ error: Estimate.error, Message: Estimate.message, status: Estimate.status })
    }
}

exports.updateQuotationToPI = async (req,res) => {
    let id = req.query.id
    let Estimate = await EstimateS.updateEstimateToQuotation(id)
    if (Estimate.status == 200) {
        res.status(Estimate.status).send({ data: Estimate.data, Message: Estimate.message, status: Estimate.status })
    } else {
        res.status(Estimate.status).send({ error: Estimate.error, Message: Estimate.message, status: Estimate.status })
    }
}