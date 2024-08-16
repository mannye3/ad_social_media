const { CustomError } = require("../middlewares/error");
const User = require("../models/User");



const getUserByIdController = async (req, res,next) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        const{password, ...data} = user;
       res.status(200).json(data._doc);
    } catch (error) {
       next(error);
    }
}
  

// Update user
// Update user
const updateUserController = async (req, res, next) => {
    const { userId } = req.params;
    const updateData = req.body;

    try {
        if (!req.user) {
            throw new CustomError("Authentication required", 401);
        }

        const userToUpdate = await User.findOne({ _id: userId }).select("-password");
        if (!userToUpdate) {
            throw new CustomError("User not found", 404);
        }

        // Ensure authenticated user is updating their own profile
        if (userToUpdate._id.toString() !== req.user._id) {
            throw new CustomError("Unauthorized to update this user", 403);
        }

        // Check if the username is being updated to a value that already exists
        if (updateData.username && updateData.username !== userToUpdate.username) {
            const existingUser = await User.findOne({ username: updateData.username });
            if (existingUser) {
                throw new CustomError("Username already taken", 409);
            }
        }

        // Update user data
        Object.assign(userToUpdate, updateData);
        await userToUpdate.save();

        res.status(200).json({ message: "User updated successfully", user: userToUpdate });
    } catch (error) {
        next(error);
    }
};









module.exports = {
    getUserByIdController,
    updateUserController
}

