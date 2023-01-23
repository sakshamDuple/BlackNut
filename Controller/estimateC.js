const EstimateS = require("../Service/estimateS")

exports.getAll = async (req, res) => {
    let AllEstimates = await EstimateS.getAllEstimates()
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