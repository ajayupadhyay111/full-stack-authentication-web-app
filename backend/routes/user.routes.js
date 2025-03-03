import express from "express";
import {
  deleteAccount,
  loginController,
  logout,
  profileController,
  refreshToken,
  registerController,
  resetPassword,
  sendEmailToResetPassword,
  sendOTP,
  verifyEmail,
  getAllUsers,
} from "../controllers/user.controllers.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { googleLogin } from "../controllers/googleLoginController.js";
const router = express.Router();

router.route("/register").post(registerController);
router.route("/verify-email/:token").post(verifyEmail);
router.route("/login").post(loginController);
router.route("/sendEmailToResetPassword").post(sendEmailToResetPassword);
router.route("/resetPassword/:token").post(resetPassword);
router.route("/logout").post(authenticateToken, logout);
router.route("/deleteAccount").delete(authenticateToken, deleteAccount);
router.route("/refreshToken").get(refreshToken);
router.route("/getUserProfile").get(authenticateToken, profileController);
router.route("/sendOTP").post(authenticateToken, sendOTP);
router.route("/getAllUsers").get(authenticateToken,getAllUsers)


// social login routes
router.get("/google",googleLogin)
export default router;
  