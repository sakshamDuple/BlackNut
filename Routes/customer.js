const router = require("express").Router()

const customerC = require("../Controller/customerC")

router.get("/addCustomer", customerC.addCustomer);
router.get("/All", customerC.getAllCustomers);
router.get("/AllActive", customerC.getActiveCustomers);
router.delete("/deleteCustomerById", customerC.deleteTheCustomer);

module.exports = router;