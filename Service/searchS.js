const Admin = require("../Model/Admin");
const Agent = require("../Model/Agent");
const Machine = require('../Model/Machine')
const Crop = require('../Model/Crop')
const Estimate = require("../Model/Estimate");
const Product = require("../Model/Product");

exports.searchGlobal = async (search, fieldForSearch, searchQty, collection, type) => {
    let { Collection, queryS, query } = this.generateCollectionAndQuerySearch(collection, fieldForSearch, search, type)
    if (type) {
        agg = [
            {
                '$match': query
            }, {
                '$match': {
                    '$or': [
                        queryS
                    ]
                }
            },{
                '$limit': searchQty
            },{
                '$sort': { "createdAt": -1 },
            }
        ]
    } else {
        agg = [
            {
                '$match': {
                    '$or': [
                        queryS
                    ]
                }
            }, {
                '$limit': searchQty
            }, {
                '$sort': { "createdAt": -1 },
            }
        ]
    }
    let result = await Collection.aggregate(agg)
    return { result, status: result.length > 0 ? 200 : 404, message: result.length > 0 ? "response generated" : "not found" }
}
exports.generateCollectionAndQuerySearch = (collection, fieldForSearch, search, type) => {
    let Collection, queryS, query
    switch (collection) {
        case "Admin":
            Collection = Admin
            if (type == "admin") {
                query = { role: "admin" }
            } else {
                query = { role: "superadmin" }
            }
            break;
        case "Agent":
            Collection = Agent
            if (type == "customer") {
                query = { role: "customer" }
            } else {
                query = { role: "agent" }
            }
            break;
        case "Machine":
            Collection = Machine
            break;
        case "Crop":
            Collection = Crop
            break;
        case "Estimate":
            Collection = Estimate
            break;
        case "Product":
            Collection = Product
            break;
    }
    switch (fieldForSearch) {
        case "firstName":
            queryS = {
                'firstName': new RegExp(search, 'i')
            }
            break;
        case "lastName":
            queryS = {
                "lastName": new RegExp(search, 'i')
            }
            break;
        case "email":
            queryS = {
                "email": new RegExp(search, 'i')
            }
            break;
        case "phone":
            queryS = {
                "phone": new RegExp(search, 'i')
            }
            break;
        case "AgentID":
            queryS = {
                "AgentID": new RegExp(search, 'i')
            }
            break;
        case "CustomerID":
            queryS = {
                "CustomerID": new RegExp(search, 'i')
            }
        case "crop":
            queryS = {
                "crop": new RegExp(search, 'i')
            }
            break;
        case "EstimateId":
            queryS = {
                "EstimateId": new RegExp(search, 'i')
            }
            break;
        case "QuotationId":
            queryS = {
                "QuotationId": new RegExp(search, 'i')
            }
        case "PO_Id":
            queryS = {
                "PO_Id": new RegExp(search, 'i')
            }
            break;
        case "agentId":
            queryS = {
                "agentId": new RegExp(search, 'i')
            }
            break;
        case "customerId":
            queryS = {
                "customerId": new RegExp(search, 'i')
            }
        case "Agent_Code":
            queryS = {
                "Agent_Code": new RegExp(search, 'i')
            }
            break;
        case "Machine_name":
            queryS = {
                "Machine_name": new RegExp(search, 'i')
            }
            break;
        case "Product_name":
            queryS = {
                "Product_name": new RegExp(search, 'i')
            }
        case "ProductID":
            queryS = {
                "ProductID": new RegExp(search, 'i')
            }
            break;
    }
    return { Collection, queryS, query }
}