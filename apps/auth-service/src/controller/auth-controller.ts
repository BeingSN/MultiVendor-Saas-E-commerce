//Register a new user

import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../../../packages/middleware/error-handler/index.js";
import {
  checkOtpRestrictions,
  sendOtp,
  trackOtpRequests,
  validateRegisrationData,
} from "../utils/auth.helper.js";
import prisma from "../../../../packages/libs/prisma/index.js";

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
