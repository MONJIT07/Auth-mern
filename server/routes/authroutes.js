import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendPasswordResetOtp,
  resetPassword,
} from "../controllers/authController.js";

import userAuth from "../middleware/userauth.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.post("/send-verify-otp",userAuth, sendVerifyOtp);
authRouter.post("/verify-email", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, isAuthenticated);
authRouter.post("/send-reset-otp", sendPasswordResetOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;