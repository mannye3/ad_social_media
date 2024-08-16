
const User=require("../models/User")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { CustomError } = require("../middlewares/error");




const registerController = async(req,res,next)=>{
      try {
        const {username, fullName, email, bio, password} = req.body;
        if (!username || !fullName || !email || !bio || !password) {
            // Changed to return here to prevent further execution
            throw new CustomError("All fields are required", 400);
            
        }

        const existingUser = await User.findOne({ $or: [{email}, {username}]})
        if (existingUser) {
            // Changed to return here to prevent further execution
            throw new CustomError("User already exists", 400);
           
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({...req.body, password: hashedPassword})
        const savedUser = await newUser.save()

        res.status(201).json(savedUser)
    } catch (error) {
        // Added error logging and more specific error message
       next(error)
    }
}


const loginController=async(req,res,next)=>{
        try {
        const { email, password } = req.body;
        
        if (!email || !password) {
           throw new CustomError("Email and password are required", 400);
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new CustomError("Invalid credentials", 401);
           
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new CustomError("Invalid credentials", 401);
          
        }

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );
        res.cookie("token", token).status(200).json({ message: "Logged in successfully" , token: token});

    } catch (error) {
       next(error)
    }
}


const forgotPasswordController=async(req,res,next)=>{
        try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError("User not found", 404);
     
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      // Configure your email service here
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetUrl = `http://localhost:3000/api/auth/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: "Password Reset Link",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
        next(error)
    }
}



const resetPasswordController=async(req,res,next)=>{
      try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new CustomError("Password reset token is invalid or has expired", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    next(error)
  }
}



        const logoutController=async(req,res)=>{
     res.clearCookie("token").status(200).json({ message: "Logged out successfully" });
        }



const refetchController=async(req,res,next)=>{
    try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    res.status(200).json(user);
  } catch (error) {
    next(error)
  }
}




module.exports={
    registerController,
    loginController,
    forgotPasswordController,
    resetPasswordController,
    logoutController,
    refetchController
}





