const router = require("express").Router()

const UpdC = require("../Controller/updateChangesInDBC")

router.get("/UpdateInDB", UpdC.updateInDb);

module.exports = router;