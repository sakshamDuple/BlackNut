const router = require("express").Router()

const loginC = require("../Controller/loginC")

router.post("/", loginC.commonlogin);
router.post("/forgotPassword", loginC.forgotPassword);
router.post("/verifyForgotPassword", loginC.verifyForgotPassword);
router.post("/resetPassword", loginC.resetPassword);

module.exports = router;