const { sendEmail } = require("../Middleware/emailSend");
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
            return { error: "id already exists", message: "Agent / Customer is already registered with this Email Address !", status: 409 }
        }
        if (phoneAlreadyRegistered) {
            return { error: "mobile already registered", message: "Agent / Customer is already registered with this mobile number !", status: 409 }
        }
        if (agent.password == agent.confirmPassword) {
            delete newagent.confirmPassword
            newagent.password = await hashPassword(agent.password)
            newagent.AgentNo = await getValueForNextSequence()
            console.log(newagent.AgentNo)
            newagent.AgentID = "AG_" + newagent.AgentNo
        } else {
            return { error: "password doesn't match", message: "Password Do not Match !", status: 401 }
        }
        let createdAgent = await Agent.create(newagent)
        await sendEmail(newagent.email, "Your Agent Account is Registered", "", { Name: newagent.firstName })
        let doMobileRegistration = await VerifiedNumberS.create({ role: agent.role, number: agent.phone, id: createdAgent.id })
        return { Agent_ID: createdAgent._id, 
                 message: `Agent successfully registered. Agent's agreement is sent to your registered email. 
                           You may Download the agreement.`, 
                 status: 201 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error" }
    }
}

async function getValueForNextSequence() {
    let foundAgents = await Agent.find();
    if (foundAgents.length == 0) return 1;
    let agg = [
        {
            $group: {
                _id: null,
                MaxEstimateNo: { $max: "$AgentNo" }
            },
        },
    ];
    let findMax = await Agent.aggregate(agg);
    return findMax[0].MaxEstimateNo + 1;
}

exports.getAllAgents = async (bool, page, limit) => {
    try {
        let allAgents, query, totalCount
        query = { role: "agent" }
        if (bool) query = { role: "agent", status: "ACTIVE" }
        totalCount = await Agent.count(query)
        if (page && limit) {
            start = limit * (page - 1)
            allAgents = await Agent.find(query).skip(start).limit(parseInt(limit)).sort({createdAt:-1})
        } else {
            allAgents = await Agent.find(query).sort({createdAt:-1})
        }
        return { data: allAgents, totalCount, message: allAgents.length > 0 ? "retrieval Success" : "please upload some agents to view", status: allAgents.length > 0 ? 200 : 404 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error" }
    }
}

exports.getAgentToShowById = async (id, bool) => {
    try {
        let theCustomer
        theCustomer = await Agent.findOne({ _id: id, role: "agent" })
        if (bool) theCustomer = await Agent.findOne({ _id: id, role: "agent", status: "Active" })
        let { role, firstName, lastName, phone, email, createdAt, Company_Name, GST_Number, PAN_Company, PAN_Agent, Address } = theCustomer
        let customerToShow = { role, firstName, lastName, phone, email, createdAt, Company_Name, GST_Number, PAN_Company, PAN_Agent, Address }
        return { data: customerToShow, message: "retrieval Success", status: 201 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error", status: 400 }
    }
}

exports.getCommonById = async (id, bool) => {
    try {
        let theAgent
        if (bool) theAgent = await Agent.findOne({ _id: id, status: "Active" })
        theAgent = await Agent.findOne({ _id: id })
        return { data: theAgent, message: theAgent ? "retrieval Success" : "agent/customer not found", status: theAgent ? 200 : 400 }
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

exports.deleteAgentById = async (agentId) => {
    try {
        let theAgent = await Agent.findOne({ _id: agentId})
        console.log("theAgent",theAgent)
        let theNumberToDelete = parseInt(theAgent.phone)
        let theAgentToDelete = await Agent.deleteOne({_id:agentId})
        deleteOnly(theNumberToDelete)
        return { data: theAgentToDelete, message: "deleted Successfully", status: 202 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error" }
    }
}

exports.updateThisAgent = async (agent, field) => {
    try {
        let prevAgent = await Agent.findById(agent._id) //to Check For Future Conditions
        let { role, firstName, lastName, Company_Name, GST_Number, PAN_Company, PAN_Agent, Address, password, DocumentFile, status } = agent
        let newAgent = prevAgent
        if (field == "password") newAgent.password = password
        if (role) newAgent.role = role
        if (firstName) newAgent.firstName = firstName
        if (lastName) newAgent.lastName = lastName
        if (Company_Name) newAgent.Company_Name = Company_Name
        if (GST_Number) newAgent.GST_Number = GST_Number
        if (PAN_Company) newAgent.PAN_Company = PAN_Company
        if (PAN_Agent) newAgent.PAN_Agent = PAN_Agent
        if (Address) newAgent.Address = Address
        if (DocumentFile) newAgent.DocumentFile = DocumentFile
        if (status) newAgent.status = status
        if(field == "login") newAgent.loginTime = [Date.now()]
        let updateThisAgent = await Agent.updateOne({ _id: agent._id }, { $set: newAgent })
        return { data: updateThisAgent.nModified > 0, message: updateThisAgent.nModified > 0 ? "updated Successfully" : "no updation was done", status: updateThisAgent.nModified > 0 ? 200 : 400 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error" }
    }
}