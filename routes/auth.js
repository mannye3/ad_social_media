const express=require("express");
const { registerController, loginController , forgotPasswordController, resetPasswordController, refetchController, logoutController} = require("../controllers/aurhController");
const {authenticateToken} = require("../middlewares/verifyToken");
const router=express.Router()






//Register
router.post("/register",registerController)


//Login
router.post("/login", loginController)



// Forget Password
router.post("/forget-password", forgotPasswordController);


// Reset Password
router.post("/reset-password/:token", resetPasswordController);




//Get User
router.get("/user", authenticateToken, refetchController);

// router.get("/user", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Get user error:", error);
//     res.status(500).json({ message: "An error occurred while fetching user details" });
//   }
// });




// Logout
router.get("/logout", logoutController);
 
module.exports=router