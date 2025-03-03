import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import transporter from "../config/email.js";
import { verificationTemplate } from "../utils/verficationTemplate.js";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { resetPasswordTemplate } from "../utils/resetPasswordTemplate.js";
export const registerController = async (request, response, next) => {
  try {
    const { username, email, password } = request.body;
    if (!username || !email || !password) {
      return response.status(400).json({ message: "All fields required" });
    }

    // Check email is exist or not
    let existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return response.status(400).json({ message: "Email already exists" });
    }

    let hashPassword = await bcrypt.hash(password, 10);

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const emailVerificationToken = generateToken();
    const emailVerificationExpires = Date.now() + 10 * 60 * 1000;
    const newUser = await User.create({
      name: username,
      email,
      password: hashPassword,
      otp,
      emailVerificationToken,
      emailVerificationExpires,
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Verify your email",
      html: verificationTemplate(otp),
    });
    response.status(200).json({
      message: "OTP sent to your registered email Id",
      emailVerificationToken,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (request, response, next) => {
  try {
    const { token } = request.params;
    const { OTP: otp } = request.body;

    if (!token) {
      return response.status(400).json({ message: "Timeout, Try again" });
    }

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return response.status(400).json({ message: "Invalid Token" });
    }

    if (user.emailVerificationExpires < Date.now()) {
      return response.status(400).json({ message: "Timeout, Try again" });
    }

    if (String(otp) !== String(user.otp)) {
      return response.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.emailVerificationExpires = null;
    user.emailVerificationToken = null;
    user.otp = null;
    await user.save();

    response.status(200).json({ message: "Email verified" });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return response.status(400).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return response.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { email: user.email },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { email: user.email },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.status(201).json({
      message: "LogIn successfull",
      accessToken: accessToken,
      user: {
        name: user.name,
        isVerified: user.isVerified,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const sendEmailToResetPassword = async (request, response, next) => {
  try {
    const { email } = request.body;
    if (!email) {
      return response.status(400).json({ message: "Email is required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(400).json({ message: "User not found" });
    }

    let resetPasswordToken = generateToken();
    let resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    // sending mail to reset password
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Your Password",
      html: resetPasswordTemplate(
        `${process.env.FRONTEND_URL}/reset-password/${resetPasswordToken}`
      ),
    });

    user.resetPasswordExpires = resetPasswordExpires;
    user.resetPasswordToken = resetPasswordToken;
    await user.save();

    response.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (request, response, next) => {
  try {
    const { password, confirmPassword } = request.body;
    const { token } = request.params;
    if (!password || !confirmPassword) {
      return response.status(400).json({ message: "Password is required!" });
    }

    if (password !== confirmPassword) {
      return response.status(400).json({ message: "Password does not match!" });
    }

    if (!token) {
      return response
        .status(400)
        .json({ message: "Token is required to reset password" });
    }

    const user = await User.findOne({ resetPasswordToken: token });

    if (!user) {
      return response.status(400).json({ message: "Token expired" });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return response
        .status(400)
        .json({ message: "Link expired, Try to get new reset link" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user.password = hashPassword;
    user.resetPasswordExpires = null;
    user.resetPasswordToken = null;
    await user.save();

    response.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const email = req.email; // Assuming `req.user` contains authenticated user info

    if (!email) {
      return res.status(400).json({ message: "User ID is required!" });
    }

    // Find and delete the user
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "Account deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required!" });
    }

    // Find user with this refresh token and remove it
    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(404).json({ message: "Refresh Token expired" });
    }

    // Remove the refresh token from the database
    user.refreshToken = null;
    await user.save();

    // Clear the refresh token cookie (if using cookies)
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    next(error);
  }
};

export const profileController = async (request, response, next) => {
  try {
    const email = request.email;
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(400).json({ message: "User not found" });
    }
    return response.status(201).json({
      user: {
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (request, response, next) => {
  try {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, data) => {
      if (err)
        return response.status(403).json({ message: "Invalid refresh token!" });
    });

    const user = await User.findOne({ refreshToken });

    if (!user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = jwt.sign(
      { email: user.email },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    return response.status(201).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const sendOTP = async (request, response, next) => {
  try {
    const email = request.email;
    if (!email) {
      return response.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return response.status(400).json({ message: "User not found" });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Verify your email",
      html: verificationTemplate(otp),
    });

    const emailVerificationToken = generateToken();
    const emailVerificationExpires = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;
    await user.save();

    response.status(200).json({
      message: "OTP sent to your registered email Id",
      emailVerificationToken,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (request, response, next) => {
  try {
    const email = request.email;
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(400).json({ message: "User not found" });
    }
    if (user.role === "admin") {
      const users = await User.find({ _id: { $ne: user._id } });
      return response.status(201).json({ users });
    }
    return response.status(400).json({
      message: "You are not authorized to access this page",
      users: {
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};
