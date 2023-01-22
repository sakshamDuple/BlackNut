const router = require("express").Router()

const estimateC = require("../Controller/estimateC")

router.get("/", estimateC.getAll);
router.post("/create", estimateC.create);
router.getById
// router.post("/forgotPassword", estimateC.forgotPassword);
// router.post("/verifyForgotPassword", estimateC.verifyForgotPassword);
// router.post("/resetPassword", estimateC.resetPassword);
// router.post("/admin", estimateC.adminLogin);

module.exports = router;