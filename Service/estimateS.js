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
const { sendEmail, SuperAdminEmail } = require("../Middleware/emailSend");

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
  let customerPhone = foundcustomer.data.phone
  let agentName = foundAgent.data.firstName + " " + foundAgent.data.lastName;
  let Agent_Code = foundAgent.data.AgentID;
  let state = foundAgent.data.Address.state;
  let dates = new Date()
  let month = dates.getMonth()<10?'0'+(dates.getMonth()+1):(dates.getMonth()+1)
  let year = dates.getYear() - 100
  let EstimateId = `${year}-${month}-${nextSeq<1000?nextSeq<100?nextSeq<10?"000"+nextSeq:"00"+nextSeq:"0"+nextSeq:nextSeq}`
  try {
    console.log("\n\n\n\nProducts\n\n\n\n",Products)
    let createdEstimate = await Estimate.create({
      Products: Products,
      agentId,
      customerId,
      customerName,
      Agent_Code,
      agentName,
      approvalFromAdminAsQuotes,
      EstimateDateOfPurchase: newDate,
      EstimateNo: nextSeq,
      state,
      customerPhone,
      EstimateId
    });
    await sendEmail(foundAgent.data.email, "You Added New Estimate", "", {
      Name: foundAgent.data.firstName,
      agentId: foundAgent.data.AgentID
    });
    await sendEmail(foundcustomer.data.email, "Added New Estimate", "", {
      Name: foundcustomer.data.firstName,
    });
    await sendEmail(SuperAdminEmail, "New Estimate Added", "", { Name: "Super Admin", agentId: foundAgent.data.AgentID })
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
          let { ProductId, quantity, ProductEstimatedPrice, ProductName, Gst } =
            element;
          let foundProduct = await productS.findOneById(ProductId);
          console.log("foundProduct",foundProduct)
          let foundMachine = await MachineS.findMachineById(
            foundProduct.machineId
          );
          element.ProductIDToShow = foundProduct.ProductID;
          element.ProductName = foundMachine.data.Product_name;
          element.Gst = foundProduct.Gst
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
          let { ProductId, quantity, Gst, ProductEstimatedPrice, ProductName } = element;
          console.log(element);
          let Product = await productC.toGetAllDetailsOfProduct(ProductId);
          if (!Product) {
            fails.push(ProductId);
          } else {
            successes.push({ Product, quantity, Gst, ProductEstimatedPrice,ProductId,ProductName });
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
  let MaxEstimateNo,query;
  switch (val) {
    case "Estimate":
      MaxEstimateNo = { $max: "$EstimateNo" };
      query = {
        approvalFromAdminAsQuotes:false,
        approvalFromAdminAsPO:false
      }
      break;
    case "Quotation":
      MaxEstimateNo = { $max: "$QuotationNo" };
      query = {
        approvalFromAdminAsQuotes:true,
        approvalFromAdminAsPO:false
      }
      break;
    case "PO":
      MaxEstimateNo = { $max: "$PO_No" };
      query = {
        approvalFromAdminAsQuotes:false,
        approvalFromAdminAsPO:true
      }
      break;
  }
  let foundEstimates = await Estimate.count(query);
  if (foundEstimates == 0) return 1;
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
    let agentId, AllEstimates, query, start;
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
    let agg = []
    console.log(query);
    totalCount = await Estimate.count(query);
    if (page && limit) {
      start = limit * (page - 1);
      // agg = [{
        
      // }]
      AllEstimates = await Estimate.find(query).sort({createdAt:-1})
        .skip(start)
        .limit(parseInt(limit));
    } else {
      AllEstimates = await Estimate.find(query).sort({createdAt:-1});
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
      AllEstimates = await Estimate.find(query).sort({createdAt:-1})
        .skip(start)
        .limit(parseInt(limit));
    } else {
      AllEstimates = await Estimate.find(query).sort({createdAt:-1});
    }
    return {
      data: AllEstimates,
      totalCount,
      message:
        AllEstimates.length > 0
          ? "retrieval Success"
          : "please create some estimates to view",
      status: AllEstimates.length > 0 ? 200 : 400,
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
      })
    : (query = {
        approvalFromAdminAsQuotes: false,
        approvalFromAdminAsPO: true,
        state,
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
    start = limit * (page - 1);
    let totalCount = await Estimate.count(query);
    if (page && limit) {
      AllEstimates = await Estimate.find(query).sort({createdAt:-1})
        .skip(start)
        .limit(parseInt(limit));
    } else {
      AllEstimates = await Estimate.find(query).sort({createdAt:-1});
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
  foundEstimate.QuotationNo = await getValueForNextSequence("Quotation");
  foundEstimate.Updates.EstimateToQuotation = Date.now();
  let dates = new Date()
  let month = dates.getMonth()<10?'0'+(dates.getMonth()+1):(dates.getMonth()+1)
  let year = dates.getYear() - 100
  foundEstimate.QuotationId = `${year}-${month}-${foundEstimate.QuotationNo<1000?foundEstimate.QuotationNo<100?foundEstimate.QuotationNo<10?"000"+foundEstimate.QuotationNo:"00"+foundEstimate.QuotationNo:"0"+foundEstimate.QuotationNo:foundEstimate.QuotationNo}`
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
      { Name: foundAgent.data.firstName, agentId: foundAgent.data.AgentID }
    );
    await sendEmail(foundcustomer.data.email, "Added New Estimate", "", {
      Name: foundcustomer.data.firstName,
    });
    await sendEmail(SuperAdminEmail, "A Quotation is Processed", "", { Name: "Super Admin", agentId: foundAgent.data.AgentID })
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
  try {
    let foundEstimate = await Estimate.findById(id);
    console.log("foundEstimate",foundEstimate)
    let theProductToUpdate = foundEstimate.Products
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
      let findNumber = await verifiedNumberS.findOnly(phone);console.log(phone)
      let foundAgent = await AgentS.getCommonById(foundEstimate.agentId);
      console.log("!data",!data)
      if ((findNumber.role != "agent" && findNumber.role != "dealer") && findNumber.role == null)
        return {
          error: "agent not found",
          message: "please provide phone of a valid register agent",
          status: 404,
        };
      let otpRecieved = await OtpS.findOnly(foundAgent.data.phone);
      if (otpRecieved == null)
        return { message: "no otp found on this number", status: 400 };
      if (otpRecieved.otp != otp)
        return { message: "otp doesn't match", status: 400 };
      await OtpS.deleteOnly(phone);
    }
    let PurchaseInvoice1;
    if (quotation) {
      let { Products, _id, PurchaseInvoice } = quotation;
      console.log("!data",!data)
      if (_id != foundEstimate._id)
        return { message: "Id did not match Found", status: 409 };
      if (Products) {
        Products.map((product, i) => {
          if (
            product.ProductIDToShow == foundEstimate.Products[i].ProductIDToShow
          )
            {
              foundEstimate.Products[i].ProductEstimatedPrice = parseInt(product.ProductEstimatedPrice)
              foundEstimate.Products[i].Gst = product.Gst
            }
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
    foundEstimate.PO_No = await getValueForNextSequence("PO");
    foundEstimate.Updates.QuotationToPO = Date.now();
    let dates = new Date()
    let month = dates.getMonth()<10?'0'+(dates.getMonth()+1):(dates.getMonth()+1)
    let year = dates.getYear() - 100
    foundEstimate.PO_Id = `${year}-${month}-${foundEstimate.PO_No<1000?foundEstimate.PO_No<100?foundEstimate.PO_No<10?"000"+foundEstimate.PO_No:"00"+foundEstimate.PO_No:"0"+foundEstimate.PO_No:foundEstimate.PO_No}`
    foundEstimate.Products = theProductToUpdate
    let updateThisEstimate = await Estimate.updateOne(
      { _id: id },
      { $set: foundEstimate }
    );
    if (updateThisEstimate.nModified > 0 && PurchaseInvoice1) {
      let foundAgent = await AgentS.getCommonById(foundEstimate.agentId);
      let foundcustomer = await AgentS.getCommonById(
        foundEstimate.customerId
      );
      await sendEmail(
        foundAgent.data.email,
        "You Converted Quotation To Order",
        "",
        { Name: foundAgent.data.firstName, agentId: foundAgent.data.AgentID }
      );
      await sendEmail(foundcustomer.data.email, "Your Machine Is Ordered", "", {
        Name: foundcustomer.data.firstName,
      });
      // await sendEmail(foundcustomer.data.email, "An Ordered is Processed", "", { Name: foundcustomer.data.firstName })
    }
    return {
      data: updateThisEstimate.nModified > 0,
      message:
        updateThisEstimate.nModified > 0
          ? approval
            ? "Updatation Of Quotation To Purchase Order Request Accepted, "
            : `${
                updateThisEstimate.nModified > 0 && PurchaseInvoice1 ? "Quotation has been Approved!" : "Quotation Details"
              } were Updatated${
                approval != undefined
                  && " But Quotation To Purchase Order Request Rejected"
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
    console.log(agent)
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