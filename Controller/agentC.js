const { sendEmail } = require("../Middleware/emailSend")
const { generateOtp } = require("../Middleware/genOtp")
const AgentS = require("../Service/AgentS")
const verifiedNumberS = require("../Service/verifyNumberS")
const OtpS = require("../Service/OtpS")
const { searchGlobal } = require("../Service/searchS")
const { error } = require("../Middleware/error")
const { sendOTPonPhone } = require("../Middleware/passOtp")

exports.getActiveAgents = async (req, res) => {
    let page = req.query.page
    let limit = req.query.limit
    let search = req.query.search
    let fieldForSearch = req.query.fieldForSearch
    console.log("page,limit", page, limit)
    let theAgents = await AgentS.getAllAgents(true, page, limit)
    if (theAgents.status == 200) {
        res.status(theAgents.status).send(theAgents)
    } else {
        res.status(theAgents.status).send({ error: theAgents.error, message: theAgents.message, status: theAgents.status })
    }
}

exports.searchGlobal = async (req, res) => {
    let search = req.query.search
    let fieldForSearch = req.query.fieldForSearch
    let searchQty = req.query.searchQty ? parseInt(req.query.searchQty) : 10
    let collection = req.query.collection
    let type = req.query.type
    let sortBy = req.query.sortBy
    let sortVal = req.query.sortVal
    let multiFieldSearch = req.query.multiFieldSearch
    let agentId = req.query.agentId
    let typeOfEstimate = req.query.typeOfEstimate
    let Response
    if (collection != "Admin" && collection != "Agent" && collection != "Crop" && collection != "Estimate" && collection != "Machine" && collection != "Product") return res.status(400).json({ error: "No Such Collection Exists", message: "No Such Collection Exists", status: 400 })
    Response = await searchGlobal(search, fieldForSearch, searchQty, collection, type, sortBy, sortVal, multiFieldSearch, agentId, typeOfEstimate)
    res.status(Response.status).json(Response)
}

exports.getAllAgents = async (req, res) => {
    let page = req.query.page
    let limit = req.query.limit
    console.log("page,limit", page, limit)
    let theAgents = await AgentS.getAllAgents(false, page, limit)
    if (theAgents.status == 200) {
        res.status(theAgents.status).send(theAgents)
    } else {
        res.status(theAgents.status).send({ error: theAgents.error, message: theAgents.message, status: theAgents.status })
    }
}

exports.getCommonById = async (req, res) => {
    let id = req.query.id
    let theAgents = await AgentS.getCommonById(id)
    if (theAgents.status == 200) {
        res.status(theAgents.status).send({ data: theAgents.data, message: theAgents.message, status: theAgents.status })
    } else {
        res.status(theAgents.status).send({ error: theAgents.error, message: theAgents.message, status: theAgents.status })
    }
}

exports.deleteTheAgent = async (req, res) => {
    let agentId = req.query.id
    let deleteAgent = await AgentS.deleteAgentById(agentId)
    if (deleteAgent.status == 202) {
        res.status(deleteAgent.status).send({ data: deleteAgent.data, message: deleteAgent.message, status: deleteAgent.status })
    } else {
        res.status(deleteAgent.status).send({ error: deleteAgent.error, message: deleteAgent.message, status: deleteAgent.status })
    }
}

exports.updateAgentById = async (req, res) => {
    let Agent = req.body.agent
    let updatedAgent = await AgentS.updateThisAgent(Agent)
    if (updatedAgent.status == 200) {
        res.status(updatedAgent.status).send({ data: updatedAgent.data, message: updatedAgent.message, status: updatedAgent.status })
    } else {
        res.status(updatedAgent.status).send({ error: updatedAgent.error, message: updatedAgent.message, status: updatedAgent.status })
    }
}

exports.getOtpForUpdateDocument = async (req, res) => {
    let phone = req.query.phone
    let mobileAccount = await verifiedNumberS.findOnly(phone)
    let Nerror
    if(!mobileAccount) Nerror = error("given phone","field not found")
    if(Nerror) res.status(Nerror.status).send(Nerror)
    let {role, id} = mobileAccount
    if ((role != "agent" && role != "dealer") || role == null) return res.status(404).send({ error: "agent not found", message: "please provide phone of a valid register agent", status: 404 })
    let foundAgent = await AgentS.getCommonById(id)
    let otp = generateOtp()
    // await sendEmail(foundAgent.data.email, "Otp Request For Agreement Document Submit", otp, { Name: foundAgent.data.firstName })
    let otpSent = await sendOTPonPhone("CustomerLink",otp,foundAgent.data.phone)
    if(otpSent.status != 200) return res.status(otpSent.status).send(otpSent)
    await OtpS.deleteOnly(foundAgent.data.phone)
    await OtpS.create({
        number: foundAgent.data.phone,
        id: id,
        otp: otp
    })
    if (foundAgent.status == 200) {
        res.status(foundAgent.status).send({ message: "OTP is sent to Agent's mobile number for verification !" + otp, status: foundAgent.status })
    } else {
        res.status(foundAgent.status).send({ error: foundAgent.error, message: foundAgent.message, status: foundAgent.status })
    }
}

exports.getAgrFileToVerifyUpdate = async (req, res) => {
    let { otp, phone, file } = req.body
    let mobileAccount = await verifiedNumberS.findOnly(phone)
    let Nerror
    if(!mobileAccount) Nerror = error("given phone","field not found")
    if(Nerror) res.status(Nerror.status).send(Nerror)
    let {role, id} = mobileAccount
    if ((role != "agent" && role != "dealer") || role == null) return res.status(404).send({ error: "agent not found", message: "please provide phone of a valid register agent", status: 404 })
    let otpRecieved = await OtpS.findOnly(phone)
    if (otpRecieved.otp != otp) return res.status(400).send({ message: "otp doesn't match", status: 400 })
    await OtpS.deleteOnly(phone)
    let DocumentFile = file
    let Agent = {
        DocumentFile,
        _id: id
    }
    let updatedAgent = await AgentS.updateThisAgent(Agent)
    if (updatedAgent.status == 200) {
        res.status(updatedAgent.status).send({ data: updatedAgent.data, message: "Agreement File Successfully Updated", status: updatedAgent.status })
    } else {
        res.status(updatedAgent.status).send({ error: updatedAgent.error, message: updatedAgent.message, status: updatedAgent.status })
    }
}