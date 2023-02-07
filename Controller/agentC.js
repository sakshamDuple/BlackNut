const { sendEmail } = require("../Middleware/emailSend")
const { generateOtp } = require("../Middleware/genOtp")
const AgentS = require("../Service/AgentS")
const verifiedNumberS = require("../Service/verifyNumberS")
const OtpS = require("../Service/OtpS")
const { searchGlobal } = require("../Service/searchS")

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
        res.status(theAgents.status).send({ error: theAgents.error, Message: theAgents.message, status: theAgents.status })
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
    let Response
    if (collection != "Admin" && collection != "Agent" && collection != "Crop" && collection != "Estimate" && collection != "Machine" && collection != "Product") return res.status(400).json({ error: "No Such Collection Exists", Message: "No Such Collection Exists", status: 400 })
    Response = await searchGlobal(search, fieldForSearch, searchQty, collection, type, sortBy, sortVal, multiFieldSearch)
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
        res.status(theAgents.status).send({ error: theAgents.error, Message: theAgents.message, status: theAgents.status })
    }
}

exports.getCommonById = async (req, res) => {
    let id = req.query.id
    let theAgents = await AgentS.getCommonById(id)
    if (theAgents.status == 200) {
        res.status(theAgents.status).send({ data: theAgents.data, Message: theAgents.message, status: theAgents.status })
    } else {
        res.status(theAgents.status).send({ error: theAgents.error, Message: theAgents.message, status: theAgents.status })
    }
}

exports.deleteTheAgent = async (req, res) => {
    let agentId = req.query.id
    let deleteAgent = await AgentS.deleteAgentById(agentId)
    if (deleteAgent.status == 202) {
        res.status(deleteAgent.status).send({ data: deleteAgent.data, Message: deleteAgent.message, status: deleteAgent.status })
    } else {
        res.status(deleteAgent.status).send({ error: deleteAgent.error, Message: deleteAgent.message, status: deleteAgent.status })
    }
}

exports.updateAgentById = async (req, res) => {
    let Agent = req.body.agent
    let updatedAgent = await AgentS.updateThisAgent(Agent)
    if (updatedAgent.status == 200) {
        res.status(updatedAgent.status).send({ data: updatedAgent.data, Message: updatedAgent.message, status: updatedAgent.status })
    } else {
        res.status(updatedAgent.status).send({ error: updatedAgent.error, Message: updatedAgent.message, status: updatedAgent.status })
    }
}

exports.getOtpForUpdateDocument = async (req, res) => {
    let phone = req.query.phone
    console.log(phone)
    let { role, id } = await verifiedNumberS.findOnly(phone)
    if (role != "agent") return res.status(404).send({ error: "agent not found", Message: "please provide phone of a valid register agent", status: 404 })
    let foundAgent = await AgentS.getCommonById(id)
    let otp = generateOtp()
    console.log(foundAgent.data.email, otp)
    await sendEmail(foundAgent.data.email, "Otp Request For Agreement Document Submit", otp, { Name: foundAgent.data.firstName })
    await OtpS.create({
        number: foundAgent.data.phone,
        id: id,
        otp: otp
    })
    if (foundAgent.status == 200) {
        res.status(foundAgent.status).send({ Message: "OTP is sent to Agent's mobile number for verification !" + otp, status: foundAgent.status })
    } else {
        res.status(foundAgent.status).send({ error: foundAgent.error, Message: foundAgent.message, status: foundAgent.status })
    }
}

exports.getAgrFileToVerifyUpdate = async (req, res) => {
    let { otp, phone, file } = req.body
    let { role, id } = await verifiedNumberS.findOnly(phone)
    if (role != "agent") return res.status(404).send({ error: "agent not found", Message: "please provide phone of a valid register agent", status: 404 })
    let otpRecieved = await OtpS.findOnly(phone)
    if (otpRecieved.otp != otp) return res.status(400).send({ Message: "otp doesn't match", status: 400 })
    await OtpS.deleteOnly(phone)
    let DocumentFile = file
    let Agent = {
        DocumentFile,
        _id: id
    }
    let updatedAgent = await AgentS.updateThisAgent(Agent)
    if (updatedAgent.status == 200) {
        res.status(updatedAgent.status).send({ data: updatedAgent.data, Message: "Agreement File Successfully Updated", status: updatedAgent.status })
    } else {
        res.status(updatedAgent.status).send({ error: updatedAgent.error, Message: updatedAgent.message, status: updatedAgent.status })
    }
}