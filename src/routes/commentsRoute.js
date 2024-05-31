const { Router } = require("express");
const { celebrate, Joi } = require("celebrate");
const commentController = require("../controller/commentController");
const {
  requireAuth,
  checkUser,
  requirePrivileges,
} = require("../middleware/authMiddleware");

const router = Router();
router.use(requireAuth);
const payloadValidationSchema = {
  body: Joi.object({
    message: Joi.string(),
    imageData: Joi.string(),
  }).or("message", "imageData"), // Require at least one of message or imageData
};

router.get("/getAllComments", commentController.getAllComments);
router.get("/getUserComment/:idUser", commentController.getOne);
router.post(
  "/createComment",
  celebrate(payloadValidationSchema),
  commentController.create
);
router.put("/updateComment", commentController.update);
router.delete(
  "/deleteComment/:id",
  checkUser,
  requirePrivileges,
  commentController.delete
);

module.exports = router;
