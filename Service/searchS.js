const Admin = require("../Model/Admin");
const Agent = require("../Model/Agent");
const Machine = require('../Model/Machine')
const Crop = require('../Model/Crop')
const Estimate = require("../Model/Estimate");
const Product = require("../Model/Product");

exports.searchGlobal = async (search, fieldForSearch, searchQty, collection, type, sortBy, sortVal, multiFieldSearch) => {
    console.log(search, fieldForSearch, searchQty, collection, type, sortBy, sortVal, multiFieldSearch,"paraaaams")
    if (!sortBy) sortBy = "createdAt"
    if (!sortVal) sortBy = 1
    let matchSearch
    let { Collection, queryS, query, querySort, querySearchsort } = this.generateCollectionAndQuerySearch(collection, fieldForSearch, search, type, sortBy, sortVal, multiFieldSearch)
    if (multiFieldSearch) {
        console.log(querySearchsort)
        matchSearch = querySearchsort
    } else {
        matchSearch = [queryS] 
    }
    if (type) {
        agg = [
            {
                '$match': query
            }, {
                '$match': {
                    '$or': matchSearch
                }
            }, {
                '$limit': searchQty
            }, {
                '$sort': { "createdAt": -1 },
            }
        ]
    } else {
        agg = [
            {
                '$match': {
                    '$or': matchSearch
                }
            }, {
                '$limit': searchQty
            }, {
                '$sort': querySort,
            }
        ]
    }
    let result = await Collection.aggregate(agg)
    return { result, status: result.length > 0 ? 200 : 404, message: result.length > 0 ? "response generated" : "not found" }
}
exports.generateCollectionAndQuerySearch = (collection, fieldForSearch, search, type, sortBy, sortVal, multiFieldSearch) => {
    let Collection, queryS, query, querySort
    let multipleField = [], querySearchsort = []
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
    switch (sortBy) {
        case "firstName":
            querySort = { "firstName": parseInt(sortVal) == 1 ? 1 : -1 }
            break;
        case "lastName":
            querySort = { "lastName": parseInt(sortVal) == 1 ? 1 : -1 }
            break;
        case "email":
            querySort = { "email": parseInt(sortVal) == 1 ? 1 : -1 }
            break;
        case "phone":
            querySort = { "phone": parseInt(sortVal) == 1 ? 1 : -1 }
            break;
        case "AgentID":
            querySort = { "AgentID": parseInt(sortVal) == 1 ? 1 : -1 }
            break;
        case "CustomerID":
            querySort = { "CustomerID": parseInt(sortVal) == 1 ? 1 : -1 }
            break;
        case "crop":
            querySort = { "crop": parseInt(sortVal) == 1 ? 1 : -1 }
            break;
        case "EstimateId":
            querySort = { "EstimateId": parseInt(sortVal) == 1 ? 1 : -1 }
            break;
        case "QuotationId":
            querySort = { "QuotationId": parseInt(sortVal) == 1 ? 1 : -1 }
        case "PO_Id":
            querySort = { "PO_Id": parseInt(sortVal) == 1 ? 1 : -1 }
            break;
        case "agentId":
            querySort = { "agentId": parseInt(sortVal) == 1 ? 1 : -1 }
            break;
        case "customerId":
            querySort = { "customerId": parseInt(sortVal) == 1 ? 1 : -1 }
            break;
        case "Agent_Code":
            querySort = { "Agent_Code": parseInt(sortVal) == 1 ? 1 : -1 }
            break;
        case "Machine_name":
            querySort = { "Machine_name": parseInt(sortVal) == 1 ? 1 : -1 }
            break;
        case "Product_name":
            querySort = { "Product_name": parseInt(sortVal) == 1 ? 1 : -1 }
            break;
        case "ProductID":
            querySort = { "ProductID": parseInt(sortVal) == 1 ? 1 : -1 }
            break;
        case "gst":
            querySort = {
                "GST_Number": parseInt(sortVal) == 1 ? 1 : -1
            }
            break;
        case "Company_Name":
            querySort = {
                "Company_Name": parseInt(sortVal) == 1 ? 1 : -1
            }
            break;
        case "pan":
            querySort = [{
                "PAN_Company": parseInt(sortVal) == 1 ? 1 : -1
            }, {
                "PAN_Agent": parseInt(sortVal) == 1 ? 1 : -1
            }]
            break;
        case "createAt":
            querySort = { "createdAt": parseInt(sortVal) == 1 ? 1 : -1 }
            break;
        default:
            querySort = { "createdAt": -1 }
    }
    if (multiFieldSearch) {
        multipleField = multiFieldSearch.split(",")
        multipleField.forEach(element => {
            if (element == "firstName") querySearchsort.push({
                'firstName': new RegExp(search, 'i')
            })
            if (element == "lastName") querySearchsort.push({
                'lastName': new RegExp(search, 'i')
            })
            if (element == "email") querySearchsort.push({
                'email': new RegExp(search, 'i')
            })
            if (element == "phone") querySearchsort.push({
                'phone': new RegExp(search, 'i')
            })
            if (element == "AgentID") querySearchsort.push({
                'AgentID': new RegExp(search, 'i')
            })
            if (element == "CustomerID") querySearchsort.push({
                'CustomerID': new RegExp(search, 'i')
            })
            if (element == "crop") querySearchsort.push({
                'crop': new RegExp(search, 'i')
            })
            if (element == "EstimateId") querySearchsort.push({
                'EstimateId': new RegExp(search, 'i')
            })
            if (element == "QuotationId") querySearchsort.push({
                'QuotationId': new RegExp(search, 'i')
            })
            if (element == "PO_Id") querySearchsort.push({
                'PO_Id': new RegExp(search, 'i')
            })
            if (element == "agentId") querySearchsort.push({
                'agentId': new RegExp(search, 'i')
            })
            if (element == "customerId") querySearchsort.push({
                'customerId': new RegExp(search, 'i')
            })
            if (element == "Agent_Code") querySearchsort.push({
                'Agent_Code': new RegExp(search, 'i')
            })
            if (element == "Machine_name") querySearchsort.push({
                'Machine_name': new RegExp(search, 'i')
            })
            if (element == "Product_name") querySearchsort.push({
                'Product_name': new RegExp(search, 'i')
            })
            if (element == "ProductID") querySearchsort.push({
                'ProductID': new RegExp(search, 'i')
            })
            if (element == "gst") querySearchsort.push({
                'GST_Number': new RegExp(search, 'i')
            })
            if (element == "pan") querySearchsort.push({
                "PAN_Company": new RegExp(search, 'i')
            }, {
                "PAN_Agent": new RegExp(search, 'i')
            })
            if (element == undefined || element == "undefined" || element == null || element == "null") querySearchsort = [{
                'firstName': new RegExp(search, 'i')
            }, {
                'lastName': new RegExp(search, 'i')
            }, {
                'email': new RegExp(search, 'i')
            }, {
                'phone': new RegExp(search, 'i')
            }, {
                'AgentID': new RegExp(search, 'i')
            }, {
                'CustomerID': new RegExp(search, 'i')
            }, {
                'crop': new RegExp(search, 'i')
            }, {
                'EstimateId': new RegExp(search, 'i')
            }, {
                'QuotationId': new RegExp(search, 'i')
            }, {
                'PO_Id': new RegExp(search, 'i')
            }, {
                'agentId': new RegExp(search, 'i')
            }, {
                'customerId': new RegExp(search, 'i')
            }, {
                'Agent_Code': new RegExp(search, 'i')
            }, {
                'Machine_name': new RegExp(search, 'i')
            }, {
                'Product_name': new RegExp(search, 'i')
            }, {
                'ProductID': new RegExp(search, 'i')
            }, {
                'GST_Number': new RegExp(search, 'i')
            }, {
                "PAN_Company": new RegExp(search, 'i')
            }, {
                "PAN_Agent": new RegExp(search, 'i')
            }]
        });
        return { Collection, querySearchsort, query, querySort }
    } else {
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
                break;
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
                break;
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
                break;
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
                break;
            case "ProductID":
                queryS = {
                    "ProductID": new RegExp(search, 'i')
                }
                break;
            case "gst":
                queryS = {
                    "GST_Number": new RegExp(search, 'i')
                }
                break;
            case "Company_Name":
                queryS = {
                    "Company_Name": new RegExp(search, 'i')
                }
                break;
            case "pan":
                queryS = [{
                    "PAN_Company": new RegExp(search, 'i')
                }, {
                    "PAN_Agent": new RegExp(search, 'i')
                }]
                break;
        }
        return { Collection, queryS, query, querySort }
    }
}