const router = require("express").Router()

const agentC = require("../Controller/agentC")

router.get("/All", agentC.getAllAgents);
router.get("/AllActive", agentC.getActiveAgents);
router.get("/getCommonById", agentC.getCommonById);
router.delete("/deleteAgentById", agentC.deleteTheAgent);
router.put("/updateAgentById", agentC.updateAgentById);

module.exports = router;