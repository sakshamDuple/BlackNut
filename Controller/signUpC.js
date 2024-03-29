const AgentS = require("../Service/AgentS")
const CustomerS = require("../Service/CustomerS")
const AdminS = require("../Service/adminS")
const { SuperAdminEmail } = require("../Middleware/emailSend")

exports.signUpAgent = async (req, res) => {
    let { role, firstName, lastName, phone, email, password, confirmPassword, status, Company_Name, GST_Number, PAN_Company, PAN_Agent, Address, PAN_A_File, PAN_C_File } = req.body
    const newAgent = await AgentS.create({ role, firstName, lastName, phone, email, password, confirmPassword, status, Company_Name, GST_Number, PAN_Company, PAN_Agent, Address, PAN_Company_File: PAN_C_File, PAN_Agent_File: PAN_A_File })
    if (newAgent.status == 201) {
        res.status(newAgent.status).send({ Agent_ID: newAgent.Agent_ID, message: newAgent.message, status: newAgent.status })
    } else {
        res.status(newAgent.status).send({ error: newAgent.error, message: newAgent.message, status: newAgent.status })
    }
}

exports.signUpCustomer = async (req, res) => {
    let { role, firstName, lastName, phone, email, password, confirmPassword, Address } = req.body
    const newCustomer = await CustomerS.create({ role, firstName, lastName, phone, email, password, confirmPassword, Address })
    if (newCustomer.status == 201) {
        res.status(newCustomer.status).send({ Agent_ID: newCustomer.Agent_ID, message: newCustomer.message, status: newCustomer.status })
    } else {
        res.status(newCustomer.status).send({ error: newCustomer.error, message: newCustomer.message, status: newCustomer.status })
    }
}

exports.createDefaultSuperAdmin = async (req, res) => {
    let email = SuperAdminEmail
    let phone = 1111111111
    let firstName = "admin"
    let lastName = "admin"
    let password = "Pa$$w0rd!"
    let confirmPassword = "Pa$$w0rd!"
    let role = "SuperAdmin"
    let Address = {
        state: "AllIndia",
        mainAddressText: "INDIA"
    }
    const newCustomer = await AdminS.create({ firstName, lastName, phone, email, password, confirmPassword, role, Address })
    if (newCustomer.status == 201) {
        res.status(newCustomer.status).send({ Admin_ID: newCustomer.Agent_ID, message: newCustomer.message, status: newCustomer.status })
    } else {
        res.status(newCustomer.status).send({ error: newCustomer.error, message: newCustomer.message, status: newCustomer.status })
    }
}

exports.createAdmin = async (req, res) => {
    let { firstName, lastName, phone, email, password, confirmPassword, Address } = req.body
    const newCustomer = await AdminS.create({ firstName, lastName, phone, email, password, confirmPassword, Address })
    if (newCustomer.status == 201) {
        res.status(newCustomer.status).send({ Agent_ID: newCustomer.Agent_ID, message: newCustomer.message, status: newCustomer.status })
    } else {
        res.status(newCustomer.status).send({ error: newCustomer.error, message: newCustomer.message, status: newCustomer.status })
    }
}