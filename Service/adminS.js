const { hashPassword } = require("../Middleware/salt");
const Admin = require("../Model/Admin");
const VerifiedNumberS = require("../Service/verifyNumberS")
require('dotenv').config();

exports.create = async (admin) => {
    try {
        if (admin.password == admin.confirmPassword) {
            delete admin.confirmPassword
            admin.password = await hashPassword(admin.password)
        } else {
            return { error: "password doesn't match", message: "please provide matching password & confirm password", status: 401 }
        }
        let createdAdmin = await Admin.create(admin)
        // let doMobileRegistration = await VerifiedNumberS.create({ role: admin.role, number: admin.phone, id: createdAgent.id })
        return { AdminId: createdAgent._id, message: "admin successfully created", status: 201 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error" }
    }
}