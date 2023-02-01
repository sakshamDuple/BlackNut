const Estimate = require("../Model/Estimate")
const { getCommonById } = require("../Service/AgentS")
const EstimateS = require("../Service/estimateS")
const OtpS = require("../Service/OtpS")
const { findOnly } = require("../Service/verifyNumberS")
const { generateOtp } = require("../Middleware/genOtp")
const { sendEmail } = require("../Middleware/emailSend")

exports.getAll = async (req, res) => {
    let page = req.query.page
    let limit = req.query.limit
    let AllEstimates = await EstimateS.getAllEstimates("","",page,limit)
    if (AllEstimates.status == 200) {
        res.status(AllEstimates.status).send(AllEstimates)
    } else {
        res.status(AllEstimates.status).send({ error: AllEstimates.error, Message: AllEstimates.message, status: AllEstimates.status })
    }
}

exports.getAllQuotation = async (req, res) => {
    let page = req.query.page
    let limit = req.query.limit
    let agentId = req.query.agentId?req.query.agentId:""
    let AllEstimates = await EstimateS.getAllQuotation(agentId,agentId==""?"":"agent",page,limit)
    if (AllEstimates.status == 200) {
        res.status(AllEstimates.status).send(AllEstimates)
    } else {
        res.status(AllEstimates.status).send({ error: AllEstimates.error, Message: AllEstimates.message, status: AllEstimates.status })
    }
}

exports.getAllPO = async (req, res) => {
    let page = req.query.page
    let limit = req.query.limit
    let agentId = req.query.agentId?req.query.agentId:""
    let AllEstimates = await EstimateS.getAllPO(agentId,agentId==""?"":"agent",page,limit)
    if (AllEstimates.status == 200) {
        res.status(AllEstimates.status).send(AllEstimates)
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
        res.status(AllEstimates.status).send(AllEstimates)
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

exports.customerOtpRecieve = async (req, res) => {
    let phone = req.query.phone
    let Nphone = parseInt(phone)
    console.log(10000000000 > Nphone && Nphone >= 1000000000)
    if (10000000000 > Nphone && Nphone >= 1000000000) {
        let email = req.query.email
        let agentid = req.query.agentid
        if (!phone && !email && !agentid) return res.status(400).send({ Message: "fields missing", status: 400 })
        let foundAgent = await getCommonById(agentid)
        if (!foundAgent.data) return res.status(foundAgent.status).send({ Message: foundAgent.message, status: foundAgent.status })
        let mobileExists = await findOnly(phone)
        // if (mobileExists != null) return res.status(409).send({ Message: "requested phone is already registered", status: 409 })
        let otp = generateOtp()
        await OtpS.deleteOnly(foundAgent.data.phone)
        await OtpS.create({
            number: foundAgent.data.phone,
            id: agentid,
            otp: otp
        })
        if (mobileExists == null) return res.status(404).send({ message: "No such mobile found", status: 404 })
        await sendEmail(email, "OTP request for File Upload & Updation Of quotation To Purchase Order", otp, { Name: foundAgent.data.firstName })
        res.status(200).send({ message: `an otp is sent on customer mail, please verify otp to process to complete process file upload process, tempOtp:${otp}`, status: 200 })
    }
    res.status(400).send({ error: "Not a valid phone", message: "Please enter a valid phone number", status: 400 })
}

exports.updateQuotationToPO = async (req, res) => {
    let id = req.query.id
    let quotation = req.body.Quotation
    let approval = req.body.approval
    let data = req.body.data
    let Quotation = await EstimateS.updateQuotationToPO(id, quotation, approval, data)
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

exports.getReportsFromEstimates = async (req, res) => {
    try {
        let agentId = req.query.id
        let foundEstimates = await Estimate.find()
        let Report = [{
            ProductID: "",
            Estimate: 0,
            Quotation: 0,
            PurchaseOrder: 0,
            ProductOrderPrice: 0,
            ProductName: ""
        }]
        let getValueFlag = true
        getValueFlag = agentId ? false : true
        foundEstimates.map((estimate, index) => {
            if (estimate.agentId == agentId) {
                getValueFlag = true
            }
            getValueFlag && estimate.Products.map((product) => {
                let report = {
                    Estimate: 0,
                    Quotation: 0,
                    PurchaseOrder: 0
                }
                if (Report.length == 1 && Report[0].ProductID == "") {
                    Report[0].ProductID = product.ProductIDToShow
                    Report[0].ProductName = product.ProductName
                    if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == false) Report[0].Estimate += 1
                    if (estimate.approvalFromAdminAsQuotes == true && estimate.approvalFromAdminAsPO == false) {
                        Report[0].Quotation += 1
                        Report[0].Estimate += 1
                    }
                    if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == true) {
                        Report[0].PurchaseOrder += 1
                        Report[0].Quotation += 1
                        Report[0].Estimate += 1
                        Report[0].ProductOrderPrice += parseInt(product.ProductEstimatedPrice) ? product.ProductEstimatedPrice : 0
                    }
                } else {
                    let m
                    let foundreport = Report.find((report, i) => {
                        if (report.ProductID == product.ProductIDToShow) {
                            m = i
                            return report
                        }
                    });
                    let NewReport = Report.filter((report) => {
                        return report.ProductID != product.ProductIDToShow
                    })
                    if (foundreport) {
                        if (foundreport.ProductOrderPrice == undefined || foundreport.ProductOrderPrice == NaN) foundreport.ProductOrderPrice = 0
                        foundreport.ProductID = product.ProductIDToShow
                        foundreport.ProductName = estimate.ProductName
                        console.log(foundreport)
                        console.log(foundreport.ProductOrderPrice)
                        if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == false) foundreport.Estimate += 1
                        if (estimate.approvalFromAdminAsQuotes == true && estimate.approvalFromAdminAsPO == false) {
                            foundreport.Quotation += 1
                            foundreport.Estimate += 1
                        }
                        if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == true) {
                            foundreport.PurchaseOrder += 1
                            foundreport.Quotation += 1
                            foundreport.Estimate += 1
                            foundreport.ProductOrderPrice += product.ProductEstimatedPrice ? product.ProductEstimatedPrice : 0
                        }
                        NewReport.push(foundreport)
                        Report = NewReport
                    } else {
                        report.ProductID = product.ProductIDToShow
                        report.ProductName = estimate.ProductName
                        report.ProductOrderPrice = 0
                        if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == false) report.Estimate += 1
                        if (estimate.approvalFromAdminAsQuotes == true && estimate.approvalFromAdminAsPO == false) {
                            report.Quotation += 1
                            report.Estimate += 1
                        }
                        if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == true) {
                            report.PurchaseOrder += 1
                            report.Quotation += 1
                            report.Estimate += 1
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

exports.getAgentReportsFromEstimates = async (req, res) => {
    try {
        let foundEstimates = await Estimate.find()
        let Report = [{
            Agent_Code: "",
            Agent_Id: "",
            Agent_Name: "",
            Estimate: 0,
            Quotation: 0,
            PurchaseOrder: 0,
            ProductOrderPrice: 0
        }]
        foundEstimates.map((estimate) => {
            estimate.Products.map((product) => {
                let report = {
                    Estimate: 0,
                    Quotation: 0,
                    PurchaseOrder: 0
                }
                if (Report.length == 1 && Report[0].Agent_Code == "") {
                    Report[0].Agent_Id = estimate.agentId
                    Report[0].Agent_Name = estimate.Agent_Name
                    Report[0].Agent_Code = estimate.Agent_Code
                    if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == false) Report[0].Estimate += 1
                    if (estimate.approvalFromAdminAsQuotes == true && estimate.approvalFromAdminAsPO == false) {
                        Report[0].Quotation += 1
                        Report[0].Estimate += 1
                    }
                    if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == true) {
                        Report[0].PurchaseOrder += 1
                        Report[0].Quotation += 1
                        Report[0].Estimate += 1
                        Report[0].ProductOrderPrice += parseInt(product.ProductEstimatedPrice) ? product.ProductEstimatedPrice : 0
                    }
                } else {
                    let m
                    let foundreport = Report.find((report, i) => {
                        if (report.Agent_Id == estimate.agentId) {
                            m = i
                            return report
                        }
                    });
                    let NewReport = Report.filter((report) => {
                        return report.Agent_Id != estimate.agentId
                    })
                    if (foundreport) {
                        if (foundreport.ProductOrderPrice == undefined || foundreport.ProductOrderPrice == NaN) foundreport.ProductOrderPrice = 0
                        foundreport.Agent_Id = estimate.agentId
                        foundreport.Agent_Name = estimate.Agent_Name
                        foundreport.Agent_Code = estimate.Agent_Code
                        console.log(foundreport)
                        console.log(foundreport.ProductOrderPrice)
                        if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == false) foundreport.Estimate += 1
                        if (estimate.approvalFromAdminAsQuotes == true && estimate.approvalFromAdminAsPO == false) {
                            foundreport.Quotation += 1
                            foundreport.Estimate += 1
                        }
                        if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == true) {
                            foundreport.PurchaseOrder += 1
                            foundreport.Quotation += 1
                            foundreport.Estimate += 1
                            foundreport.ProductOrderPrice += product.ProductEstimatedPrice ? product.ProductEstimatedPrice : 0
                        }
                        NewReport.push(foundreport)
                        Report = NewReport
                    } else {
                        report.Agent_Id = estimate.agentId
                        report.Agent_Name = estimate.Agent_Name
                        report.Agent_Code = estimate.Agent_Code
                        report.ProductOrderPrice = 0
                        if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == false) report.Estimate += 1
                        if (estimate.approvalFromAdminAsQuotes == true && estimate.approvalFromAdminAsPO == false) {
                            report.Quotation += 1
                            report.Estimate += 1
                        }
                        if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == true) {
                            report.PurchaseOrder += 1
                            report.Quotation += 1
                            report.Estimate += 1
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