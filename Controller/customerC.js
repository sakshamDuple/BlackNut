const CustomerS = require("../Service/CustomerS")

exports.getActiveCustomers = async (req, res) => {
    let theCustomers = await CustomerS.getAllCustomer(true)
    if (theCustomers.status == 200) {
        res.status(theCustomers.status).send({ data: theCustomers.data, Message: theCustomers.message, status: theCustomers.status })
    } else {
        res.status(theCustomers.status).send({ error: theCustomers.error, Message: theCustomers.message, status: theCustomers.status }).status(theCustomers.status)
    }
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
        res.send({ data: updatedCustomer.data, Message: updatedCustomer.message, status: updatedCustomer.status }).status(updatedCustomer.status)
    } else {
        res.send({ error: updatedCustomer.error, Message: updatedCustomer.message, status: updatedCustomer.status }).status(updatedCustomer.status)
    }
}