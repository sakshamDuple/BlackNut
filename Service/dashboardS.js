const Estimate = require("../Model/Estimate");

const { error } = require("../Middleware/error");


exports.getRecentEstimates = async () => {
    try {


        AllEstimates = await Estimate.find({
            approvalFromAdminAsQuotes: false, approvalFromAdminAsPO: false

        });
        console.log(AllEstimates, "aa");


        const agg = ([
            {
                "$match": {
                    "approvalFromAdminAsQuotes": false,
                    "approvalFromAdminAsPO": false
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "agentId": 1,
                    "createdAt": 1,
                    "TotalCost": {
                        "$sum": "$Products.ProductEstimatedPrice"
                    }

                }
            },
            {
                "$sort": { createdAt: -1 }
            },
            {
                "$limit": 5,
            }
        ]);
        let RecentEstimates = await Estimate.aggregate(agg)

        return {
            data: RecentEstimates,
            message:
                RecentEstimates.length > 0
                    ? "retrieval Success"
                    : "please create some estimates to view",
            status: RecentEstimates.length > 0 ? 200 : 404,
        };


    } catch (e) {
        console.log(e);
        return { error: e, message: "we have an error" };
    }
};
exports.getRecentQuotation = async () => {
    try {


        const agg = ([
            {
                "$match": {
                    "approvalFromAdminAsQuotes": true,
                    "approvalFromAdminAsPO": false
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "agentId": 1,
                    "createdAt": 1,
                    "TotalCost": {
                        "$sum": "$Products.ProductEstimatedPrice"
                    }

                }
            },
            {
                "$sort": { createdAt: -1 }
            },
            {
                "$limit": 5,
            }
        ]);
        let RecentQuotations = await Estimate.aggregate(agg)


        return {
            data: RecentQuotations,
            message:
                RecentQuotations.length > 0
                    ? "retrieval Success"
                    : "please create some estimates to view",
            status: RecentQuotations.length > 0 ? 200 : 404,
        };
    } catch (e) {
        console.log(e);
        return { error: e, message: "we have an error" };
    }
};


exports.getAllRecentPO = async () => {

    try {

        const agg = ([
            {
                "$match": {
                    "approvalFromAdminAsQuotes": false,
                    "approvalFromAdminAsPO": true
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "agentId": 1,
                    "createdAt": 1,
                    "TotalCost": {
                        "$sum": "$Products.ProductEstimatedPrice"
                    }

                }
            },
            {
                "$sort": { createdAt: -1 }
            },
            {
                "$limit": 5,
            }
        ]);
        let RecentPO = await Estimate.aggregate(agg)



        return {
            data: RecentPO,
            message:
                RecentPO.length > 0
                    ? "retrieval Success"
                    : "please convert some to PO to view",
            status: RecentPO.length > 0 ? 200 : 404,
        };
    } catch (e) {
        console.log(e);
        return { error: e, message: "we have an error" };
    }
};


exports.getEstimateCount = async () => {


    const AllEstimates = await Estimate.find({})
    const count = AllEstimates.length
    console.log(count, "couuu")
    return count
}

exports.getQuoteCount = async () => {


    const AllQuotation = await Estimate.find({
        approvalFromAdminAsQuotes: true,
        approvalFromAdminAsPO: false
    })
    const count = AllQuotation.length
    console.log(count, "couuu")
    return count
}

exports.getPoCount = async () => {

    const AllPO = await Estimate.find({
        approvalFromAdminAsQuotes: false,
        approvalFromAdminAsPO: true
    })
    const count = AllPO.length
    console.log(count, "couuu")
    return count
}


exports.AgentWithMostPurchase = async () => {

    try {

        const agg = ([
            {
                "$match": {
                    "approvalFromAdminAsQuotes": false,
                    "approvalFromAdminAsPO": true
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "agentId": 1,
                    "agentName": 1,
                    "createdAt": 1,
                    "TotalCost": {
                        "$sum": "$Products.ProductEstimatedPrice"
                    }

                }
            },
            {
                "$sort": { TotalCost: -1 }
            },
            {
                "$limit": 4,
            }
        ]);
        let Agent = await Estimate.aggregate(agg)


        console.log(Agent, "aa");
        return Agent
    } catch (e) {
        console.log(e);
        return { error: e, message: "we have an error" };
    }
};

exports.AgentQuotations = async () => {


    const agg = ([
        {
            "$match": {
                "approvalFromAdminAsQuotes": true,
                "approvalFromAdminAsPO": false,

            }
        },
        {
            "$project": {
                "_id": 1,
                "agentId": 1,
                "createdAt": 1,
                "TotalCost": {
                    "$sum": "$Products.ProductEstimatedPrice"
                }

            }
        }
    ])


    const k = await Estimate.aggregate(agg)
    return k
}

exports.findAllEst = async () => {

    const agg = ([
        {
            "$project": {
                "_id": 1,
                "agentId": 1,
                "createdAt": 1,
                "TotalCost": {
                    "$sum": "$Products.ProductEstimatedPrice"
                }

            }
        },


    ]);
    let Estimates = await Estimate.aggregate(agg)
    return Estimates

}

exports.getRecentEstimatesOfAgent = async (id) => {


    agentId = id
    // const RecentEstimates = await Estimate.find({
    //   approvalFromAdminAsQuotes: false, agentId, approvalFromAdminAsPO: false
    // });
    const agg = ([
        {
            "$match": {
                "approvalFromAdminAsQuotes": false,
                "approvalFromAdminAsPO": false,
                "agentId": agentId
            }
        },
        {
            "$project": {
                "_id": 1,
                "agentId": 1,
                "createdAt": 1,
                "customerName": 1,
                "TotalCost": {
                    "$sum": "$Products.ProductEstimatedPrice"
                }

            }
        },
        {
            "$sort": { createdAt: -1 }
        },
        {
            "$limit": 5,
        }
    ]);
    let RecentEstimates = await Estimate.aggregate(agg)
    console.log(RecentEstimates, "rr");
    return {
        data: RecentEstimates,
        message:
            RecentEstimates.length > 0
                ? "retrieval Success"
                : "please create some estimates to view",
        status: RecentEstimates.length > 0 ? 200 : 404,
    };

}
exports.getRecentQuotationOfAgent = async (id) => {
    agentId = id
    // const RecentEstimates = await Estimate.find({
    //   approvalFromAdminAsQuotes: false, agentId, approvalFromAdminAsPO: false
    // });
    const agg = ([
        {
            "$match": {
                "approvalFromAdminAsQuotes": true,
                "approvalFromAdminAsPO": false,
                "agentId": agentId
            }
        },
        {
            "$project": {
                "_id": 1,
                "agentId": 1,
                "createdAt": 1,
                "customerName": 1,
                "TotalCost": {
                    "$sum": "$Products.ProductEstimatedPrice"
                }

            }
        },
        {
            "$sort": { createdAt: -1 }
        },
        {
            "$limit": 5,
        }
    ]);
    let RecentQuotations = await Estimate.aggregate(agg)
    console.log(RecentQuotations, "rr");
    return {
        data: RecentQuotations,
        message:
            RecentQuotations.length > 0
                ? "retrieval Success"
                : "please create some estimates to view",
        status: RecentQuotations.length > 0 ? 200 : 404,
    };
}

exports.getRecentPOAgent = async (id) => {


    agentId = id
    // const RecentEstimates = await Estimate.find({
    //   approvalFromAdminAsQuotes: false, agentId, approvalFromAdminAsPO: false
    // });
    const agg = ([
        {
            "$match": {
                "approvalFromAdminAsQuotes": false,
                "approvalFromAdminAsPO": true,
                "agentId": agentId
            }
        },
        {
            "$project": {
                "_id": 1,
                "agentId": 1,
                "createdAt": 1,
                "customerName": 1,
                "TotalCost": {
                    "$sum": "$Products.ProductEstimatedPrice"
                }

            }
        },
        {
            "$sort": { createdAt: -1 }
        },
        {
            "$limit": 5,
        }
    ]);
    let RecentPO = await Estimate.aggregate(agg)
    console.log(RecentPO, "rr");
    return {
        data: RecentPO,
        message:
            RecentPO.length > 0
                ? "retrieval Success"
                : "please create some estimates to view",
        status: RecentPO.length > 0 ? 200 : 404,
    };


}


exports.getEstimateCountOfAgent = async (id) => {
    const agg = ([
        {
            "$match": {
                "approvalFromAdminAsQuotes": false,
                "approvalFromAdminAsPO": false,
                "agentId": id
            }
        },
        {
            "$project": {
                "_id": 1,
                "agentId": 1,
                "createdAt": 1,
                "TotalCost": {
                    "$sum": "$Products.ProductEstimatedPrice"
                }

            }
        },

    ]);
    let k = await Estimate.aggregate(agg)
    const count = k.length
    console.log(count, "couuu")
    return count
}

exports.getQuoteCountOfAgent = async (id) => {
    const agentId = id
    const AllQuotation = await Estimate.find({
        approvalFromAdminAsQuotes: true,
        agentId, approvalFromAdminAsPO: false,
    })
    const count = AllQuotation.length
    console.log(count, "couuu")
    return count
}
exports.getPoCountOfAgent = async (id) => {
    const agentId = id
    const AllPO = await Estimate.find({
        approvalFromAdminAsQuotes: false,
        approvalFromAdminAsPO: true, agentId
    })
    const count = AllPO.length
    console.log(count, "couuu")
    return count
}