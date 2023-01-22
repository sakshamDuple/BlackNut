const productS = require("./productS");
const AgentS = require("./AgentS");
const { error } = require("../Middleware/error");
const Estimate = require("../Model/Estimate");
const { dateToDateNowConverter } = require("../Middleware/dateConverter");

exports.create = async (estimate) => {
  let {
    ProductId,
    agentId,
    customerId,
    EstimateDateOfPurchase,
    approvalFromAdminAsQuotes,
    quantiy,
  } = estimate;
  if (!ProductId || ProductId.length == 0)
    return error("ProductId", "missing field");
  if (!agentId) return error("agentId", "missing field");
  if (!customerId) return error("customerId", "missing field");
  if (!EstimateDateOfPurchase)
    return error("EstimateDateOfPurchase", "missing field");
  //   if (!approvalFromAdminAsQuotes)
  //     return error("approvalFromAdminAsQuotes", "missing field");
  if (!quantiy) return error("quantiy", "missing field");
  let foundcustomer, foundAgent, newDate;
  let data = await allFound(ProductId);
  console.log("NotfoundProduct", data);
  if (data.ProductNotFound != 0)
    return error(`ProductId: ${data.ProductNotFound}`, "id's not found");
  foundcustomer = await AgentS.getCommonById(customerId);
  if (!foundcustomer.data || foundcustomer.data.role == "agent")
    return error("customerId", "id not found");
  foundAgent = await AgentS.getCommonById(agentId);
  if (!foundAgent.data || foundAgent.data.role == "customer")
    return error("agentId", "id not found");
  if (EstimateDateOfPurchase)
    newDate = await dateToDateNowConverter(EstimateDateOfPurchase);
  let nextSeq = await getValueForNextSequence();
  try {
    let createdEstimate = await Estimate.create({
      ProductId,
      agentId,
      customerId,
      approvalFromAdminAsQuotes,
      EstimateDateOfPurchase: newDate,
      quantiy,
      EstimateNo: nextSeq,
    });
    return {
      data: createdEstimate,
      message: "estimate created Successfully",
      status: 201,
    };
  } catch (e) {
    console.log(e);
    return { error: e, message: "we have an error", status: 400 };
  }
};

let allFound = async (ProductId) => {
  let ProductNotFound = [],
    foundProducts = [];
  //   return new Promise(async function (resolve, reject) {
  //     Promise.all(
  //       ProductId.map(async (element, i) => {
  //         return new Promise(async function (resolve, reject) {
  //           let foundProduct = await productS.findOneById(element);
  //           console.log("foundProduct",foundProduct)
  //           if (!foundProduct) {
  //             ProductNotFound = element
  //           } else {
  //             foundProducts.push(element);
  //           }
  //           resolve(ProductNotFound);
  //         });
  //       })
  //     ).then((data) => {
  //       resolve(data);
  //     });
  //   });
  return new Promise(async function (resolve, reject) {
    ProductId.map(async (element) => {
      let foundProduct = await productS.findOneById(element);
      if (!foundProduct) {
        ProductNotFound.push(element);
      } else {
        foundProducts.push(element);
      }
    });
    resolve({ProductNotFound});
  }).then(data => {
    console.log(data)
    return data
  });
};

async function getValueForNextSequence() {
  let foundEstimates = await Estimate.find();
  if (foundEstimates.length == 0) return 1;
  let agg = [
    {
      $group: {
        _id: null,
        MaxEstimateNo: {
          $max: "$EstimateNo",
        },
      },
    },
  ];
  let findMax = await Estimate.aggregate(agg);
  return findMax[0].MaxEstimateNo + 1;
}

exports.getAllEstimates = async () => {
  try {
    let AllEstimates = await Estimate.find({
      approvalFromAdminAsQuotes: false,
    });
    return {
      data: AllEstimates,
      message:
        AllEstimates.length > 0
          ? "retrieval Success"
          : "please create some estimates to view",
      status: AllEstimates.length > 0 ? 200 : 404,
    };
  } catch (e) {
    console.log(e);
    return { error: e, message: "we have an error" };
  }
};

exports.getEstimateById = async (id) => {
  try {
    return {
      data: await Estimate.findOne(id),
      message: "estimate found",
      status: 200,
    };
  } catch (e) {
    console.log(e);
    return { error: e, message: "we have an error" };
  }
};

// exports.init = async () => {
//   let AllEstimates = await Estimate.find({ approvalFromAdminAsQuotes: false });
//   if (AllEstimates.length==0)
//     await Estimate.create({ _id: 0, sequenceValue: 0, customerId:0,agentId:0,quantiy:0,ProductId:0 });
//   if (AllEstimates.length!=0) await Estimate.deleteOne({ _id: 0 });
// };
