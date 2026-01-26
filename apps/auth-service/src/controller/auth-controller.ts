//Register a new user

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
  verifyOtp,
} from "../utils/auth.helper.js";
import prisma from "../../../../packages/libs/prisma/index.js";
import bcrypt from "bcryptjs";
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

    const hashedPassword = await bcrypt.hash(passowrd, 10);

    const user = prisma.user.create({
      data: { name, email, password, hashedPassword },
    });

    res
      .status(201)
      .json({ success: true, message: "User registered successfully!" });
  } catch (err) {
    return next(error);
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

    if (!user) {
      return next(new AuthenticationError("Invalid email or password"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new AuthenticationError("Invalid email or password"));
    }

    //Generate access token and refresh token

    const accessToken = jwt.sign(
      { id: user.id, role: "User" },
      proccess.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: "User" },
      proccess.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "7d",
      },
    );

    //store the refresh and access token in an httpOnly secure cookie
    setCookie(res, "refresh-token", refreshToken);
    setCookie(res, "access-token", accessToken);

    res.status(200).json({
      message: "Login ssuccessful!",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    return next(error);
  }
};
