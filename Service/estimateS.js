const productS = require("./productS");
const MachineS = require("./MachineS");
const AgentS = require("./AgentS");
const productC = require("../Controller/productC");
const { error } = require("../Middleware/error");
const Estimate = require("../Model/Estimate");
const { dateToDateNowConverter } = require("../Middleware/dateConverter");
const { getCustomerToShowById } = require("./CustomerS");
const OtpS = require("../Service/OtpS");
const verifiedNumberS = require("../Service/verifyNumberS");
const { sendEmail } = require("../Middleware/emailSend");

exports.create = async (estimate) => {
  let {
    Products,
    agentId,
    customerId,
    EstimateDateOfPurchase,
    approvalFromAdminAsQuotes,
    ProductName,
  } = estimate;
  if (!Products || Products.length == 0)
    return error("Products", "missing field");
  if (!agentId) return error("agentId", "missing field");
  if (!customerId) return error("customerId", "missing field");
  if (!EstimateDateOfPurchase)
    return error("EstimateDateOfPurchase", "missing field");
  //   if (!approvalFromAdminAsQuotes)
  //     return error("approvalFromAdminAsQuotes", "missing field");
  let foundcustomer,
    foundAgent,
    newDate,
    fails = [],
    successes = [];
  let data = await allProducts(Products, fails, successes);
  console.log("NotfoundProduct", data[0].products, fails, successes);
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
  let customerName =
    foundcustomer.data.firstName + " " + foundcustomer.data.lastName;
  let agentName = foundAgent.data.firstName + " " + foundAgent.data.lastName;
  let Agent_Code = foundAgent.data.AgentID;
  let state = foundAgent.data.Address.state;
  try {
    let createdEstimate = await Estimate.create({
      Products: data[0].products,
      agentId,
      customerId,
      customerName,
      Agent_Code,
      agentName,
      approvalFromAdminAsQuotes,
      EstimateDateOfPurchase: newDate,
      EstimateNo: nextSeq,
      state,
    });
    await sendEmail(foundAgent.data.email, "You Added New Estimate", "", {
      Name: foundAgent.data.firstName,
    });
    await sendEmail(foundcustomer.data.email, "Added New Estimate", "", {
      Name: foundcustomer.data.firstName,
    });
    // await sendEmail(foundcustomer.data.email, "New Estimate Added", "", { Name: foundcustomer.data.firstName })
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
      products.map(async (element) => {
        return new Promise(async function (resolve, reject) {
          let fail, success;
          let { ProductId, quantity, ProductEstimatedPrice, ProductName } =
            element;
          let foundProduct = await productS.findOneById(ProductId);
          let foundMachine = await MachineS.findMachineById(
            foundProduct.machineId
          );
          element.ProductIDToShow = foundProduct.ProductID;
          element.OriginalPriceOfProduct = foundProduct.Price;
          element.ProductName = foundMachine.data.Product_name;
          if (!foundProduct) {
            fails.push(ProductId);
          } else {
            successes.push(ProductId);
          }
          resolve({ products, fail, success });
        });
      })
    ).then((data) => {
      resolve(data);
    });
  });
};

let allProductsDetailed = (products, fails, successes) => {
  return new Promise(async function (resolve, reject) {
    Promise.all(
      products.map(async (element) => {
        return new Promise(async function (resolve, reject) {
          let fail, success;
          let { ProductId, quantity } = element;
          console.log(element);
          let Product = await productC.toGetAllDetailsOfProduct(ProductId);
          if (!Product) {
            fails.push(ProductId);
          } else {
            successes.push({ Product, quantity });
          }
          resolve({ fail, success });
        });
      })
    ).then((data) => {
      resolve(data);
    });
  });
};

async function getValueForNextSequence(val) {
  let MaxEstimateNo;
  switch (val) {
    case "Estimate":
      MaxEstimateNo = { $max: "$EstimateNo" };
      break;
    case "Quotation":
      MaxEstimateNo = { $max: "$QuotationNo" };
      break;
    case "PO":
      MaxEstimateNo = { $max: "$PO_No" };
      break;
  }
  let foundEstimates = await Estimate.find();
  if (foundEstimates.length == 0) return 1;
  let agg = [
    {
      $group: {
        _id: null,
        MaxEstimateNo,
      },
    },
  ];
  let findMax = await Estimate.aggregate(agg);
  return findMax[0].MaxEstimateNo + 1;
}

exports.getAllEstimates = async (id, field, page, limit, state) => {
  try {
    let agentId, AllEstimates, query;
    if (state) state = { $regex: `(?i)${state}(?-i)` };
    if (field == "agent") {
      agentId = id;
      state == undefined
        ? (query = {
            approvalFromAdminAsQuotes: false,
            agentId,
            approvalFromAdminAsPO: false,
          })
        : (query = {
            approvalFromAdminAsQuotes: false,
            agentId,
            approvalFromAdminAsPO: false,
            state,
          });
    } else {
      state == undefined
        ? (query = {
            approvalFromAdminAsQuotes: false,
            approvalFromAdminAsPO: false,
          })
        : (query = {
            approvalFromAdminAsQuotes: false,
            approvalFromAdminAsPO: false,
            state,
          });
    }
    console.log(query);
    totalCount = await Estimate.count(query);
    if (page && limit) {
      start = limit * (page - 1);
      AllEstimates = await Estimate.find(query)
        .skip(start)
        .limit(parseInt(limit));
    } else {
      AllEstimates = await Estimate.find(query);
    }
    return {
      data: AllEstimates,
      totalCount,
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

exports.getAllQuotation = async (id, field, page, limit, state) => {
  try {
    let AllEstimates, query, start;
    if (state) state = { $regex: `(?i)${state}(?-i)` };
    if (field == "agent") {
      agentId = id;
      state == undefined
        ? (query = {
            approvalFromAdminAsQuotes: true,
            agentId: id,
            approvalFromAdminAsPO: false,
          })
        : (query = {
            approvalFromAdminAsQuotes: true,
            agentId: id,
            state,
            approvalFromAdminAsPO: false,
          });
    } else {
      state == undefined
        ? (query = {
            approvalFromAdminAsQuotes: true,
            approvalFromAdminAsPO: false,
          })
        : (query = {
            approvalFromAdminAsQuotes: true,
            approvalFromAdminAsPO: false,
            state,
          });
    }
    console.log(query);
    totalCount = await Estimate.count(query);
    if (page && limit) {
      start = limit * (page - 1);
      AllEstimates = await Estimate.find(query)
        .skip(start)
        .limit(parseInt(limit));
    } else {
      AllEstimates = await Estimate.find(query);
    }
    return {
      data: AllEstimates,
      totalCount,
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

exports.getAllPO = async (id, field, page, limit, state) => {
  if (state) state = { $regex: `(?i)${state}(?-i)` };
  let query;
  state == undefined
    ? (query = {
        approvalFromAdminAsQuotes: false,
        approvalFromAdminAsPO: true,
        state,
      })
    : (query = {
        approvalFromAdminAsQuotes: false,
        approvalFromAdminAsPO: true,
      });
  if (id) {
    state == undefined
      ? (query = {
          approvalFromAdminAsQuotes: false,
          approvalFromAdminAsPO: true,
          agentId: id,
        })
      : (query = {
          approvalFromAdminAsQuotes: false,
          approvalFromAdminAsPO: true,
          agentId: id,
          state,
        });
  }
  try {
    let AllEstimates, start;
    let totalCount = await Estimate.count(query);
    if (page && limit) {
      AllEstimates = await Estimate.find(query)
        .skip(start)
        .limit(parseInt(limit));
    } else {
      AllEstimates = await Estimate.find(query);
    }
    return {
      data: AllEstimates,
      totalCount,
      message:
        AllEstimates.length > 0
          ? "retrieval Success"
          : "please convert some to PO to view",
      status: AllEstimates.length > 0 ? 200 : 404,
    };
  } catch (e) {
    console.log(e);
    return { error: e, message: "we have an error" };
  }
};

exports.updateEstimateToQuotation = async (id) => {
  let foundEstimate = await Estimate.findById(id);
  if (!foundEstimate) return { message: "Id Not Found", status: 404 };
  foundEstimate.approvalFromAdminAsQuotes = true;
  foundEstimate.QuotationNo = getValueForNextSequence("Quotation");
  foundEstimate.Updates.EstimateToQuotation = Date.now();
  foundEstimate.QuotationId = "Q_Id" + Date.now().toString();
  if (!foundEstimate)
    return {
      error: "Estimate Not Found",
      message: "Updation failed",
      status: 404,
    };
  let updateThisEstimate = await Estimate.updateOne(
    { _id: id },
    { $set: foundEstimate }
  );
  console.log(updateThisEstimate.nModified);
  if (updateThisEstimate.nModified > 0) {
    console.log(foundEstimate);
    let foundAgent = await AgentS.getCommonById(foundEstimate.agentId);
    let foundcustomer = await AgentS.getCommonById(foundEstimate.customerId);
    await sendEmail(
      foundAgent.data.email,
      "You Converted Estimate To Quotation",
      "",
      { Name: foundAgent.data.firstName }
    );
    await sendEmail(foundcustomer.data.email, "Added New Estimate", "", {
      Name: foundcustomer.data.firstName,
    });
    // await sendEmail(foundcustomer.data.email, "A Quotation is Processed", "", { Name: foundcustomer.data.firstName })
  }
  try {
    return {
      data: updateThisEstimate.nModified > 0,
      message:
        updateThisEstimate.nModified > 0
          ? "Updatation Of Estimate To Quotation Success"
          : "Updation failed",
      status: updateThisEstimate.nModified > 0 ? 200 : 400,
    };
  } catch (e) {
    console.log(e);
    return { error: e, message: "we have an error", status: 400 };
  }
};

exports.updateQuotationToPO = async (id, quotation, approval, data) => {
  let foundEstimate = await Estimate.findById(id);
  if (!foundEstimate) return { message: "Id Not Found", status: 404 };
  if (!foundEstimate)
    return {
      error: "Quotation Not Found",
      message: "Updation failed",
      status: 404,
    };
  let agentUpdation = true;
  if (foundEstimate.approvalFromAdminAsQuotes != true)
    return {
      error: "Quotation Not Found",
      message: "Updation failed",
      status: 404,
    };
  if (data) {
    let { otp, phone } = data;
    let { role } = await verifiedNumberS.findOnly(phone);
    if (role != "agent")
      return {
        error: "agent not found",
        message: "please provide phone of a valid register agent",
        status: 404,
      };
    let otpRecieved = await OtpS.findOnly(phone);
    if (otpRecieved == null)
      return { message: "no otp found on this number", status: 400 };
    if (otpRecieved.otp != otp)
      return { message: "otp doesn't match", status: 400 };
    await OtpS.deleteOnly(phone);
  }
  let PurchaseInvoice1;
  if (quotation) {
    let { Products, _id, PurchaseInvoice } = quotation;
    if (_id != foundEstimate._id)
      return { message: "Id did not match Found", status: 409 };
    if (Products) {
      Products.map((product, i) => {
        if (
          product.ProductIDToShow == foundEstimate.Products[i].ProductIDToShow
        )
          foundEstimate.Products[i].ProductEstimatedPrice =
            product.ProductEstimatedPrice;
      });
      agentUpdation = false;
    }
    if (PurchaseInvoice) {
      foundEstimate.PurchaseInvoice = PurchaseInvoice;
      foundEstimate.approvalFromAdminAsQuotes = false;
      foundEstimate.approvalFromAdminAsPO = true;
    }
    PurchaseInvoice1 = PurchaseInvoice;
  }
  if (approval == true) {
    foundEstimate.Status = "ACTIVE";
  } else if (approval == false) {
    foundEstimate.Status = "INACTIVE";
  } else {
    foundEstimate.Status = "ACTIVE";
  }
  foundEstimate.PO_No = getValueForNextSequence("PO");
  foundEstimate.Updates.QuotationToPO = Date.now();
  foundEstimate.PO_Id = "PO_Id" + Date.now().toString();
  let updateThisEstimate = await Estimate.updateOne(
    { _id: id },
    { $set: foundEstimate }
  );
  if (updateThisEstimate.nModified > 0 && PurchaseInvoice1) {
    let foundAgent = await AgentS.getCommonById(foundEstimate.data.agentId);
    let foundcustomer = await AgentS.getCommonById(
      foundEstimate.data.customerId
    );
    await sendEmail(
      foundAgent.data.email,
      "You Converted Quotation To Order",
      "",
      { Name: foundAgent.data.firstName }
    );
    await sendEmail(foundcustomer.data.email, "Your Machine Is Ordered", "", {
      Name: foundcustomer.data.firstName,
    });
    // await sendEmail(foundcustomer.data.email, "An Ordered is Processed", "", { Name: foundcustomer.data.firstName })
  }
  try {
    return {
      data: updateThisEstimate.nModified > 0,
      message:
        updateThisEstimate.nModified > 0
          ? approval
            ? "Updatation Of Quotation To Purchase Order Request Accepted"
            : `${
                agentUpdation ? "Quotation To Purchase Order" : "Price"
              } was Updatated${
                approval != undefined
                  ? " But Quotation To Purchase Order Request Rejected"
                  : ""
              }`
          : "Updation failed",
      status: updateThisEstimate.nModified > 0 ? 200 : 400,
    };
  } catch (e) {
    console.log(e);
    return { error: e, message: "we have an error", status: 400 };
  }
};

exports.getEstimateById = async (id) => {
  try {
    let estimate = await Estimate.findOne({
      _id: id,
      approvalFromAdminAsQuotes: false,
    });
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
    let Quotation = await Estimate.findOne({
      _id: id,
      approvalFromAdminAsQuotes: true,
    });
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
    let Quotation = await Estimate.find({
      agentId: id,
      approvalFromAdminAsQuotes: true,
    });
    return {
      data: Quotation,
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
    console.log(id);
    let estimate = await Estimate.findById(id);
    let { agentId, customerId } = estimate;
    let customer = await getCustomerToShowById(customerId);
    let agent = await AgentS.getAgentToShowById(agentId);
    let newEstimate = { ...estimate };
    let fails = [],
      successes = [];
    await allProductsDetailed(estimate.Products, fails, successes);
    console.log("successes", successes);
    newEstimate._doc.Products = successes;
    delete newEstimate._doc.agentId;
    delete newEstimate._doc.customerId;
    newEstimate._doc.customer = customer.data;
    newEstimate._doc.agent = agent.data;
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
