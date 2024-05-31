const { Router } = require("express");
const pricesController = require("../controller/pricesController");
const {
  requireAuth,
  requirePrivileges,
  checkUser,
} = require("../middleware/authMiddleware");

const router = Router();
router.use(checkUser, requireAuth, requirePrivileges);

router.get("/getAllPrices", pricesController.getAllPrices);
router.get("/getOnePrice/:name", pricesController.getOne);
router.post("/createPrice", pricesController.create);
router.put("/updatePrice", pricesController.update);
router.delete("/deletePrice/:id", pricesController.delete);

module.exports = router;
