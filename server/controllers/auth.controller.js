import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import sendEmail from "../utils/emailSender.js";
import crypto from "crypto";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender, email } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "Username already exists." });
    }
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return res.status(400).json({ error: "Email already exists." });
    }

    //HASH  THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      email,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      //Generate JWT token here

      await newUser.save(); //First save the user to the database
      generateTokenAndSetCookie(newUser._id, res); // then generate the token and set the cookie


      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid User Data" });
    }
  } catch (error) {
    console.log("Error in signup controller ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user =  await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare( password, user?.password || "");

        if( !username || !isPasswordCorrect ){
            return res.status(400).json({ error:"Invalid Username or Password." });
        }

        generateTokenAndSetCookie( user._id, res );

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
          });

    } catch (error) {
        console.log("Error in login controller ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge:0 });
    res.status(200).json({message : "Logged Out successfully"})
  } catch (error) {
    console.log("Error in logout controller ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Forgot Password Controller
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ error: "No user with that email found." });
    }

    // Generate reset token & hash it
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // update the .env for the Frontend_Url

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const emailHtml = `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>This link is valid for 10 minutes.</p>
    `;

    await sendEmail(user.email, "Password Reset Request", emailHtml);

    res.status(200).json({
      status: "success",
      message: "Password reset token sent to your email.",
    });
  } catch (error) {
    console.error("Error in forgot password controller:", error.message);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// Reset Password Controller
export const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;
        const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    
        const user = await User.findOne({ 
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() } 
        });
    
        if (!user) {
          return res.status(400).json({ error: "Invalid or expired token" });
        }
    
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }
    
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
    
        await user.save();
    
        generateTokenAndSetCookie(user._id, res);
    
        res.status(200).json({
            status: "success",
            message: "Password reset successfully.",
        });
    } catch (error) {
        console.log("Error in reset password controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};