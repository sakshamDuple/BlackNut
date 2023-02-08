const router = require("express").Router()

const loginC = require("../Controller/loginC")

router.post("/", loginC.commonlogin);
router.post("/forgotPassword", loginC.forgotPassword);
router.post("/verifyForgotPassword", loginC.verifyForgotPassword);
router.post("/resetPassword", loginC.resetPassword);
router.post("/admin", loginC.adminLogin);
router.post("/resetPasswordAdmin", loginC.resetPasswordAdmin);
router.post("/forgotPasswordAdmin", loginC.forgotPasswordAdmin);
router.post("/verifyForgotPasswordAdmin", loginC.verifyForgotPasswordAdmin)

module.exports = router;