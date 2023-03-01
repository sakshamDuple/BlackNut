const Estimate = require("../Model/Estimate");
const Machine = require("../Model/Machine");
const Products = require("../Model/Product");

exports.updateInDb = async (req, res) => {
    let k = await DBsheet()
    res.send(k)
}

async function DBsheet() {
    let fails = [], successes = []
    let InDb = await Products.find()
    // console.log("InDb",InDb)
    let data = await updateAllAgents(InDb, fails, successes)
    return {fails, successes}
}

let updateAllAgents = (agents, fails, successes) => {
    return new Promise(async function (resolve, reject) {
        Promise.all(
            agents.map(async (element) => {
                // console.log("agents",element)
                return new Promise(async function (resolve, reject) {
                    let ProductIds = []
                    let fail, success;
                    let { _id,machineId } = element;
                    let foundProducts = await Products.find({machineId});
                    // console.log(foundProducts)
                    let foundMachine = await Machine.findById(machineId);
                    foundProducts.forEach(element => {
                        ProductIds.push(element.ProductID)
                    });
                    foundMachine.ProductIDs = ProductIds
                    let updateThisAgent = await Machine.updateOne({ _id:machineId }, { $set: foundMachine })
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
    console.log(agents)
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

// let updateAllAgents = (agents, fails, successes) => {
//     return new Promise(async function (resolve, reject) {
//         Promise.all(
//             agents.map(async (element) => {
//                 return new Promise(async function (resolve, reject) {
//                     let ProductIds = []
//                     let fail, success;
//                     let { _id } = element;
//                     // let foundEstimates = await Estimates.find({_id});
//                     await updateInside(element.Products, fail, success)
//                     let updateThisEstimate = await Estimate.updateOne({ _id:element._id }, { $set: element })
//                     // let foundMachine = await Machine.findById(_id);
//                     // // foundProducts.forEach(element => {
//                     // //     ProductIds.push(element.ProductID)
//                     // // });
//                     // await updateInside()
//                     // foundMachine.ProductIds = ProductIds
//                     // console.log(foundMachine)
//                     // let updateThisAgent = await Machine.updateOne({ _id }, { $set: foundMachine })
//                     console.log(updateThisEstimate)
//                     if (!updateThisEstimate.nModified > 0) {
//                         fails.push(_id);
//                     } else {
//                         successes.push(_id);
//                     }
//                     resolve({ agents, fail, success });
//                 });
//             })
//         ).then((data) => {
//             resolve(data);
//         });
//     });
// };

// let updateInside = (agents, fails, successes) => {
//     return new Promise(async function (resolve, reject) {
//         // console.log(agents)
//         Promise.all(
//             agents.map(async (element) => {
//                 return new Promise(async function (resolve, reject) {
//                     let ProductIds = []
//                     let fail, success;
//                     let { _id, ProductId } = element;
//                     console.log(_id)
//                     let [{machineId}] = await Products.find({_id:ProductId});
//                     let [{Machine_name}] = await Machine.find({_id:machineId});
//                     element.MachineName = Machine_name
//                     resolve({agents, fail, success})
//                     // let foundMachine = await Machine.findById(_id);
//                     // foundProducts.forEach(element => {
//                     //     ProductIds.push(element.ProductID)
//                     // });
//                     // foundMachine.ProductIds = ProductIds
//                     // console.log(foundMachine)
//                     // let updateThisAgent = await Machine.updateOne({ _id }, { $set: foundMachine })
//                     // if (!updateThisAgent.nModified > 0) {
//                     //     fails.push(foundMachine.Product_name);
//                     // } else {
//                     //     successes.push(foundMachine.Product_name);
//                     // }
//                     // resolve({ agents, fail, success });
//                 });
//             })
//         ).then((data) => {
//             resolve(data);
//         });
//     });
// };