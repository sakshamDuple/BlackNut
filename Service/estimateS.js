const productS = require("./productS");
const AgentS = require("./AgentS");
const productC = require("../Controller/productC");
const { error } = require("../Middleware/error");
const Estimate = require("../Model/Estimate");
const { dateToDateNowConverter } = require("../Middleware/dateConverter");
const { getCustomerToShowById } = require("./CustomerS");

exports.create = async (estimate) => {
  let {
    Products,
    agentId,
    customerId,
    EstimateDateOfPurchase,
    approvalFromAdminAsQuotes
  } = estimate;
  if (!Products || Products.length == 0)
    return error("Products", "missing field");
  if (!agentId) return error("agentId", "missing field");
  if (!customerId) return error("customerId", "missing field");
  if (!EstimateDateOfPurchase)
    return error("EstimateDateOfPurchase", "missing field");
  //   if (!approvalFromAdminAsQuotes)
  //     return error("approvalFromAdminAsQuotes", "missing field");
  let foundcustomer, foundAgent, newDate, fails = [], successes = [];
  let data = await allProducts(Products, fails, successes);
  console.log("NotfoundProduct", data[1].products, fails,successes);
  if (fails.length > 0) return error(`ProductId: ${fails}`, "id's not found");
  foundcustomer = await AgentS.getCommonById(customerId);
  if (!foundcustomer.data || foundcustomer.data.role == "agent")
    return error("customerId", "id not found");
  foundAgent = await AgentS.getCommonById(agentId);
  if (!foundAgent.data || foundAgent.data.role == "customer")
    return error("agentId", "id not found");
  if (EstimateDateOfPurchase)
    newDate = await dateToDateNowConverter(EstimateDateOfPurchase);
  let nextSeq = await getValueForNextSequence("Estimate");
  console.log("foundcustomer",foundcustomer)
  let customerName = foundcustomer.data.firstName+" "+foundcustomer.data.lastName
  console.log(customerName)
  try {
    let createdEstimate = await Estimate.create({
      Products:data[1].products,
      agentId,
      customerId,
      customerName,
      approvalFromAdminAsQuotes,
      EstimateDateOfPurchase: newDate,
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

let allProducts = (products, fails, successes) => {
  return new Promise(async function (resolve, reject) {
    Promise.all(
      products.map(async element => {
        return new Promise(async function (resolve, reject) {
          let fail, success;
          let { ProductId, quantity, ProductEstimatedPrice } = element
          let foundProduct = await productS.findOneById(ProductId)
          element.ProductIDToShow = foundProduct.ProductID
          element.OriginalPriceOfProduct = foundProduct.Price
          if (!foundProduct) {
            fails.push(ProductId);
          } else {
            successes.push(ProductId)
          }
          resolve({ products, fail, success })
        })
      })
    ).then((data) => {
      resolve(data)
    })
  })
}

let allProductsDetailed = (products, fails, successes) => {
  return new Promise(async function (resolve, reject) {
    Promise.all(
      products.map(async element => {
        return new Promise(async function (resolve, reject) {
          let fail, success;
          let { ProductId, quantity } = element
          console.log(element)
          let Product = await productC.toGetAllDetailsOfProduct(ProductId)
          if (!Product) {
            fails.push(ProductId);
          } else {
            successes.push({ Product, quantity })
          }
          resolve({ fail, success })
        })
      })
    ).then((data) => {
      resolve(data)
    })
  })
}

async function getValueForNextSequence(val) {
  let MaxEstimateNo
  switch (val) {
    case "Estimate":
      MaxEstimateNo = { $max: "$EstimateNo" }
      break;
    case "Quotation":
      MaxEstimateNo = { $max: "$QuotationNo" }
      break;
    case "PI":
      MaxEstimateNo = { $max: "$PI_No" }
      break;
    case "PO":
      MaxEstimateNo = { $max: "$PO_No" }
      break;
  }
  let foundEstimates = await Estimate.find();
  if (foundEstimates.length == 0) return 1;
  let agg = [
    {
      $group: {
        _id: null,
        MaxEstimateNo
      },
    },
  ];
  let findMax = await Estimate.aggregate(agg);
  return findMax[0].MaxEstimateNo + 1;
}

exports.getAllEstimates = async (id, field) => {
  try {
    let agentId, AllEstimates
    if (field == "agent") {
      agentId = id
      AllEstimates = await Estimate.find({
        approvalFromAdminAsQuotes: false, agentId
      });
    } else {
      AllEstimates = await Estimate.find({
        approvalFromAdminAsQuotes: false
      });
    }
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

exports.getAllQuotation = async () => {
  try {
    let AllEstimates = await Estimate.find({
      approvalFromAdminAsQuotes: true,
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

exports.updateEstimateToQuotation = async (id) => {
  let foundEstimate = await Estimate.findById(id)
  if (!foundEstimate) return { message: "Id Not Found", status: 404 };
  foundEstimate.approvalFromAdminAsQuotes = true
  foundEstimate.QuotationNo = getValueForNextSequence("Quotation")
  foundEstimate.Updates.EstimateToQuotation = Date.now()
  foundEstimate.QuotationId = "Q_Id" + Date.now().toString()
  if (!foundEstimate) return { error: "Estimate Not Found", message: "Updation failed", status: 404 };
  let updateThisEstimate = await Estimate.updateOne({ _id: id }, { $set: foundEstimate })
  console.log(updateThisEstimate.nModified)
  try {
    return {
      data: updateThisEstimate.nModified > 0,
      message: updateThisEstimate.nModified > 0 ? "Updatation Of Estimate To Quotation Success" : "Updation failed",
      status: updateThisEstimate.nModified > 0 ? 200 : 400,
    };
  } catch (e) {
    console.log(e);
    return { error: e, message: "we have an error", status: 400 };
  }
}

exports.getEstimateById = async (id) => {
  try {
    let estimate = await Estimate.findOne({ _id: id, approvalFromAdminAsQuotes: false })
    return {
      data: estimate,
      message: estimate ? "Estimate found" : "Estimate Not Found",
      status: estimate ? 200 : 404,
    };
  } catch (e) {
    console.log(e);
    return { error: e, message: "we have an error", status: 400 };
  }
};

exports.getQuotationById = async (id) => {
  try {
    let Quotation = await Estimate.findOne({ _id: id, approvalFromAdminAsQuotes: true })
    return {
      data: Quotation,
      message: Quotation ? "Quotation found" : "Quotation Not Found",
      status: Quotation ? 200 : 404,
    };
  } catch (e) {
    console.log(e);
    return { error: e, message: "we have an error", status: 400 };
  }
};

exports.getByAgentId = async (id) => {
  try {
    let Quotation = await Estimate.find({ agentId: id, approvalFromAdminAsQuotes: true })
    return {
      data: Quotation.length > 0,
      message: Quotation.length > 0 ? "Quotation found" : "Quotation Not Found",
      status: Quotation.length > 0 ? 200 : 404,
    };
  } catch (e) {
    console.log(e);
    return { error: e, message: "we have an error", status: 400 };
  }
};

exports.getDetailEstimateById = async (id) => {
  try {
    console.log(id)
    let estimate = await Estimate.findById(id)
    let { agentId, customerId } = estimate
    let customer = await getCustomerToShowById(customerId)
    let agent = await AgentS.getAgentToShowById(agentId)
    let newEstimate = { ...estimate }
    let fails = [], successes = []
    await allProductsDetailed(estimate.Products, fails, successes)
    console.log("successes", successes)
    newEstimate._doc.Products = successes
    delete newEstimate._doc.agentId
    delete newEstimate._doc.customerId
    newEstimate._doc.customer = customer.data
    newEstimate._doc.agent = agent.data
    return {
      data: newEstimate._doc,
      message: "estimate found",
      status: 200,
    };
  } catch (e) {
    console.log(e);
    return { error: e, message: "we have an error", status: 400 };
  }
};