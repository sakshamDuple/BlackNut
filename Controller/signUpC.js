const AgentS = require("../Service/AgentS")
const CustomerS = require("../Service/CustomerS")

exports.signUpAgent = async (req, res) => {
    let { role, firstName, lastName, phone, email, password, confirmPassword, status, Company_Name, GST_Number, PAN_Company, PAN_Agent, Address } = req.body
    const newAgent = await AgentS.create({ role, firstName, lastName, phone, email, password, confirmPassword, status, Company_Name, GST_Number, PAN_Company, PAN_Agent, Address })
    if (newAgent.status == 201) {
        res.status(newAgent.status).send({ Agent_ID: newAgent.Agent_ID, Message: newAgent.message, status: newAgent.status })
    } else {
        res.status(newAgent.status).send({ error: newAgent.error, Message: newAgent.message, status: newAgent.status })
    }
}

exports.signUpCustomer = async (req, res) => {
    let { role, firstName, lastName, phone, email, password, confirmPassword, Address } = req.body
    const newCustomer = await CustomerS.create({ role, firstName, lastName, phone, email, password, confirmPassword, Address })
    if (newCustomer.status == 201) {
        res.status(newCustomer.status).send({ Agent_ID: newCustomer.Agent_ID, Message: newCustomer.message, status: newCustomer.status })
    } else {
        res.status(newCustomer.status).send({ error: newCustomer.error, Message: newCustomer.message, status: newCustomer.status })
    }
}