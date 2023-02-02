const router = require("express").Router()

const signUpC = require("../Controller/signUpC")

router.post("/Agent", signUpC.signUpAgent);
router.post("/Customer", signUpC.signUpCustomer);
router.get("/admin", signUpC.createDefaultSuperAdmin);
router.post("/admin", signUpC.createAdmin)

module.exports = router;