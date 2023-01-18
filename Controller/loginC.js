const { createTempPass } = require("../Middleware/createTemporaryPassword")
const { sendEmail } = require("../Middleware/emailSend")
const { generateOtp } = require("../Middleware/genOtp")
const { generateAccessToken } = require("../Middleware/jwtSign")
const { hashCompare, hashPassword } = require("../Middleware/salt")
const TempOtp = require("../Model/TempOtp")
const AgentS = require("../Service/AgentS")
const OtpS = require("../Service/OtpS")

// exports.loginAgent = async (req,res) => {
//     console.log("hii")
//     res.send("hii")
// }

exports.commonlogin = async (req, res) => {
    let { phone, email, password } = req.body
    let theAgentFound
    if (!password) return res.status(404).send({ error: "password field can't be empty", Message: "please provide password to login", status: 400 })
    if (!email && !phone) return res.status(404).send({ error: "email or phone field can't be empty", Message: "please provide either email or phone to login", status: 400 })
    if (email && password) {
        theAgentFound = await AgentS.getCommonByEmail(email)
        let compare = await hashCompare(password, theAgentFound.data.password)
        if (!compare) return res.status(400).send({ error: "password not matched", message: "password to the given email is not matched", status: 400 })
        let accessToken = generateAccessToken({ role: theAgentFound.data.role, firstName: theAgentFound.data.firstName, lastName: theAgentFound.data.lastName, phone: theAgentFound.data.phone, email: theAgentFound.data.email, id: theAgentFound.data._id })
        res.setHeader("Authorization", accessToken).status(201).json({ accessToken, message: "login success", status: 201 })
    } else if (phone && password) {
        theAgentFound = await AgentS.getCommonByPhone(phone)
        let compare = await hashCompare(password, theAgentFound.data.password)
        if (!compare) return res.status(400).json({ error: "password not matched", message: "password to the given phone is not matched", status: 400 })
        let accessToken = generateAccessToken({ role: theAgentFound.data.role, firstName: theAgentFound.data.firstName, lastName: theAgentFound.data.lastName, phone: theAgentFound.data.phone, email: theAgentFound.data.email, id: theAgentFound.data._id })
        res.setHeader("Authorization", accessToken).status(201).json({ message: "login success", status: 201 })
    }
}

exports.forgotPassword = async (req, res) => {
    let { phone, email } = req.body
    if (phone && email) {
        let theAgentFound1 = await AgentS.getCommonByEmail(email)
        let theAgentFound2 = await AgentS.getCommonByPhone(phone)
        console.log(theAgentFound2)
        if (theAgentFound1.data._id.toString() == theAgentFound2.data._id.toString()) {
            let otp = generateOtp()
            let genTempOtpOnDB = await OtpS.create({
                number: phone,
                id: theAgentFound1.data._id.toString(),
                otp: otp
            })
            await sendEmail(email, "password change request otp", otp)
            return res.status(200).send({ message: "an otp is sent on your mail, please create new password after verifying otp", status: 200 })
        }
        return res.status(400).send({ data: "accounts from phone & email do not match", message: "the retreived accounts for email & phone are not macthed", status: 400 })
    }
    else return res.status(400).send({ error: "email & phone fields not found", message: "email & phone both fields are required", status: 400 })
}

exports.verifyForgotPassword = async (req, res) => {
    let { phone, otp } = req.body
    let theAgentFound2 = await AgentS.getCommonByPhone(phone)
    let findOtpByPhone = await OtpS.findOnly(phone)
    let tempPass = createTempPass()
    if (!findOtpByPhone) return res.status(404).send({ data: "no otp found", message: "there was no active otp found for this phone", status: 404 })
    if (theAgentFound2.data) {
        if (otp == findOtpByPhone.otp) {
            let newPassword = await hashPassword(tempPass)
            let theAgentFound2Update = theAgentFound2.data
            theAgentFound2Update.password = newPassword
            let updatedAgent = await AgentS.updateThisAgent(theAgentFound2Update)
            if (updatedAgent) sendEmail(theAgentFound2.data.email, "new Password Created", tempPass)
            res.status(201).send({ message: "the new password creation process is completed, please check your mail for newPassword", status: 201 })
        }
    }
    return res.status(404).send({ error: "no such account found", message: "the retreived account for this phone is not found", status: 404 })
}

exports.resetPassword = async (req, res) => {
    let { password, confirmPassword, resetPassword, id } = req.body
    console.log(req.body)
    if (!password || !confirmPassword || !resetPassword) return res.status(400).send({ error: "fields missing", message: "please enter all required fields consisting password, confirmPassword, resetPasswprd", status: 404 })
    if (password !== confirmPassword) return res.status(400).send({ error: "passwords do not match", message: "given fields of password & confirmPassword do not match", status: 400 })
    if (resetPassword === "") return res.status(404).send({ error: "reset field is empty", message: "reset field can't be empty", status: 404 })
    let theNewPassword = await hashPassword(resetPassword)
    let foundAccount = await AgentS.getCommonById(id)
    console.log(theNewPassword,foundAccount.data.password)
    foundAccount.data.password = theNewPassword
    let updatedAgent = await AgentS.updateThisAgent(foundAccount.data)
    if (updatedAgent.data) {
        return res.status(updatedAgent.status).send({ message: "password updated successfully", status: updatedAgent.status })
    } else {
        return res.status(updatedAgent.status).send({ error: updatedAgent.error, Message: updatedAgent.message, status: updatedAgent.status })
    }
}