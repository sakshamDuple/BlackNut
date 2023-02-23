const Machine = require("../Model/Machine");
const Products = require("../Model/Product");

exports.updateInDb = async (req, res) => {
    let k = await DBsheet()
    res.send(k)
}

async function DBsheet() {
    let fails = [], successes = []
    let InDb = await Machine.find()
    let data = await updateAllAgents(InDb, fails, successes)
    return {fails, successes}
}

let updateAllAgents = (agents, fails, successes) => {
    return new Promise(async function (resolve, reject) {
        Promise.all(
            agents.map(async (element) => {
                return new Promise(async function (resolve, reject) {
                    let ProductIds = []
                    let fail, success;
                    let { _id } = element;
                    let foundProducts = await Products.find({machineId:_id});
                    let foundMachine = await Machine.findById(_id);
                    // foundProducts.forEach(element => {
                    //     ProductIds.push(element.ProductID)
                    // });
                    await updateInside()
                    foundMachine.ProductIds = ProductIds
                    console.log(foundMachine)
                    let updateThisAgent = await Machine.updateOne({ _id }, { $set: foundMachine })
                    if (!updateThisAgent.nModified > 0) {
                        fails.push(foundMachine.Product_name);
                    } else {
                        successes.push(foundMachine.Product_name);
                    }
                    resolve({ agents, fail, success });
                });
            })
        ).then((data) => {
            resolve(data);
        });
    });
};

let updateInside = (agents, fails, successes) => {
    return new Promise(async function (resolve, reject) {
        Promise.all(
            agents.map(async (element) => {
                return new Promise(async function (resolve, reject) {
                    let ProductIds = []
                    let fail, success;
                    let { _id } = element;
                    let foundProducts = await Products.find({machineId:_id});
                    let foundMachine = await Machine.findById(_id);
                    foundProducts.forEach(element => {
                        ProductIds.push(element.ProductID)
                    });
                    foundMachine.ProductIds = ProductIds
                    console.log(foundMachine)
                    let updateThisAgent = await Machine.updateOne({ _id }, { $set: foundMachine })
                    if (!updateThisAgent.nModified > 0) {
                        fails.push(foundMachine.Product_name);
                    } else {
                        successes.push(foundMachine.Product_name);
                    }
                    resolve({ agents, fail, success });
                });
            })
        ).then((data) => {
            resolve(data);
        });
    });
};