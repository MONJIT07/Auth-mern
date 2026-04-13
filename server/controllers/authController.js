import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from '../models/usermodel.js';

import transporter from "../config/nodemailer.js";
import{ EMAIL_VERIFICATION_TEMPLATE ,PASSWORD_RESET_TEMPLATE} from   "../config/emailTemplates.js";
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing details" });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
const user = new userModel({ name, email, password: hashedPassword});      
  await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        //SENDING WELCOME EMAIL TO NEW USER
        const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to Our App",
        text: `welcome to our app, ${name}! We're glad to have you on board. and your account has been successfully created.`
        }
        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: "User registered successfully", token });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and password are required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid email " });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid password" });
        }

        // Logic continues here to generate token and set cookie
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ success: true, message: "Login successful", token });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const logoutUser = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        return res.json({ success: true, message: "Logout successful" });
    }
    catch (error) {
        return res.json({ success: false, message: error.message });
    }
}
//send verify otp to user email
// send OTP
export const sendVerifyOtp = async (req, res) => {
  try {
   const userId = req.userId;
const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify Your Account",
      text: `Your OTP is ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent" });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// verify email
export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Already verified" });
    }

    if (user.verifyOtp != otp || user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = null;
    user.verifyOtpExpireAt = null;

    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
export const isAuthenticated = async(req, res) => {
  try {
   return res.json({ success: true});
    
  } catch (error) {
     res.json({ success: true, message: error.message })
  }


}; 
//send password reset otp to user email
export const sendPasswordResetOtp = async (req, res) => {
 
    const { email } = req.body;
    if (!email) {
      return res.json({ success: false, message: "Email is required" })
    }
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }


 const otp = Math.floor(100000 + Math.random() * 900000);

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() +15 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Pass Reset OTP",
      text: `your reset OTP is ${otp}.Use this OTP to reset your password. This OTP is valid for 15 minutes only.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: " OTP sent to email" });

      
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };
  //reset password
  export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if(!email || !otp || !newPassword) {
      return res.json({ success: false, message: "Email, OTP, and new password are required" });
    }
    try {
      
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }   
        if(user.resetOtp===''|| user.resetOtp != otp) {
          return res.json({ success: false, message: "Invalid OTP" });
        }

        if(user.resetOtpExpireAt < Date.now()) {
          return res.json({ success: false, message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
await user.save();
   return res.json({ success: true, message: "Password reset successful" }); 

    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  }