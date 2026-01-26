import { Request, Response, NextFunction } from "express";
import {
  AuthenticationError,
  ValidationError,
} from "../../../../packages/middleware/error-handler/index.js";
import {
  checkOtpRestrictions,
  sendOtp,
  trackOtpRequests,
  validateRegisrationData,
  verifyForgotPasswordOtp,
  verifyOtp,
} from "../utils/auth.helper.js";
import prisma from "../../../../packages/libs/prisma/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCookie.js";

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    validateRegisrationData(req.body, "user");
    const { name, email } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return next(new ValidationError("User already exist with this email"));
    }

    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);
    await sendOtp(name, email, "user-activation-mail");
    return res
      .status(200)
      .json({ message: "OTP sent to email please verify your account." });
  } catch (err) {
    return next(err);
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp, password, name } = req.body;

    if (!email || !otp || !password || !name) {
      return next(new ValidationError("All fields are requried!"));
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return next(new ValidationError("User already exist"));
    }
    await verifyOtp(email, otp, next);

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res
      .status(201)
      .json({ success: true, message: "User registered successfully!" });
  } catch (err) {
    return next(err);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError("Email and password are required"));
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return next(new AuthenticationError("Invalid email or password"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new AuthenticationError("Invalid email or password"));
    }

    //Generate access token and refresh token

    const accessToken = jwt.sign(
      { id: user.id, role: "User" },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: "User" },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "7d",
      },
    );

    //store the refresh and access token in an httpOnly secure cookie
    setCookie(res, "refresh-token", refreshToken);
    setCookie(res, "access-token", accessToken);

    res.status(200).json({
      message: "Login successful!",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    return next(error);
  }
};

// user fotgot password

export const userForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await handleForgotPassword(req, res, next, "user");
};

export const handleForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "user" | "seller",
) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ValidationError("email is requried");
    }

    const user =
      userType === "user" &&
      (await prisma.user.findUnique({ where: { email } }));

    if (!user) {
      throw new ValidationError(`${userType} not found!`);
    }

    //check otp restrictions

    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);

    //Generate OTP and send Email

    await sendOtp(email, user.name, "forgot-password-user-mail");
    res
      .status(200)
      .json({ message: "OTP send to email, please verify your account" });
  } catch (err) {}
};

//verify forget password otp
export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await verifyForgotPasswordOtp(req, res, next);
};

export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      throw new ValidationError("Email and password are required");
    }
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return next(new ValidationError("user not found"));
    }

    if (!user.password) {
      return next(new ValidationError("User password not set"));
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return next(
        new ValidationError(
          "New password cannot be the same as the old password",
        ),
      );
    }

    //hash the new pwd

    const hasedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hasedPassword },
    });
    return res.status(200).json({ message: "Password reset successfully!" });
  } catch (err) {
    return next(err);
  }
};
