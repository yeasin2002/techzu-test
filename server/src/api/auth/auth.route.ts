import "./auth.openapi";

import express, { type Router } from "express";

import { requireAuth } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validation.middleware";

import { getMe, login, signup } from "./auth.service";
import { loginSchema, signupSchema } from "./auth.validation";

export const authRouter: Router = express.Router();

authRouter.post("/signup", validateBody(signupSchema), signup);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.get("/me", requireAuth, getMe);
