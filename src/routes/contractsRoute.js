const { Router } = require("express");
const contractsController = require("../controller/contractsController");
const {
  requireAuth,
  checkUser,
  requireOwner,
} = require("../middleware/authMiddleware");

const router = Router();
router.use(checkUser, requireAuth, requireOwner);

router.get("/getAllContracts", contractsController.getAllContracts);
router.get("/getOneContract/:id", contractsController.getOneContract);
router.post("/createContract", contractsController.createContract);
router.put("/editContract", contractsController.editContract);
router.delete("/deleteContract/:id", contractsController.deleteContract);

module.exports = router;
