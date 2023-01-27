const Estimate = require("../Model/Estimate")
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
    res.status(createdEstimate.status).send({ data: createdEstimate.data, error: createdEstimate.error, Message: createdEstimate.message, status: createdEstimate.status })
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

exports.getEstimatesByAgentId = async (req, res) => {
    let id = req.query.id
    let AllEstimates = await EstimateS.getAllEstimates(id, "agent")
    if (AllEstimates.status == 200) {
        res.status(AllEstimates.status).send({ data: AllEstimates.data, Message: AllEstimates.message, status: AllEstimates.status })
    } else {
        res.status(AllEstimates.status).send({ error: AllEstimates.error, Message: AllEstimates.message, status: AllEstimates.status })
    }
}

exports.updateEstimateToQuotation = async (req, res) => {
    let id = req.query.id
    let Estimate = await EstimateS.updateEstimateToQuotation(id)
    if (Estimate.status == 200) {
        res.status(Estimate.status).send({ data: Estimate.data, Message: Estimate.message, status: Estimate.status })
    } else {
        res.status(Estimate.status).send({ error: Estimate.error, Message: Estimate.message, status: Estimate.status })
    }
}

exports.updateQuotationToPO = async (req, res) => {
    let id = req.query.id
    let Quotation = await EstimateS.updateQuotationToPO(id)
    if (Quotation.status == 200) {
        res.status(Quotation.status).send({ data: Quotation.data, Message: Quotation.message, status: Quotation.status })
    } else {
        res.status(Quotation.status).send({ error: Quotation.error, Message: Quotation.message, status: Quotation.status })
    }
}

exports.updateQuotationToPI = async (req, res) => {
    let id = req.query.id
    let Estimate = await EstimateS.updateEstimateToQuotation(id)
    if (Estimate.status == 200) {
        res.status(Estimate.status).send({ data: Estimate.data, Message: Estimate.message, status: Estimate.status })
    } else {
        res.status(Estimate.status).send({ error: Estimate.error, Message: Estimate.message, status: Estimate.status })
    }
}

exports.updateQuotationToPI = async (req, res) => {
    let id = req.query.id
    let Estimate = await EstimateS.updateEstimateToQuotation(id)
    if (Estimate.status == 200) {
        res.status(Estimate.status).send({ data: Estimate.data, Message: Estimate.message, status: Estimate.status })
    } else {
        res.status(Estimate.status).send({ error: Estimate.error, Message: Estimate.message, status: Estimate.status })
    }
}

exports.getReportsFromEstimates = async (req, res) => {
    try {
        let foundEstimates = await Estimate.find()
        let Report = [{
            ProductID: "",
            Estimate: 0,
            Quotation: 0,
            PurchaseOrder: 0,
            ProductOrderPrice: 0
        }]
        foundEstimates.map((estimate,index) => {
            estimate.Products.map((product) => {
                let report = {
                    Estimate: 0,
                    Quotation: 0,
                    PurchaseOrder: 0
                }
                if (Report.length == 1 && Report[0].ProductID == "") {
                    Report[0].ProductID = product.ProductIDToShow
                    if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == false) Report[0].Estimate += 1
                    if (estimate.approvalFromAdminAsQuotes == true && estimate.approvalFromAdminAsPO == false) Report[0].Quotation += 1
                    if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == true) {
                        Report[0].PurchaseOrder += 1
                        Report[0].ProductOrderPrice += parseInt(product.ProductEstimatedPrice) ? product.ProductEstimatedPrice : 0
                    }
                } else {
                    let m
                    console.log("index",index,Report)
                    let foundreport = Report.find((report, i) => {
                        if (report.ProductID == product.ProductIDToShow) {
                            m = i
                            return report
                        }
                    });
                    let NewReport = Report.filter((report)=>{
                        return report.ProductID != product.ProductIDToShow
                    })
                    if (foundreport) {
                        if(foundreport.ProductOrderPrice == undefined) foundreport.ProductOrderPrice =0
                        foundreport.ProductID = product.ProductIDToShow
                        if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == false) foundreport.Estimate += 1
                        if (estimate.approvalFromAdminAsQuotes == true && estimate.approvalFromAdminAsPO == false) foundreport.Quotation += 1
                        if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == true) {
                            foundreport.PurchaseOrder += 1
                            foundreport.ProductOrderPrice += product.ProductEstimatedPrice ? product.ProductEstimatedPrice : 0
                        }
                        Report.push(foundreport)
                        NewReport.push(foundreport)
                        Report = NewReport
                    } else {
                        report.ProductID = product.ProductIDToShow
                        if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == false) report.Estimate += 1
                        if (estimate.approvalFromAdminAsQuotes == true && estimate.approvalFromAdminAsPO == false) report.Quotation += 1
                        if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == true) {
                            report.PurchaseOrder += 1
                            report.ProductOrderPrice += product.ProductEstimatedPrice ? product.ProductEstimatedPrice : 0
                        }
                        Report.push(report)
                    }
                }
            })
        })
        return res.status(200).send({
            data: Report,
            message: "reports made",
            status: 200,
        });
    } catch (e) {
        console.log(e);
        return { error: e, message: "we have an error", status: 400 };
    }
}