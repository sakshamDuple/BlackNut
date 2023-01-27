const { sendEmail } = require("../Middleware/emailSend")
const { generateOtp } = require("../Middleware/genOtp")
const { getCommonById } = require("../Service/AgentS")
const CustomerS = require("../Service/CustomerS")
const OtpS = require("../Service/OtpS")
const { findOnly } = require("../Service/verifyNumberS")

exports.getActiveCustomers = async (req, res) => {
    let theCustomers = await CustomerS.getAllCustomer(true)
    if (theCustomers.status == 200) {
        res.status(theCustomers.status).send({ data: theCustomers.data, Message: theCustomers.message, status: theCustomers.status })
    } else {
        res.status(theCustomers.status).send({ error: theCustomers.error, Message: theCustomers.message, status: theCustomers.status }).status(theCustomers.status)
    }
}

exports.addCustomer = async (req, res) => {
    let agentId = req.body.agentId
    let Customer = req.body.Customer
    let otp = req.body.otp
    if (!agentId) return res.status(400).send({ Message: "can't add customer without agentId", status: 400 })
    let foundAgent = await getCommonById(agentId)
    if (!foundAgent.data) return res.status(foundAgent.status).send({ Message: foundAgent.message, status: foundAgent.status })
    let otpRecieved = await OtpS.findOnly(foundAgent.data.phone)
    if(otpRecieved.otp != otp) return res.status(400).send({ Message: "otp doesn't match", status: 400 })
    Customer.password = Customer.confirmPassword = "Pa$$w0rd!"
    const newCustomer = await CustomerS.create(Customer)
    console.log(newCustomer)
    await OtpS.deleteOnly(foundAgent.data.phone)
    if (newCustomer.status == 201) {
        res.status(newCustomer.status).send({ data: newCustomer.Agent_ID, Message: newCustomer.message, status: newCustomer.status })
    } else {
        res.status(newCustomer.status).send({ error: newCustomer.error, Message: newCustomer.message, status: newCustomer.status })
    }
}

exports.getThisCustomer = async (req,res) => {
    let customerId = req.query.id
    await CustomerS.getAllCustomer()
}

exports.getAllCustomers = async (req, res) => {
    let theCustomers = await CustomerS.getAllCustomer()
    console.log(theCustomers)
    if (theCustomers.status == 200) {
        res.status(theCustomers.status).send({ data: theCustomers.data, Message: theCustomers.message, status: theCustomers.status }).status(theCustomers.status)
    } else {
        res.status(theCustomers.status).send({ error: theCustomers.error, Message: theCustomers.message, status: theCustomers.status }).status(theCustomers.status)
    }
}

exports.deleteTheCustomer = async (req, res) => {
    let customerId = req.query.id
    let deleteCustomer = await CustomerS.deleteCustomerById(customerId)
    if (deleteCustomer.status == 202) {
        res.status(deleteCustomer.status).send({ data: deleteCustomer.data, Message: deleteCustomer.message, status: deleteCustomer.status })
    } else {
        res.status(deleteCustomer.status).send({ error: deleteCustomer.error, Message: deleteCustomer.message, status: deleteCustomer.status })
    }
}

exports.updateCustomerById = async (req, res) => {
    let Customer = req.body.customer
    let updatedCustomer = await CustomerS.updateThisCustomer(Customer)
    if (updatedCustomer.status == 200) {
        res.status(updatedCustomer.status).send({ data: updatedCustomer.data, Message: updatedCustomer.message, status: updatedCustomer.status })
    } else {
        res.status(updatedCustomer.status).send({ error: updatedCustomer.error, Message: updatedCustomer.message, status: updatedCustomer.status })
    }
}

exports.customerOtpRecieve = async (req, res) => {
    let phone = req.query.phone
    let Nphone = parseInt(phone)
    console.log(10000000000>Nphone && Nphone>=1000000000)
    if(10000000000>Nphone && Nphone>=1000000000){
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
        if(mobileExists != null) {
            await sendEmail(email, "OTP request for Existing Customer Verify on Blacknut", otp)
            return res.status(200).send({ message: `The Customer is Already Registered with given mobile, we are not updating customer details, an otp is sent on your mobile & to continue create estimate process put them in the black below,, tempOtp:${otp}`, status: 200 })
        }
        await sendEmail(email, "OTP request for Customer Creation on Blacknut", otp)
        res.status(200).send({ message: `an otp is sent on customer mail, please verifying otp to process customer creation, tempOtp:${otp}`, status: 200 })
    }
    res.status(400).send({error:"Not a valid phone", message:"Please enter a valid phone number", status:400})
}