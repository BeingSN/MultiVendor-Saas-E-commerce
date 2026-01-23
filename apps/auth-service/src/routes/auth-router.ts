import express, { Router } from "express";
import { userRegistration } from "../controller/auth-controller.js";

const router: Router = express.Router();

router.post("/user-registration", userRegistration);

export default router;
