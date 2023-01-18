const router = require("express").Router()

const signUpC = require("../Controller/signUpC")

router.post("/Agent", signUpC.signUpAgent);
router.post("/Customer", signUpC.signUpCustomer);

module.exports = router;