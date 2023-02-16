const Estimate = require("../Model/Estimate");
const { getCommonById } = require("../Service/AgentS");
const EstimateS = require("../Service/estimateS");
const OtpS = require("../Service/OtpS");
const { findOnly } = require("../Service/verifyNumberS");
const { generateOtp } = require("../Middleware/genOtp");
const { sendEmail } = require("../Middleware/emailSend");
const fs = require('fs');
const pdf = require("html-pdf");
const ejs = require("ejs");
const moment = require("moment");
const https = require("https");
const { ToWords } = require('to-words');
const PDFMerger = require('pdf-merger-js');
const { uploadFiles } = require("./UploadC");
const toWords = new ToWords();

exports.getAll = async (req, res) => {
    let page = req.query.page
    let limit = req.query.limit
    let agentId = req.query.agentId ? req.query.agentId : ""
    let state = req.query.state
    let AllEstimates = await EstimateS.getAllEstimates(agentId, agentId != "" ? "agent" : "", page, limit, state)
    if (AllEstimates.status == 200) {
        res.status(AllEstimates.status).send(AllEstimates)
    } else {
        res.status(AllEstimates.status).send({ error: AllEstimates.error, message: AllEstimates.message, status: AllEstimates.status })
    }
}

exports.getAllQuotation = async (req, res) => {
    let page = req.query.page
    let limit = req.query.limit
    let state = req.query.state
    let agentId = req.query.agentId ? req.query.agentId : ""
    console.log(agentId)
    let AllEstimates = await EstimateS.getAllQuotation(agentId, agentId == "" ? "" : "agent", page, limit, state)
    if (AllEstimates.status == 200) {
        res.status(AllEstimates.status).send(AllEstimates)
    } else {
        res.status(AllEstimates.status).send({ error: AllEstimates.error, message: AllEstimates.message, status: AllEstimates.status })
    }
}

exports.getAllPO = async (req, res) => {
    let page = req.query.page
    let limit = req.query.limit
    let state = req.query.state
    let agentId = req.query.agentId ? req.query.agentId : ""
    let AllEstimates = await EstimateS.getAllPO(agentId, agentId == "" ? "" : "agent", page, limit, state)
    if (AllEstimates.status == 200) {
        res.status(AllEstimates.status).send(AllEstimates)
    } else {
        res.status(AllEstimates.status).send({ error: AllEstimates.error, message: AllEstimates.message, status: AllEstimates.status })
    }
}

exports.getQuotationById = async (req, res) => {
    let AllEstimates = await EstimateS.getQuotationById(req.query.id)
    if (AllEstimates.status == 200) {
        res.status(AllEstimates.status).send({ data: AllEstimates.data, message: AllEstimates.message, status: AllEstimates.status })
    } else {
        res.status(AllEstimates.status).send({ error: AllEstimates.error, message: AllEstimates.message, status: AllEstimates.status })
    }
}

exports.getByAgentId = async (req, res) => {
    let AllEstimates = await EstimateS.getByAgentId(req.query.id)
    if (AllEstimates.status == 200) {
        res.status(AllEstimates.status).send({ data: AllEstimates.data, message: AllEstimates.message, status: AllEstimates.status })
    } else {
        res.status(AllEstimates.status).send({ error: AllEstimates.error, message: AllEstimates.message, status: AllEstimates.status })
    }
}

exports.create = async (req, res) => {
    let estimate = req.body
    let createdEstimate = await EstimateS.create(estimate)
    res.status(createdEstimate.status).send({ data: createdEstimate.data, error: createdEstimate.error, message: createdEstimate.message, status: createdEstimate.status })
}

exports.getById = async (req, res) => {
    let id = req.query.id
    let Estimate = await EstimateS.getEstimateById(id)
    if (Estimate.status == 200) {
        res.status(Estimate.status).send({ data: Estimate.data, message: Estimate.message, status: Estimate.status })
    } else {
        res.status(Estimate.status).send({ error: Estimate.error, message: Estimate.message, status: Estimate.status })
    }
}

exports.getDetailedEstimateById = async (req, res) => {
    let id = req.query.id
    let Estimate = await EstimateS.getDetailEstimateById(id)
    if (Estimate.status == 200) {
        res.status(Estimate.status).send({ data: Estimate.data, message: Estimate.message, status: Estimate.status })
    } else {
        res.status(Estimate.status).send({ error: Estimate.error, message: Estimate.message, status: Estimate.status })
    }
}

exports.getPdfById = async (req, res) => {
    let id = req.query.id
    let Estimate = await EstimateS.getDetailEstimateById(id)
    let MainVal = "Estimate"
    let date, estimatedDateOfPurchase, numericPrice
    if (Estimate.data.approvalFromAdminAsQuotes == false && Estimate.data.approvalFromAdminAsPO == true) MainVal = "Purchase Order"
    if (Estimate.data.approvalFromAdminAsQuotes == true && Estimate.data.approvalFromAdminAsPO == false) MainVal = "Quotation"
    if (Estimate.data.approvalFromAdminAsQuotes == false && Estimate.data.approvalFromAdminAsPO == false) MainVal = "Estimate"
    if (Estimate.data.createdAt) date = moment(Estimate.data.createdAt).format("DD-MM-YYYY") //moment(Estimate.data.createdAt, 'DD-MM-YYYY');
    if (Estimate.data.EstimateDateOfPurchase) estimatedDateOfPurchase = moment(Estimate.data.EstimateDateOfPurchase).format("DD-MM-YYYY") //moment(Estimate.data.EstimateDateOfPurchase, 'dd/mm/yyyy');
    let totel = Estimate.data.Products.reduce((total, prod) => {
        let amt = prod.Product.Price * prod.quantity;
        return total + Math.round(amt);
    }, 0);
    let totelgst = Estimate.data.Products.reduce((totel, prod) => {
        let amt = (prod.Product.Price * prod.quantity * prod.Gst) / 100;
        return totel + Math.round(amt);
    }, 0);
    let totelamount = Estimate.data.Products.reduce((totel, prod) => {
        let amt = (prod.quantity * prod.Product.Price * prod.Gst) / 100 + prod.quantity *
            prod.Product.Price;
        return totel + Math.round(amt);
    }, 0);
    if (Estimate.data.Products.length > 0) numericPrice = toWords.convert(parseInt(totelamount).toFixed(2))
    try {
        let options = {
            "height": "21.16in",
            "width": "15.00in",
            "header": {
                "height": "20mm"
            },
            "footer": {
                "height": "20mm",
            },
        };
        console.log("date", date)
        let html = await ejs.renderFile(`./public/Estimate.ejs`, { Estimate: Estimate.data, MainVal, date, estimatedDateOfPurchase, totelamount, totelgst, totel, numericPrice }, { async: true })
        var filePath = `./${Estimate.data.EstimateId}.pdf`;
        let pdfo = []
        Estimate.data.Products.forEach(element => {
            console.log(element.Product)
            if (element.Product.pdfFile != null) pdfo.push(element.Product.pdfFile)
        });
        const merger = new PDFMerger();
        let mergeFiles = []
        pdfo.forEach((element, i) => {
            https.get(element, (res) => {
                const path = `file${i + 1}.pdf`;
                mergeFiles.push(path)
                const writeStream = fs.createWriteStream(path);
                res.pipe(writeStream);
                writeStream.on("finish", () => {
                    writeStream.close();
                    console.log("Download Completed!");
                })
            })
        });
        pdf.create(html, options).toFile(`${Estimate.data.EstimateId}.pdf`, async function (err, data) {
            if (err) {
                res.send(err);
                return
            } else {
                await merger.add(`${Estimate.data.EstimateId}.pdf`)
                for (const file of mergeFiles) {
                    await merger.add(file)
                }
                await merger.save('mergedPdf.pdf');
                res.download('mergedPdf.pdf')
            }
        })
        // return new Promise((resolve, reject) => {
        //     pdf.create(html, options).toFile(`${Estimate.data.EstimateId}.pdf`, async function (err, data) {
        //         if (err) {
        //             res.send(err);
        //             return
        //         } else {
        //             // res.download(filePath)
        //             // resolve(data.filename)
        //             await merger.add(data.filename)
        //             for (const file of pdfo) {
        //                 await merger.add(file)
        //             }
        //             await merger.save('mergerPdf.pdf');
        //             res.download(`./mergerPdf.pdf`)
        //         }
        //     });
        // })
    } catch (e) {
        console.log(e.message);
    }
}

exports.getEstimatesByAgentId = async (req, res) => {
    let id = req.query.id
    let state = req.query.state
    let AllEstimates = await EstimateS.getAllEstimates(id, "agent", "", "", state)
    if (AllEstimates.status == 200) {
        res.status(AllEstimates.status).send(AllEstimates)
    } else {
        res.status(AllEstimates.status).send({ error: AllEstimates.error, message: AllEstimates.message, status: AllEstimates.status })
    }
}

exports.updateEstimateToQuotation = async (req, res) => {
    let id = req.query.id
    let Estimate = await EstimateS.updateEstimateToQuotation(id)
    if (Estimate.status == 200) {
        res.status(Estimate.status).send({ data: Estimate.data, message: Estimate.message, status: Estimate.status })
    } else {
        res.status(Estimate.status).send({ error: Estimate.error, message: Estimate.message, status: Estimate.status })
    }
}

exports.customerOtpRecieve = async (req, res) => {
    let phone = req.query.phone
    let Nphone = parseInt(phone)
    console.log(10000000000 > Nphone && Nphone >= 1000000000)
    if (10000000000 > Nphone && Nphone >= 1000000000) {
        let email = req.query.email
        let agentid = req.query.agentid
        if (!phone && !email && !agentid) return res.status(400).send({ message: "fields missing", status: 400 })
        let foundAgent = await getCommonById(agentid)
        if (!foundAgent.data) return res.status(foundAgent.status).send({ message: foundAgent.message, status: foundAgent.status })
        let mobileExists = await findOnly(phone)
        // if (mobileExists != null) return res.status(409).send({ message: "requested phone is already registered", status: 409 })
        let otp = generateOtp()
        await OtpS.deleteOnly(foundAgent.data.phone)
        await OtpS.create({
            number: foundAgent.data.phone,
            id: agentid,
            otp: otp
        })
        if (mobileExists == null) return res.status(404).send({ message: "No such mobile found", status: 404 })
        await sendEmail(email, "OTP request for File Upload & Updation Of quotation To Purchase Order", otp, { Name: foundAgent.data.firstName })
        res.status(200).send({ message: `OTP is sent on Customer's Mobile Number! tempOtp:${otp}`, status: 200 })
    }
    res.status(400).send({ error: "Not a valid phone", message: "Please enter a valid phone number", status: 400 })
}

exports.updateQuotationToPO = async (req, res) => {
    let id = req.query.id
    let quotation = req.body.Quotation
    let approval = req.body.approval
    let data = req.body.data
    console.log(id, quotation, approval, data)
    let Quotation = await EstimateS.updateQuotationToPO(id, quotation, approval, data)
    if (Quotation.status == 200) {
        res.status(Quotation.status).send({ data: Quotation.data, message: Quotation.message, status: Quotation.status })
    } else {
        res.status(Quotation.status).send({ error: Quotation.error, message: Quotation.message, status: Quotation.status })
    }
}

exports.updateQuotationToPI = async (req, res) => {
    let id = req.query.id
    let Estimate = await EstimateS.updateEstimateToQuotation(id)
    if (Estimate.status == 200) {
        res.status(Estimate.status).send({ data: Estimate.data, message: Estimate.message, status: Estimate.status })
    } else {
        res.status(Estimate.status).send({ error: Estimate.error, message: Estimate.message, status: Estimate.status })
    }
}

exports.getReportsFromEstimates = async (req, res) => {
    let page = req.query.page ? req.query.page : 1
    let limit = req.query.limit ? req.query.limit : 10
    let query = {}
    let startDate = req.query.startDate
    let endDate = req.query.endDate
    if (startDate && endDate) {
        query = {
            $and: [{ createdAt: { $gte: new Date(startDate.toString()) } }, { createdAt: { $lte: new Date(endDate.toString()) } }]
        }
    }
    let start = (parseInt(page) - 1) * parseInt(limit)
    try {
        let agentId = req.query.id
        let foundEstimates = await Estimate.find(query)
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
                        Report[0].ProductOrderPrice += parseInt(product.ProductEstimatedPrice) ? (product.ProductEstimatedPrice * product.quantity * (100 + product.Gst) / 100) : 0
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
                        foundreport.ProductName = product.ProductName
                        if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == false) foundreport.Estimate += 1
                        if (estimate.approvalFromAdminAsQuotes == true && estimate.approvalFromAdminAsPO == false) {
                            foundreport.Quotation += 1
                            foundreport.Estimate += 1
                        }
                        if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == true) {
                            foundreport.PurchaseOrder += 1
                            foundreport.Quotation += 1
                            foundreport.Estimate += 1
                            foundreport.ProductOrderPrice += product.ProductEstimatedPrice ? (product.ProductEstimatedPrice * product.quantity) : 0
                        }
                        NewReport.push(foundreport)
                        Report = NewReport
                    } else {
                        report.ProductID = product.ProductIDToShow
                        report.ProductName = product.ProductName
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
                            report.ProductOrderPrice += product.ProductEstimatedPrice ? (product.ProductEstimatedPrice * product.quantity) : 0
                        }
                        Report.push(report)
                    }
                }
            })
        })
        let totalCount = Report.length
        return res.status(200).send({
            data: Report.splice(start, limit),
            totalCount,
            message: "reports made",
            status: 200,
        });
    } catch (e) {
        console.log(e);
        return { error: e, message: "we have an error", status: 400 };
    }
}

exports.getAgentReportsFromEstimates = async (req, res) => {
    let page = req.query.page ? req.query.page : 1
    let limit = req.query.limit ? req.query.limit : 10
    let start = (parseInt(page) - 1) * parseInt(limit)
    let query = {}
    let startDate = req.query.startDate
    let endDate = req.query.endDate
    if (startDate && endDate) {
        query = {
            $and: [{ createdAt: { $gte: new Date(startDate.toString()) } }, { createdAt: { $lte: new Date(endDate.toString()) } }]
        }
    }
    let agg = [{
        '$match': query
    },
    {
        '$project': {
            '_id': 1,
            'agentId': 1,
            'createdAt': 1,
            'TotalCost': {
                '$sum': '$Products.ProductEstimatedPrice'
            },
            // 'Products':1,
            'agentName': 1,
            'Agent_Code': 1,
            'approvalFromAdminAsQuotes': 1,
            'approvalFromAdminAsPO': 1
        }
    }
    ]
    try {
        let foundEstimates = await Estimate.aggregate(agg)
        let Report = [{
            Agent_Code: "",
            Agent_Id: "",
            Agent_Name: "",
            Estimate: 0,
            Quotation: 0,
            PurchaseOrder: 0,
            EstimatePrice: 0,
            QuotationPrice: 0,
            ProductOrderPrice: 0
        }]
        foundEstimates.map((estimate) => {
            let report = {
                Estimate: 0,
                Quotation: 0,
                PurchaseOrder: 0
            }
            if (Report.length == 1 && Report[0].Agent_Code == "") {
                Report[0].Agent_Id = estimate.agentId
                Report[0].Agent_Name = estimate.agentName
                Report[0].Agent_Code = estimate.Agent_Code
                if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == false) {
                    Report[0].Estimate += 1
                    Report[0].EstimatePrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
                }
                if (estimate.approvalFromAdminAsQuotes == true && estimate.approvalFromAdminAsPO == false) {
                    Report[0].Quotation += 1
                    Report[0].Estimate += 1
                    Report[0].EstimatePrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
                    Report[0].QuotationPrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
                }
                if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == true) {
                    Report[0].PurchaseOrder += 1
                    Report[0].Quotation += 1
                    Report[0].Estimate += 1
                    Report[0].EstimatePrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
                    Report[0].QuotationPrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
                    Report[0].ProductOrderPrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
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
                    foundreport.Agent_Name = estimate.agentName
                    foundreport.Agent_Code = estimate.Agent_Code
                    if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == false) {
                        foundreport.Estimate += 1
                        foundreport.EstimatePrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
                    }
                    if (estimate.approvalFromAdminAsQuotes == true && estimate.approvalFromAdminAsPO == false) {
                        foundreport.Quotation += 1
                        foundreport.Estimate += 1
                        foundreport.EstimatePrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
                        foundreport.QuotationPrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
                    }
                    if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == true) {
                        foundreport.PurchaseOrder += 1
                        foundreport.Quotation += 1
                        foundreport.Estimate += 1
                        foundreport.EstimatePrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
                        foundreport.QuotationPrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
                        foundreport.ProductOrderPrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
                    }
                    NewReport.push(foundreport)
                    Report = NewReport
                } else {
                    report.Agent_Id = estimate.agentId
                    report.Agent_Name = estimate.agentName
                    report.Agent_Code = estimate.Agent_Code
                    report.ProductOrderPrice = 0
                    report.EstimatePrice = 0
                    report.QuotationPrice = 0
                    if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == false) {
                        report.Estimate += 1
                        report.EstimatePrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
                    }
                    if (estimate.approvalFromAdminAsQuotes == true && estimate.approvalFromAdminAsPO == false) {
                        report.Quotation += 1
                        report.Estimate += 1
                        report.EstimatePrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
                        report.QuotationPrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
                    }
                    if (estimate.approvalFromAdminAsQuotes == false && estimate.approvalFromAdminAsPO == true) {
                        report.PurchaseOrder += 1
                        report.Quotation += 1
                        report.Estimate += 1
                        report.EstimatePrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
                        report.QuotationPrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
                        report.ProductOrderPrice += estimate.TotalCost ? parseInt(estimate.TotalCost) : 0
                    }
                    Report.push(report)
                }
            }
        })
        let totalCount = Report.length
        return res.status(200).send({
            data: Report.splice(start, limit),
            totalCount,
            message: "reports made",
            status: 200,
        });
    } catch (e) {
        console.log(e);
        return { error: e, message: "we have an error", status: 400 };
    }
}