const Admin = require("../Model/Admin");
const Agent = require("../Model/Agent");
const Machine = require("../Model/Machine");
const Crop = require("../Model/Crop");
const Estimate = require("../Model/Estimate");
const Product = require("../Model/Product");

exports.searchGlobal = async (
  search,
  fieldForSearch,
  searchQty,
  collection,
  type,
  sortBy,
  sortVal,
  multiFieldSearch,
  agentId,
  typeOfEstimate
) => {
  if (!sortBy) sortBy = "createdAt";
  console.log("sortBy,sortVal", sortBy, sortVal)
  if (!sortVal) sortBy = 1;
  let matchSearch;
  let { Collection, queryS, query, querySort, querySearchsort, TOE } =
    this.generateCollectionAndQuerySearch(
      collection,
      fieldForSearch,
      search,
      type,
      sortBy,
      sortVal,
      multiFieldSearch,
      typeOfEstimate
    );
  if (multiFieldSearch) {
    matchSearch = querySearchsort;
  } else {
    matchSearch = [queryS];
  }
  console.log(matchSearch)
  if (type) {
    agentId != undefined || (agentId != "" && collection == Estimate)
      ? (agg = [
        {
          $match: TOE
        },
        {
          $match: { agentId },
        },
        {
          $match: query,
        },
        {
          $match: {
            $or: matchSearch,
          },
        },
        {
          $limit: searchQty,
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
      : (agg = [
        {
          $match: TOE
        },
        {
          $match: query,
        },
        {
          $match: {
            $or: matchSearch,
          },
        },
        {
          $limit: searchQty,
        },
        {
          $sort: { createdAt: -1 },
        },
      ]);
  } else {
    console.log(
      "matchSearch,searchQty,querySort",
      matchSearch,
      searchQty,
      querySort
    );
    agentId != undefined || (agentId != "" && collection == Estimate)
      ? (agg = [
        {
          $match: TOE
        },
        {
          $match: { agentId },
        },
        {
          $match: {
            $or: matchSearch,
          },
        },
        {
          $limit: searchQty,
        },
        {
          $sort: querySort,
        },
      ])
      : (agg = [
        {
          $match: TOE
        },
        {
          $match: {
            $or: matchSearch,
          },
        },
        {
          $limit: searchQty,
        },
        {
          $sort: querySort,
        },
      ]);
  }
  let result = await Collection.aggregate(agg);
  return {
    result,
    totalCount: result.length,
    status: result.length > 0 ? 200 : 404,
    message: result.length > 0 ? "response generated" : "not found",
  };
};
exports.generateCollectionAndQuerySearch = (
  collection,
  fieldForSearch,
  search,
  type,
  sortBy,
  sortVal,
  multiFieldSearch,
  typeOfEstimate
) => {
  let Collection, queryS, query, querySort, nameSearch
  let TOE = {};
  let multipleField = [], nameSearchQuery = [], querySearchsort = [];
  switch (collection) {
    case "Admin":
      Collection = Admin;
      if (type == "admin") {
        query = { role: "admin" };
      } else {
        query = { role: "superadmin" };
      }
      break;
    case "Agent":
      Collection = Agent;
      if (type == "customer") {
        query = { role: "customer" };
      } else {
        query = { role: "agent" };
      }
      break;
    case "Machine":
      Collection = Machine;
      break;
    case "Crop":
      Collection = Crop;
      break;
    case "Estimate":
      Collection = Estimate;
      switch (typeOfEstimate) {
        case 'Estimate':
          TOE = {
            approvalFromAdminAsQuotes: false,
            approvalFromAdminAsPO: false
          }
          break;
        case 'Quotation':
          TOE = {
            approvalFromAdminAsQuotes: true,
            approvalFromAdminAsPO: false
          }
          break;
        case 'PO':
          TOE = {
            approvalFromAdminAsQuotes: false,
            approvalFromAdminAsPO: true
          }
          break;
      }
      break;
    case "Product":
      Collection = Product;
      break;
  }
  switch (sortBy) {
    case "firstName":
      querySort = { firstName: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "lastName":
      querySort = { lastName: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "name":
      querySort = { firstName: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "fullName":
      querySort = { fullName: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "email":
      querySort = { email: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "phone":
      querySort = { phone: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "AgentID":
      querySort = { AgentID: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "CustomerID":
      querySort = { CustomerID: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "Company_Name":
      querySort = { Company_Name: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "crop":
      querySort = { crop: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "EstimateId":
      querySort = { EstimateId: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "QuotationId":
      querySort = { QuotationId: parseInt(sortVal) == 1 ? 1 : -1 };
    case "PO_Id":
      querySort = { PO_Id: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "agentId":
      querySort = { agentId: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "customerId":
      querySort = { customerId: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "Agent_Code":
      querySort = { Agent_Code: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "Machine_name":
      querySort = { Machine_name: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "Product_name":
      querySort = { Product_name: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "ProductID":
      querySort = { ProductID: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "gst":
      querySort = {
        GST_Number: parseInt(sortVal) == 1 ? 1 : -1,
      };
      break;
    case "Company_Name":
      querySort = {
        Company_Name: parseInt(sortVal) == 1 ? 1 : -1,
      };
      break;
    case "pan":
      querySort = [
        {
          PAN_Company: parseInt(sortVal) == 1 ? 1 : -1,
        },
        {
          PAN_Agent: parseInt(sortVal) == 1 ? 1 : -1,
        },
      ];
      break;
    case "createAt":
      querySort = { createdAt: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "agentName":
      querySort = { agentName: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "customerName":
      querySort = { customerName: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    case "customerPhone":
      querySort = { customerPhone: parseInt(sortVal) == 1 ? 1 : -1 };
      break;
    default:
      querySort = { createdAt: -1 };
  }
  let regex = new RegExp(search, "i")
  if (multiFieldSearch) {
    multipleField = multiFieldSearch.split(",");
    multipleField.forEach((element) => {
      if (element == "firstName")
        querySearchsort.push({
          firstName: regex,
        });
      if (element == "fullName")
        querySearchsort.push({
          fullName: regex,
        });
      if (element == "name") {
        nameSearch = search.split(" ")
        nameSearch.forEach(element => {
          nameSearchQuery.push({
            '$or': [{
              'firstName': new RegExp(element, 'i')
            }, {
              'lastName': new RegExp(element, 'i')
            }]
          })
        });
        querySearchsort.push({
            '$and': nameSearchQuery
          });
      }
      if (element == "lastName")
        querySearchsort.push({
          lastName: regex,
        });
      if (element == "email")
        querySearchsort.push({
          email: regex,
        });
      if (element == "phone")
        querySearchsort.push({
          phone: regex,
        });
      if (element == "AgentID")
        querySearchsort.push({
          AgentID: regex,
        });
      if (element == "CustomerID")
        querySearchsort.push({
          CustomerID: regex,
        });
      if (element == "Company_Name")
        querySearchsort.push({
          Company_Name: regex,
        });
      if (element == "crop")
        querySearchsort.push({
          crop: regex,
        });
      if (element == "EstimateId")
        querySearchsort.push({
          EstimateId: regex,
          approvalFromAdminAsPO: false,
          approvalFromAdminAsQuotes: false
        });
      if (element == "QuotationId")
        querySearchsort.push({
          QuotationId: regex,
          approvalFromAdminAsPO: false,
          approvalFromAdminAsQuotes: true
        });
      if (element == "PO_Id")
        querySearchsort.push({
          PO_Id: regex,
          approvalFromAdminAsPO: true,
          approvalFromAdminAsQuotes: false
        });
      if (element == "agentId")
        querySearchsort.push({
          agentId: regex,
        });
      if (element == "customerId")
        querySearchsort.push({
          customerId: regex,
        });
      if (element == "Agent_Code")
        querySearchsort.push({
          Agent_Code: regex,
        });
      if (element == "Machine_name")
        querySearchsort.push({
          Machine_name: regex,
        });
      if (element == "Product_name")
        querySearchsort.push({
          Product_name: regex,
        });
      if (element == "ProductID")
        querySearchsort.push({
          ProductID: regex,
        });
      if (element == "gst")
        querySearchsort.push({
          GST_Number: regex,
        });
      if (element == "pan")
        querySearchsort.push(
          {
            PAN_Company: regex,
          },
          {
            PAN_Agent: regex,
          }
        );
      if (element == "agentName")
        querySearchsort.push({
          agentName: regex,
        });
      if (element == "customerName")
        querySearchsort.push({
          customerName: regex,
        });
      if (element == "customerPhone")
        querySearchsort.push({
          customerPhone: regex,
        });
      if (
        element == undefined ||
        element == "undefined" ||
        element == null ||
        element == "null"
      )
        querySearchsort = [
          {
            firstName: regex,
          },
          {
            lastName: regex,
          },
          {
            fullName: regex,
          },
          {
            email: regex,
          },
          {
            phone: regex,
          },
          {
            AgentID: regex,
          },
          {
            CustomerID: regex,
          },
          {
            Company_Name: regex,
          },
          {
            crop: regex,
          },
          {
            EstimateId: regex,
            approvalFromAdminAsPO: false,
            approvalFromAdminAsQuotes: false
          },
          {
            QuotationId: regex,
            approvalFromAdminAsPO: false,
            approvalFromAdminAsQuotes: true
          },
          {
            PO_Id: regex,
            approvalFromAdminAsPO: true,
            approvalFromAdminAsQuotes: false
          },
          {
            agentId: regex,
          },
          {
            customerId: regex,
          },
          {
            Agent_Code: regex,
          },
          {
            Machine_name: regex,
          },
          {
            Product_name: regex,
          },
          {
            ProductID: regex,
          },
          {
            GST_Number: regex,
          },
          {
            PAN_Company: regex,
          },
          {
            PAN_Agent: regex,
          },
          {
            agentName: regex,
          },
          {
            customerName: regex,
          },
          {
            customerPhone: regex,
          },
        ];
    });
    console.log("querySearchsort", querySearchsort)
    return { Collection, querySearchsort, query, querySort, TOE };
  } else {
    switch (fieldForSearch) {
      case "firstName":
        queryS = {
          firstName: regex,
        };
        break;
      case 'fullName':
        queryS = {
          fullName: regex,
        }
      case 'name':
        nameSearch = search.split(" ")
        nameSearch.forEach(element => {
          nameSearchQuery.push({
            '$or': [{
              'firstName': new RegExp(element, 'i')
            }, {
              'lastName': new RegExp(element, 'i')
            }]
          })
        });
        queryS = {
            '$and': nameSearchQuery
          }
      case "lastName":
        queryS = {
          lastName: regex,
        };
        break;
      case "email":
        queryS = {
          email: regex,
        };
        break;
      case "phone":
        queryS = {
          phone: regex,
        };
        break;
      case "AgentID":
        queryS = {
          AgentID: regex,
        };
        break;
      case "CustomerID":
        queryS = {
          CustomerID: regex,
        };
        break;
      case 'Company_Name':
        queryS = {
          Company_Name:regex,
        }
        break;
      case "crop":
        queryS = {
          crop: regex,
        };
        break;
      case "EstimateId":
        queryS = {
          EstimateId: regex,
        };
        break;
      // case "EstimateNo":
      //   queryS = {
      //     EstimateNo: parseInt(search),
      //   };
      //   break;
      case "QuotationId":
        queryS = {
          QuotationId: regex,
        };
        break;
      case "PO_Id":
        queryS = {
          PO_Id: regex,
        };
        break;
      case "agentId":
        queryS = {
          agentId: regex,
        };
        break;
      case "customerId":
        queryS = {
          customerId: regex,
        };
        break;
      case "Agent_Code":
        queryS = {
          Agent_Code: regex,
        };
        break;
      case "Machine_name":
        queryS = {
          Machine_name: regex,
        };
        break;
      case "Product_name":
        queryS = {
          Product_name: regex,
        };
        break;
      case "ProductID":
        queryS = {
          ProductID: regex,
        };
        break;
      case "gst":
        queryS = {
          GST_Number: regex,
        };
        break;
      case "Company_Name":
        queryS = {
          Company_Name: regex,
        };
        break;
      case "pan":
        queryS = [
          {
            PAN_Company: regex,
          },
          {
            PAN_Agent: regex,
          },
        ];
        break;
      case "agentName":
        queryS = {
          agentName: regex,
        }
        break;
      case "customerName":
        queryS = {
          customerName: regex,
        }
        break;
      case "customerPhone":
        queryS = {
          customerPhone: regex,
        }
        break;
    }
    return { Collection, queryS, query, querySort };
  }
};