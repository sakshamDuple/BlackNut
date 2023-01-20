const router = require("express").Router()

const customerC = require("../Controller/customerC")

router.post("/addCustomer", customerC.addCustomer);
router.get("/All", customerC.getAllCustomers);
router.get("/AllActive", customerC.getActiveCustomers);
router.delete("/deleteCustomerById", customerC.deleteTheCustomer);
router.get("/otpRecieve", customerC.customerOtpRecieve);

module.exports = router;