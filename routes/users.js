const { getUserByIdController, updateUserController } = require("../controllers/userController");
const {authenticateToken} = require("../middlewares/verifyToken");

const router = require("express").Router();


//Get user by id
router.get("/:userId", getUserByIdController);


//Update user
router.put("/update/:userId",authenticateToken, updateUserController);

module.exports = router;