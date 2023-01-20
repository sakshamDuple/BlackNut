const { hashPassword } = require("../Middleware/salt");
const Admin = require("../Model/Admin");
const VerifiedNumberS = require("../Service/verifyNumberS")
require('dotenv').config();

exports.create = async (admin) => {
    try {
        let existingAdmin = await Admin.findOne({ email: admin.email })
        if (existingAdmin) return { message: "admin with same email already exist", status: 409 }
        if (admin.password == admin.confirmPassword) {
            delete admin.confirmPassword
            admin.password = await hashPassword(admin.password)
        } else {
            return { error: "password doesn't match", message: "please provide matching password & confirm password", status: 401 }
        }
        let createdAdmin = await Admin.create(admin)
        // let doMobileRegistration = await VerifiedNumberS.create({ role: admin.role, number: admin.phone, id: createdAgent.id })
        return { AdminId: createdAdmin._id, message: "admin successfully created", status: 201 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error", status: 400 }
    }
}

exports.adminLogin = async ({ email, password, phone }) => {
    if (!password) return { message: "can't login without password", status: 400 }
    if (!email && !phone) return { message: "please provide either email or phone to login to admin", status: 400 }
    let foundAdmin
    if (email) foundAdmin = await this.findAdmin({ data:email, field: "email" })
    if (!email && phone) foundAdmin = await this.findAdmin({ data:phone, field: "phone" })
    if (foundAdmin == null) return { message: "admin not found", status: 404 }
    return { data: foundAdmin, message: "logged in successfully", status: 200 }
}

exports.findAdmin = async ({ data, field }) => {
    if (field == "email") return await Admin.findOne({ email: data })
    if (field == "phone") return await Admin.findOne({ phone: data })
}