const router = require("express").Router()

const notificationC = require("../Controller/notificationC")

router.get("/", notificationC.getAll);
router.get("/", notificationC.getOneNotify);
router.patch("/readTheNotification", notificationC.readTheNotification);

module.exports = router;