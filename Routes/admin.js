const router = require("express").Router()

const adminC = require("../Controller/adminC")

router.get("/", adminC.getAllAdmin);
router.put("/editAdmin", adminC.editAdmin)
router.delete("/deleteAdmin", adminC.deleteAdmin)
router.post("/addToGallary", adminC.addToGallary)
router.get("/getGallary", adminC.getGallary)
router.delete("/deleteGal", adminC.deleteGal)

module.exports = router;