const { sendEmail } = require("../Middleware/emailSend");
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
        console.log(admin.Address)
        let createdAdmin = await Admin.create(admin)
        sendEmail(admin.email, "Your Admin Account is Registered", "", { Name: admin.firstName })
        // let doMobileRegistration = await VerifiedNumberS.create({ role: admin.role, number: admin.phone, id: createdAgent.id })
        return { AdminId: createdAdmin._id, message: "admin successfully created", status: 201 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error", status: 400 }
    }
}

exports.adminLogin = async ({ email, password, phone }) => {
    if (!password) return { message: "can't login without password", status: 400 }
    if (!email || !phone) return { message: "Please provide either email or phone to login to admin", status: 400 }
    let foundAdmin
    if (email) foundAdmin = await this.findAdmin({ data: email, field: "email" })
    if (!email && phone) foundAdmin = await this.findAdmin({ data: phone, field: "phone" })
    if (foundAdmin == null) return { message: "admin not found", status: 404 }
    return { data: foundAdmin, message: "logged in successfully", status: 200 }
}

exports.findAdmin = async ({ data, field }) => {
    if (field == "email") return await Admin.findOne({ email: data })
    if (field == "phone") return await Admin.findOne({ phone: data })
}

exports.findAdminById = async (id) => {
    return await Admin.findById(id)
}

exports.findAdmins = async (page, limit) => {
    try {
        let totalCount = await Admin.count({ role: "admin" })
        let data
        if (page && limit) {
            start = limit * (page - 1)
            console.log(start, limit)
            data = await Admin.find({ role: "admin" }).skip(start).limit(parseInt(limit))
        } else {
            data = await Admin.find({ role: "admin" })
        }
        return { data, totalCount, message: data.length > 0 ? "list Retrieved" : "No Admin Found", status: data.length > 0 ? 200 : 404 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "error occured", status: 500 }
    }
}

exports.editAdmin = async (_id, { firstName, lastName, phone, mainAddressText, password },feild) => {
    try {
        let thisAdmin = await Admin.findById(_id)
        if (!thisAdmin) return { message: "No Admin Found", status: 404 }
        if (mainAddressText) thisAdmin.Address.mainAddressText = mainAddressText
        if (firstName) thisAdmin.firstName = firstName
        if (lastName) thisAdmin.lastName = lastName
        if (phone) thisAdmin.phone = phone
        if(feild == "login") thisAdmin.login = [Date.now()]
        if(feild == "password") thisAdmin.password = password
        let updateAdmin = await Admin.updateOne({ _id }, { $set: thisAdmin })
        return { update: updateAdmin.nModified > 0, message: updateAdmin.nModified > 0 ? "Updation Done" : "Updation Failed", status: updateAdmin.nModified > 0 ? 200 : 304 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "error occured", status: 500 }
    }
}

exports.deleteAdmin = async (_id) => {
    let deleteAdmin = await Admin.deleteOne({ _id })
    console.log(deleteAdmin)
    return { delete: deleteAdmin.deletedCount > 0, message: deleteAdmin.deletedCount > 0 ? "Deletion Done" : "Deletion Failed", status: deleteAdmin.deletedCount > 0 ? 200 : 400 }
}