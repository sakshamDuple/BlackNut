const { sendEmail, SuperAdminEmail } = require("../Middleware/emailSend");
const { hashPassword } = require("../Middleware/salt");
const Agent = require("../Model/Agent");
const VerifiedNumberS = require("../Service/verifyNumberS")
require('dotenv').config();

exports.create = async (customer) => {
    delete customer.role
    customer.role = "customer"
    let newcustomer = { ...customer }
    try {
        // let agentExistsWithSuchEmail = await Agent.findOne({ email: customer.email })
        let phoneAlreadyRegistered = await VerifiedNumberS.findOnly(customer.phone)
        // if (agentExistsWithSuchEmail) {
        //     return { error: "id already exists", message: "an id already exists with given email, please provide some other email", status: 409 }
        // }
        if (phoneAlreadyRegistered) {
            return { error: "mobile already registered", message: "Customer is already registered with this mobile!", status: 409 }
        }
        if (customer.password == customer.confirmPassword) {
            console.log("Hii")
            delete newcustomer.confirmPassword
            console.log(await hashPassword(customer.password))
            newcustomer.password = await hashPassword(customer.password)
            newcustomer.AgentNo = await getValueForNextSequence()
            console.log(newcustomer.AgentNo)
            newcustomer.CustomerID = "C_" + newcustomer.AgentNo
            // process.env.DATABASE_URL
        } else {
            return { error: "password doesn't match", message: "please provide matching password & confirm password", status: 401 }
        }
        let createdAgent = await Agent.create(newcustomer)
        let doMobileRegistration = await VerifiedNumberS.create({ role: customer.role, number: customer.phone, id: createdAgent.id })
        await sendEmail(customer.email, "Your Customer Account is Registered", "", { Name: newcustomer.firstName })
        await sendEmail(SuperAdminEmail, "New Customer Account is Registered", "", { Name: "Super Admin", agentId:newcustomer.CustomerID })
        return { Agent_ID: createdAgent._id, data: createdAgent.data, message: "Customer added to Estimate Successfully!", status: 201 }
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

exports.getAllCustomer = async (bool, page, limit) => {
    try {
        let allCustomers, query
        query = { role: "customer" }
        if (bool) query = { role: "customer", status: "ACTIVE" }
        totalCount = await Agent.count(query)
        console.log(page,limit,totalCount)
        if (page && limit) {
            start = limit * (page - 1)
            allCustomers = await Agent.find(query).skip(start).limit(parseInt(limit))
        } else {
            allCustomers = await Agent.find(query)
        } //.skip(1).limit(2)
        return { data: allCustomers, totalCount, message: allCustomers.length > 0 ? "retrieval Success" : "please upload some customer to view", status: allCustomers.length > 0 ? 200 : 404 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error", status: 400 }
    }
}

exports.getCustomerToShowById = async (id, bool) => {
    try {
        let theCustomer
        theCustomer = await Agent.findOne({ _id: id, role: "customer" })
        if (bool) theCustomer = await Agent.findOne({ _id: id, role: "customer", status: "Active" })
        let { role, firstName, lastName, phone, email, createdAt, Company_Name, GST_Number, PAN_Company, PAN_Agent, Address } = theCustomer
        let customerToShow = { role, firstName, lastName, phone, email, createdAt, Company_Name, GST_Number, PAN_Company, PAN_Agent, Address }
        return { data: customerToShow, message: "retrieval Success", status: 201 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error", status: 400 }
    }
}

// exports.getCustomerByEmail = async (email, bool) => {
//     try {
//         let theCustomer
//         if (bool) theCustomer = await Agent.findOne({ email: email, role: "customer", status: "Active" })
//         theCustomer = await Agent.findOne({ email: email, role: "customer" })
//         return { data: theCustomer, message: "retrieval Success", status: 201 }
//     } catch (e) {
//         console.log(e)
//         return { error: e, message: "we have an error" }
//     }
// }

// exports.getCustomerByPhone = async (phone, bool) => {
//     try {
//         let theCustomer
//         if (bool) theCustomer = await Agent.findOne({ phone: phone, role: "customer", status: "Active" })
//         theCustomer = await Agent.findOne({ phone: phone, role: "customer" })
//         return { data: theCustomer, message: "retrieval Success", status: 201 }
//     } catch (e) {
//         console.log(e)
//         return { error: e, message: "we have an error" }
//     }
// }

exports.deleteCustomerById = async (id) => {
    try {
        let theCustomer = await Agent.findOne({ _id: id, role: "customer" })
        let theNumberToDelete = parseInt(theCustomer.phone)
        let theCustomerToDelete = await Agent.deleteOne(theCustomer)
        VerifiedNumberS.deleteOnly(theNumberToDelete)
        return { data: theCustomerToDelete, message: "deleted Successfully", status: 202 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error" }
    }
}

exports.updateThisCustomer = async (customer) => {
    try {
        let prevCustomer = await Agent.findOne(customer._id) //to Check For Future Conditions
        let newCustomer = { ...customer }
        let updateThisCustomer = await Agent.updateOne({ _id: customer._id, role: "customer" }, { $set: newCustomer })
        return { data: updateThisCustomer.nModified > 0, message: updateThisCustomer.nModified > 0 ? "updated Successfully" : "failed", status: updateThisCustomer.nModified > 0 ? 200 : 400 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "we have an error" }
    }
}