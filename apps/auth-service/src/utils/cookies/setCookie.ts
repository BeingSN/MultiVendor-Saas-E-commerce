import type { Response as ExpressResponse } from "express";

export const setCookie = (
  res: ExpressResponse,
  name: string,
  value: string,
) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
