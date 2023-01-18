const { hashPassword } = require("../Middleware/salt");
const Agent = require("../Model/Agent");
const VerifiedNumberS = require("../Service/verifyNumberS")
require('dotenv').config();

exports.create = async (agent) => {
    delete agent.role
    agent.role = "agent"
    let newagent = { ...agent }
    try {
        let agentExistsWithSuchEmail = await Agent.findOne({ email: agent.email })
        let phoneAlreadyRegistered = await VerifiedNumberS.findOnly(agent.phone)
        if (agentExistsWithSuchEmail) {
            return { error: "id already exists", message: "an id already exists with given email, please provide some other email", status: 409 }
        }
        if (phoneAlreadyRegistered) {
            return { error: "mobile already registered", message: "given phone is already registered with some id, please provide some other phone", status: 409 }
        }
        if (agent.password == agent.confirmPassword) {
            console.log("Hii")
            delete newagent.confirmPassword
            console.log(await hashPassword(agent.password))
            newagent.password = await hashPassword(agent.password)
            // process.env.DATABASE_URL
        } else {
            return { error: "password doesn't match", message: "please provide matching password & confirm password", status: 401 }
        }
        let createdAgent = await Agent.create(newagent)
        let doMobileRegistration = await VerifiedNumberS.create({ role: agent.role, number: agent.phone, id: createdAgent.id })
        return { Agent_ID: createdAgent._id, message: "agent successfully created", status: 201 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error" }
    }
}

exports.getAllAgents = async (bool) => {
    try {
        let allAgents
        if (bool) allAgents = await Agent.find({ role: "agent", status: "Active" })
        allAgents = await Agent.find({ role: "agent" })
        return { data: allAgents, message: allAgents.length>0?"retrieval Success":"please upload some agents to view", status: allAgents.length>0?200:404 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error" }
    }
}

exports.getCommonById = async (id, bool) => {
    try {
        let theAgent
        if (bool) theAgent = await Agent.findOne({ _id: id, status: "Active" })
        theAgent = await Agent.findOne({ _id: id })
        return { data: theAgent, message: theAgent?"retrieval Success":"not found", status: theAgent?200:400 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error" }
    }
}

exports.getCommonByEmail = async (email, bool) => {
    try {
        let theAgent
        if (bool) theAgent = await Agent.findOne({ email: email, status: "Active" })
        theAgent = await Agent.findOne({ email: email })
        return { data: theAgent, message: "retrieval Success", status: 200 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error" }
    }
}

exports.getCommonByPhone = async (phone, bool) => {
    try {
        let theAgent
        if (bool) theAgent = await Agent.findOne({ phone: phone, status: "Active" })
        theAgent = await Agent.findOne({ phone: phone })
        if (theAgent == null) return { data: theAgent, message: "no such detail found", status: 404 }
        return { data: theAgent, message: "retrieval Success", status: 200 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error" }
    }
}

exports.deleteAgentById = async (id) => {
    try {
        let theAgent = await Agent.findOne({_id:id,role:"agent"})
        let theNumberToDelete = parseInt(theAgent.phone)
        let theAgentToDelete = await Agent.deleteOne(id)
        deleteOnly(theNumberToDelete)
        return { data: theAgentToDelete, message: "deleted Successfully", status: 202 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error" }
    }
}

exports.updateThisAgent = async (agent) => {
    try {
        let prevAgent = await Agent.findOne(agent._id) //to Check For Future Conditions
        let newAgent = agent
        let updateThisAgent = await Agent.updateOne({ _id: agent._id}, { $set: newAgent })
        return { data: updateThisAgent.modifiedCount > 0, message: updateThisAgent.modifiedCount > 0 ? "updated Successfully" : "no updation was done", status: updateThisAgent.modifiedCount > 0 ? 200 : 400 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error" }
    }
}