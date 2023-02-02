const router = require("express").Router()

const adminC = require("../Controller/adminC")

router.get("/", adminC.getAllAdmin);
router.put("/editAdmin", adminC.editAdmin)
router.delete("/deleteAdmin", adminC.deleteAdmin)

module.exports = router;