const AgentS = require("../Service/AgentS")

exports.getActiveAgents = async (req, res) => {
    let theAgents = await AgentS.getAllAgents(true)
    if (theAgents.status == 201) {
        res.status(theAgents.status).send({ data: theAgents.data, Message: theAgents.message, status: theAgents.status })
    } else {
        res.status(theAgents.status).send({ error: theAgents.error, Message: theAgents.message, status: theAgents.status })
    }
}

exports.getAllAgents = async (req, res) => {
    let theAgents = await AgentS.getAllAgents()
    if (theAgents.status == 200) {
        res.status(theAgents.status).send({ data: theAgents.data, Message: theAgents.message, status: theAgents.status })
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
    let agentId = req.body.id
    let deleteAgent= await AgentS.deleteAgentById(agentId)
    if (deleteAgent.status == 202) {
        res.status(deleteAgent.status).send({ data: deleteAgent.data, Message: deleteAgent.message, status: deleteAgent.status })
    } else {
        res.status(deleteAgent.status).send({ error: deleteAgent.error, Message: deleteAgent.message, status: deleteAgent.status })
    }
}

exports.updateAgentById = async (req, res) => {
    let Agent = req.body.agent
    let updatedAgent= await AgentS.updateThisAgent(Agent)
    if (updatedAgent.status == 200) {
        res.status(updatedAgent.status).send({ data: updatedAgent.data, Message: updatedAgent.message, status: updatedAgent.status })
    } else {
        res.status(updatedAgent.status).send({ error: updatedAgent.error, Message: updatedAgent.message, status: updatedAgent.status })
    }
}

exports.addEstimates = async (req, res) => {
    
}