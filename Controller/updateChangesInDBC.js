const Agent = require("../Model/Agent");

exports.updateInDb = async (req, res) => {
    let k = await DBsheet()
    res.send(k)
}

async function DBsheet() {
    let fails = [], successes = []
    let InDb = await Agent.find()
    let data = await updateAllAgents(InDb, fails, successes)
    return {fails, successes}
}

let updateAllAgents = (agents, fails, successes) => {
    return new Promise(async function (resolve, reject) {
        Promise.all(
            agents.map(async (element) => {
                return new Promise(async function (resolve, reject) {
                    let fail, success;
                    let { firstName, lastName, _id } = element;
                    let foundAgent = await Agent.findById(_id);
                    foundAgent.fullName = firstName + " " + lastName
                    let updateThisAgent = await Agent.updateOne({ _id }, { $set: foundAgent })
                    if (!updateThisAgent.nModified > 0) {
                        fails.push(foundAgent.fullName);
                    } else {
                        successes.push(foundAgent.fullName);
                    }
                    resolve({ agents, fail, success });
                });
            })
        ).then((data) => {
            resolve(data);
        });
    });
};