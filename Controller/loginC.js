const { createTempPass } = require("../Middleware/createTemporaryPassword")
const { sendEmail } = require("../Middleware/emailSend")
const { generateOtp } = require("../Middleware/genOtp")
const { generateAccessToken } = require("../Middleware/jwtSign")
const { hashCompare, hashPassword } = require("../Middleware/salt")
const TempOtp = require("../Model/TempOtp")
const AgentS = require("../Service/AgentS")
const AdminS = require("../Service/adminS")
const OtpS = require("../Service/OtpS")
const { sendOTPonPhone } = require("../Middleware/passOtp")

// exports.loginAgent = async (req,res) => {
//     console.log("hii")
//     res.send("hii")
// }

exports.commonlogin = async (req, res) => {
    let { phone, email, password } = req.body
    let theAgentFound
    if (!password) return res.status(404).send({ error: "password field can't be empty", message: "please provide password to login", status: 400 })
    if (!email && !phone) return res.status(404).send({ error: "email or phone field can't be empty", message: "please provide either email or phone to login", status: 400 })
    if (email && password) {
        theAgentFound = await AgentS.getCommonByEmail(email)
        if(theAgentFound.data.status == "PENDING" || theAgentFound.data.status == "INACTIVE"){
            return res.status(400).json({ error: "can't log in", message: "Your Account is currently INACTIVE or Waiting for admins Approval, You Can't login to this Account", status: 400 })
        }
        let compare = await hashCompare(password, theAgentFound.data.password)
        if (!compare) return res.status(400).send({ error: "password not matched", message: "password to the given email is not matched", status: 400 })
        await AgentS.updateThisAgent(theAgentFound.data,"login")
        let accessToken = generateAccessToken({ role: theAgentFound.data.role, firstName: theAgentFound.data.firstName, lastName: theAgentFound.data.lastName, phone: theAgentFound.data.phone, email: theAgentFound.data.email, id: theAgentFound.data._id })
        res.setHeader("Authorization", accessToken)
        res.status(201).json({ Authorization:accessToken, message: "login success", status: 201 })
    } else if (phone && password) {
        theAgentFound = await AgentS.getCommonByPhone(phone)
        if(theAgentFound.data != null){
            if(theAgentFound.data.status == "PENDING" || theAgentFound.data.status == "INACTIVE")
            return res.status(400).json({ error: "can't log in", message: "Your Account is currently INACTIVE or Waiting for admins Approval, You Can't login to this Account", status: 400 })
        }
        if (theAgentFound.data == null) return res.status(theAgentFound.status).json({ message: theAgentFound.message, status: theAgentFound.status })
        let compare = await hashCompare(password, theAgentFound.data.password)
        if (!compare) return res.status(400).json({ error: "password not matched", message: "password to the given phone is not matched", status: 400 })
        await AgentS.updateThisAgent(theAgentFound.data,"login")
        let accessToken = generateAccessToken({ role: theAgentFound.data.role, firstName: theAgentFound.data.firstName, lastName: theAgentFound.data.lastName, phone: theAgentFound.data.phone, email: theAgentFound.data.email, id: theAgentFound.data._id })
        res.setHeader("Authorization", accessToken)
        res.status(201).json({ Authorization:accessToken, message: "login success", status: 201 })
    }
}

exports.forgotPassword = async (req, res) => {
    let { email } = req.body
    if (email) {
        let theAgentFound1 = await AgentS.getCommonByEmail(email)
        // let theAgentFound2 = await AgentS.getCommonByPhone(phone)
        if (!theAgentFound1.data
            // || !theAgentFound2.data
        ) return res.status(404).json({ message: "agents not found", status: 404 })
        // console.log(theAgentFound2)
        if (theAgentFound1.data._id.toString()) {
            let otp = generateOtp()
            await OtpS.deleteOnly(theAgentFound1.data.phone)
            let genTempOtpOnDB = await OtpS.create({
                number: theAgentFound1.data.phone,
                id: theAgentFound1.data._id.toString(),
                otp: otp
            })
            let details={Name:theAgentFound1.data.firstName}
            await sendEmail(email, "password change request otp", otp, details)
            let otpSent = await sendOTPonPhone("CustomerLink",otp,theAgentFound1.data.phone)
            if(otpSent.status != 200) return res.status(otpSent.status).send(otpSent)
            return res.status(200).send({ data: { phone: theAgentFound1.data.phone }, message: "an otp is sent on your mail, please create new password after verifying otp", status: 200 })
        }
        // return res.status(400).send({ data: "accounts from phone & email do not match", message: "the retreived accounts for email & phone are not macthed", status: 400 })
    }
    else return res.status(400).send({ error: "email field not found", message: "email field is required", status: 400 })
}

exports.verifyForgotPassword = async (req, res) => {
    let { phone, otp } = req.body
    let theAgentFound2 = await AgentS.getCommonByPhone(phone)
    console.log(theAgentFound2.data)
    let findOtpByPhone = await OtpS.findOnly(phone)
    console.log(findOtpByPhone)
    let tempPass = createTempPass()
    if (!findOtpByPhone) return res.status(404).send({ data: "no otp found", message: "there was no active otp found for this phone", status: 404 })
    if (theAgentFound2.data) {
        if (otp == findOtpByPhone.otp) {
            console.log("\n\n\n newPass \n\n\n", tempPass)
            let newPassword = await hashPassword(tempPass)
            console.log("\n\n\n newPass \n\n\n", newPassword)
            let theAgentFound2Update = theAgentFound2.data
            theAgentFound2Update.password = newPassword
            console.log(theAgentFound2Update)
            let updatedAgent = await AgentS.updateThisAgent(theAgentFound2Update, "password")
            console.log(updatedAgent)
            if (updatedAgent) sendEmail(theAgentFound2.data.email, "new Password Created", tempPass)
            res.status(201).send({ message: "the new password creation process is completed, please check your mail for newPassword", status: 201 })
            await OtpS.deleteOnly(phone)
        }
    }
    return res.status(404).send({ error: "no such account found", message: "the retreived account for this phone is not found", status: 404 })
}

exports.resetPassword = async (req, res) => {
    let { password, confirmPassword, resetPassword, id } = req.body
    if (!password || !confirmPassword || !resetPassword) return res.status(400).send({ error: "fields missing", message: "please enter all required fields consisting password, confirmPassword, resetPasswprd", status: 404 })
    if (resetPassword !== confirmPassword) return res.status(400).send({ error: "reset passwords do not match", message: "given fields of resetPassword & confirmPassword do not match", status: 400 })
    if (resetPassword === "") return res.status(404).send({ error: "reset field is empty", message: "reset field can't be empty", status: 404 })
    let theNewPassword = await hashPassword(resetPassword)
    let foundAccount = await AgentS.getCommonById(id)
    if (!foundAccount.data) return res.status(404).send({ message: `no such account found for the id: ${id}`, status: 404 })
    let checkPrevPass = await hashCompare(password, foundAccount.data.password)
    if (!checkPrevPass) return res.status(404).send({ message: `Previous password is not matched with the account`, status: 404 })
    console.log(foundAccount)
    let updatedAgent = await AgentS.updateThisAgent({ password: theNewPassword, _id: id }, "password")
    if (updatedAgent.data) {
        return res.status(updatedAgent.status).send({ message: "password updated successfully", status: updatedAgent.status })
    } else {
        return res.status(updatedAgent.status).send({ error: updatedAgent.error, message: updatedAgent.message, status: updatedAgent.status })
    }
}

exports.adminLogin = async (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let phone = req.body.phone
    let match = true
    let adminFound = await AdminS.adminLogin({ email, password, phone })
    if(adminFound.status == 400) return res.status(adminFound.status).send(adminFound)
    if (adminFound) match = await hashCompare(password, adminFound.data.password)
    if (match && adminFound.status != 400) {
        await AdminS.editAdmin(adminFound.data._id,{},"login")
        let accessToken = generateAccessToken({ role: adminFound.data.role, firstName: adminFound.data.firstName, lastName: adminFound.data.lastName, phone: adminFound.data.phone, email: adminFound.data.email, id: adminFound.data._id })
        res.setHeader("Authorization", accessToken)
        res.status(adminFound.status).send({ Authorization:accessToken, message: adminFound.message, status: adminFound.status })
    }
    return res.status(match ? adminFound.status : 400).send({ error: adminFound.error, message: match ? adminFound.message : "Your Password is Invalid", status: match ? adminFound.status : 400 })
}

exports.resetPasswordAdmin = async (req, res) => {
    let { password, confirmPassword, resetPassword, id } = req.body
    if (!password || !confirmPassword || !resetPassword) return res.status(400).send({ error: "fields missing", message: "please enter all required fields consisting password, confirmPassword, resetPasswprd", status: 404 })
    if (resetPassword !== confirmPassword) return res.status(400).send({ error: "reset passwords do not match", message: "given fields of resetPassword & confirmPassword do not match", status: 400 })
    if (resetPassword === "") return res.status(404).send({ error: "reset field is empty", message: "reset field can't be empty", status: 404 })
    let theNewPassword = await hashPassword(resetPassword)
    let foundAdmin = await AdminS.findAdminById(id)
    if (!foundAdmin) return res.status(404).send({ message: `no such admin account found for the id: ${id}`, status: 404 })
    let checkPrevPass = await hashCompare(password, foundAdmin.password)
    if (!checkPrevPass) return res.status(404).send({ message: `Previous password is not matched with the account`, status: 404 })
    let updatedAdmin = await AdminS.editAdmin(id, { password: theNewPassword }, "password")
    if (updatedAdmin.update) {
        return res.status(updatedAdmin.status).send({ message: "password updated successfully", status: updatedAdmin.status })
    } else {
        return res.status(updatedAdmin.status).send({ error: updatedAdmin.error, message: updatedAdmin.message, status: updatedAdmin.status })
    }
}

exports.verifyForgotPasswordAdmin = async (req, res) => {
    let { phone, otp } = req.body
    let theAdminFound = await AdminS.findAdmin({data:phone,field:"phone"})
    let findOtpByPhone = await OtpS.findOnly(phone)
    let tempPass = createTempPass()
    if (!findOtpByPhone) return res.status(404).send({ data: "no otp found", message: "there was no active otp found for this phone", status: 404 })
    if (theAdminFound) {
        if (otp == findOtpByPhone.otp) {
            console.log("\n\n\n newPass \n\n\n", tempPass)
            let newPassword = await hashPassword(tempPass)
            console.log("\n\n\n newPass \n\n\n", newPassword)
            let theAgentFound2Update = theAdminFound
            console.log(newPassword)
            theAgentFound2Update.password = newPassword
            let updatedAgent = await AdminS.editAdmin(theAgentFound2Update._id, { password: theAgentFound2Update.password }, "password")
            let details={Name:theAdminFound.firstName}
            if (updatedAgent) sendEmail(theAdminFound.email, "new Password Created", tempPass, details)
            res.status(201).send({ message: "the new password creation process is completed, please check your mail for newPassword", status: 201 })
            await OtpS.deleteOnly(phone)
        }
    }
    return res.status(404).send({ error: "no such account found", message: "the retreived account for this phone is not found", status: 404 })
}

exports.forgotPasswordAdmin = async (req, res) => {
    let { email } = req.body
    if (email) {
        let theAdminFound = await AdminS.findAdmin({data:email,field:"email"})
        if (!theAdminFound) return res.status(404).json({ message: "Admin not found", status: 404 })
        if (theAdminFound._id.toString()) {
            let otp = generateOtp()
            await OtpS.deleteOnly(theAdminFound.phone)
            let genTempOtpOnDB = await OtpS.create({
                number: theAdminFound.phone,
                id: theAdminFound._id.toString(),
                otp: otp
            })
            let details={Name:theAdminFound.firstName}
            await sendEmail(email, "password change request otp", otp, details)
            return res.status(200).send({ data: { phone: theAdminFound.phone }, message: "an otp is sent on your mail, please create new password after verifying otp", status: 200 })
        }
        // return res.status(400).send({ data: "accounts from phone & email do not match", message: "the retreived accounts for email & phone are not macthed", status: 400 })
    }
    else return res.status(400).send({ error: "email field not found", message: "email field is required", status: 400 })
}