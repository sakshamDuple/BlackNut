const Machine = require('../Model/Machine')
const CropS = require('./CropS')

exports.create = async (data) => {
    try {
        let { Machine_name, Product_name, cropId } = data
        let foundMachine = await this.findMachine(Machine_name)
        if (foundMachine.data == null) {
            let machine = await Machine.create({ Machine_name, Product_name, cropId: cropId })
            return { data: machine, message: "machine created successfully", status: 201 }
        }
        return { message: "machine can't be created, corresponding crop doesn't exists", status: 400 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "machine can't be created, got in some issue", status: 400 }
    }
}

exports.findMachine = async (data) => {
    try {
        let foundMachine = await Machine.findOne({ Machine_name: data.Machine_name })
        return { data: foundMachine, message: foundMachine ? "retrieval Success" : "not found", status: foundMachine ? 200 : 404 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "machine be retrieved, got in some issue", status: 400 }
    }
}

exports.findMachineById = async (id) => {
    try {
        let foundMachine = await Machine.findById(id)
        return { data: foundMachine, message: foundMachine ? "retrieval Success" : "not found", status: foundMachine ? 200 : 404 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "machine be retrieved, got in some issue", status: 400 }
    }
}

exports.getAllCMachines = async () => {
    try {
        return { data: await Machine.find(), message: "retrieval Success", status: 200 }
    } catch (e) {
        console.log(e)
        return { error: e, message: "machine be retrieved, got in some issue", status: 400 }
    }
}