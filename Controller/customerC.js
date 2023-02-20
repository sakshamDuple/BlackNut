const { sendEmail } = require("../Middleware/emailSend");
const { generateOtp } = require("../Middleware/genOtp");
const { sendOTPonPhone } = require("../Middleware/passOtp");
const Agent = require("../Model/Agent");
const { getCommonById } = require("../Service/AgentS");
const CustomerS = require("../Service/CustomerS");
const OtpS = require("../Service/OtpS");
const { findOnly, deleteOnly } = require("../Service/verifyNumberS");
const axios = require("axios");

exports.getActiveCustomers = async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;
  let theCustomers = await CustomerS.getAllCustomer(true, page, limit);
  if (theCustomers.status == 200) {
    res.status(theCustomers.status).send(theCustomers);
  } else {
    res
      .status(theCustomers.status)
      .send({
        error: theCustomers.error,
        message: theCustomers.message,
        status: theCustomers.status,
      })
      .status(theCustomers.status);
  }
};

exports.addCustomer = async (req, res) => {
  let agentId = req.body.agentId;
  let Customer = req.body.Customer;
  let otp = req.body.otp;
  if (!agentId)
    return res
      .status(400)
      .send({
        message: "can't add custffffffffffffffffffffomer without agentId",
        status: 400,
      });
  let foundAgent = await getCommonById(agentId);
  if (!foundAgent.data)
    return res
      .status(foundAgent.status)
      .send({ message: foundAgent.message, status: foundAgent.status });
  let otpRecieved = await OtpS.findOnly(foundAgent.data.phone);
  if (!otpRecieved)
    return res.status(400).send({ message: "otp not recieved", status: 400 });
  if (otpRecieved.otp != otp)
    return res.status(400).send({ message: "otp doesn't match", status: 400 });
  Customer.password = Customer.confirmPassword = "Pa$$w0rd!";
  if (!Customer.Address.city)
    return res
      .status(400)
      .send({
        error: "city field is empty",
        message: "city field can't be empty",
        status: 400,
      });
  if (!Customer.Address.state)
    return res
      .status(400)
      .send({
        error: "state field is empty",
        message: "state field can't be empty",
        status: 400,
      });
  if (!Customer.Address.mainAddressText)
    return res
      .status(400)
      .send({
        error: "mainAddressText field is empty",
        message: "mainAddressText field can't be empty",
        status: 400,
      });
  if (!Customer.Address.pincode)
    return res
      .status(400)
      .send({
        error: "pincode field is empty",
        message: "pincode field can't be empty",
        status: 400,
      });
  const newCustomer = await CustomerS.create(Customer);
  let a = new Date()
  var day = a.getDate()
  var year = a.getFullYear()
  var month = a.getMonth()
  let ledate = year + "-" + month + "-" + day
  let data = {
    "apikey": "NF8xXzE3MTAkQDIjIzIwMjMtMDItMTggMTY6MjY6NTA=",
    "formname": "Leads",
    "operation": "insertRecords",
    "Overwrite": "true",
    "records": [{
      "Contact​ ​Name": Customer.firstName,
      "Company​ ​Name": Customer.Company_Name,
      "Email": Customer.email,
      "Mobile": Customer.phone,
      "Assigned​ ​To": "",
      "Lead​ ​Date": ledate
    }]
  }
  let result = await axios({
    method: 'post',
    url: 'https://apps.cratiocrm.com/api/apirequest.php',
    data
  })
  console.log(result.data, 'result');
  if (newCustomer.error == "mobile already registered") {
    let RegisteredCustomerByThisPhone = await Agent.findOne({
      phone: Customer.phone,
    });
    console.log("RegisteredCustomerByThisPhone", RegisteredCustomerByThisPhone)
    newCustomer.Agent_ID = RegisteredCustomerByThisPhone._id;
    newCustomer.status = 200;
    newCustomer.message = "Customer added to Estimate Successfully!";
  }
  console.log(newCustomer);
  await OtpS.deleteOnly(foundAgent.data.phone);
  if (newCustomer.status == 201 || 200) {
    res
      .status(newCustomer.status)
      .send({
        data: newCustomer.Agent_ID,
        message: newCustomer.message,
        status: newCustomer.status,
      });
  } else {
    res
      .status(newCustomer.status)
      .send({
        error: newCustomer.error,
        message: newCustomer.message,
        status: newCustomer.status,
      });
  }
};

// exports.getThisCustomer = async (req, res) => {
//   let customerId = req.query.id;
//   await CustomerS.getAllCustomer();
// };

exports.getAllCustomers = async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;
  let theCustomers = await CustomerS.getAllCustomer(false, page, limit);
  console.log(theCustomers);
  if (theCustomers.status == 200) {
    res.status(theCustomers.status).send(theCustomers);
  } else {
    res
      .status(theCustomers.status)
      .send({
        error: theCustomers.error,
        message: theCustomers.message,
        status: theCustomers.status,
      });
  }
};

exports.deleteTheCustomer = async (req, res) => {
  let customerId = req.query.id;
  let thisCustomer = await CustomerS.getCustomerToShowById(customerId);
  await deleteOnly(thisCustomer.data.phone);
  let deleteCustomer = await CustomerS.deleteCustomerById(customerId);
  if (deleteCustomer.status == 202) {
    res
      .status(deleteCustomer.status)
      .send({
        data: deleteCustomer.data,
        message: deleteCustomer.message,
        status: deleteCustomer.status,
      });
  } else {
    res
      .status(deleteCustomer.status)
      .send({
        error: deleteCustomer.error,
        message: deleteCustomer.message,
        status: deleteCustomer.status,
      });
  }
};

exports.updateCustomerById = async (req, res) => {
  let Customer = req.body.customer;
  let updatedCustomer = await CustomerS.updateThisCustomer(Customer);
  if (updatedCustomer.status == 200) {
    res
      .status(updatedCustomer.status)
      .send({
        data: updatedCustomer.data,
        message: updatedCustomer.message,
        status: updatedCustomer.status,
      });
  } else {
    res
      .status(updatedCustomer.status)
      .send({
        error: updatedCustomer.error,
        message: updatedCustomer.message,
        status: updatedCustomer.status,
      });
  }
};

exports.customerOtpRecieve = async (req, res) => {
  let phone = req.query.phone;
  let Nphone = parseInt(phone);
  let otpSent
  if (10000000000 > Nphone && Nphone >= 1000000000) {
    let email = req.query.email;
    let agentid = req.query.agentid;
    if (!phone && !email && !agentid)
      return res.status(400).send({ message: "fields missing", status: 400 });
    let foundAgent = await getCommonById(agentid);
    console.log("foundAgent", foundAgent)
    if (!foundAgent.data)
      return res
        .status(foundAgent.status)
        .send({ message: foundAgent.message, status: foundAgent.status });
    let mobileExists = await findOnly(phone);
    // if (mobileExists != null) return res.status(409).send({ message: "requested phone is already registered", status: 409 })
    let otp = generateOtp();
    await OtpS.deleteOnly(phone);
    await OtpS.create({
      number: foundAgent.data.phone,
      id: agentid,
      otp: otp,
    });
    if (mobileExists != null) {
      otpSent = await sendOTPonPhone("CustomerLink", otp, phone)
      if (otpSent.status != 200) return res.status(otpSent.status).send(otpSent)
      // await sendEmail(
      //   email,
      //   "OTP request for email verification",
      //   otp,
      //   { Name: foundAgent.data.firstName }
      // );
      return res
        .status(200)
        .send({
          message: `OTP is sent on Customer's Mobile Number.`, //The Customer is Already Registered with given mobile, we are not updating customer details, an otp is sent on your mobile & to continue create estimate process put them in the black below,
          status: 200,
        });
    }
    // await sendEmail(
    //   email,
    //   "OTP request for Customer Creation on Blacknut",
    //   otp,
    //   { Name: foundAgent.data.firstName }
    // );
    otpSent = await sendOTPonPhone("CustomerLink", otp, phone)
    if (otpSent.status != 200) return res.status(otpSent.status).send(otpSent)
    return res
      .status(200)
      .send({
        message: `OTP is sent on Customer's Mobile Number!`, //an otp is sent on customer mail, please verify otp to process customer creation
        status: 200,
      });
  }
  res
    .status(400)
    .send({
      error: "Not a valid phone",
      message: "Please enter a valid phone number",
      status: 400,
    });
};

exports.DefaultPhoneOtpRecieve = async (req, res) => {
  let phone = req.query.phone;
  let Nphone = parseInt(phone);
  let otpSent
  console.log(10000000000 > Nphone && Nphone >= 1000000000);
  if (10000000000 > Nphone && Nphone >= 1000000000) {
    if (!phone)
      return res.status(400).send({ message: "fields missing", status: 400 });
    let otp = generateOtp();
    await OtpS.deleteOnly(phone);
    await OtpS.create({
      number: phone,
      otp: otp,
    });
    // otp for phone here
    otpSent = await sendOTPonPhone("CustomerLink", otp, phone)
    if (otpSent.status != 200) return res.status(otpSent.status).send(otpSent)
    return res
      .status(200)
      .json({
        message: `OTP is sent to your mobile number for verification`,
        status: 200,
      });
  }
  res
    .status(400)
    .send({
      error: "Not a valid phone",
      message: "Please enter a valid phone number",
      status: 400,
    });
};

exports.DefaultEmailOtpRecieve = async (req, res) => {
  let email = req.query.email;
  if (!email)
    return res.status(400).send({ message: "fields missing", status: 400 });
  let otp = generateOtp();
  await OtpS.deleteOnly(email);
  await OtpS.create({
    number: email,
    otp: otp,
  });
  await sendEmail(
    email,
    "OTP request for email verification",
    otp,
    { Name: "Guest" }
  );
  res
    .status(200)
    .send({
      message: `OTP is sent to your Email Id for verification`,
      status: 200,
    });
};

exports.otpVerification = async (req, res) => {
  let otp = req.query.otp
  let mobile = req.query.mobile
  let email = req.query.email
  if (!otp) return res.status(400).send({
    message: `Can't Continue without otp`,
    status: 400,
  });
  if (!mobile && !email) return res.status(400).send({
    message: `Should have atleast one field out of mobile & email to continue`,
    status: 400,
  });
  let data = mobile ? mobile : email
  let otpRecieved = await OtpS.findOnly(data);
  if (!otpRecieved)
    return res.status(400).send({ message: "NO otp found on given mobile / email", status: 400 });
  if (otpRecieved.otp != otp)
    return res.status(400).send({ message: "otp doesn't match", status: 400 });
  await OtpS.deleteOnly(data);
  res.status(200).send({ data: true, status: 200, message: `Otp verification for ${mobile ? "Mobile" : "Email"} is successfully executed` })
}