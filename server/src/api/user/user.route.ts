import "./user.openapi";

import express, { type Router } from "express";

import { getAllUsers } from "./user.service";

export const userRouter: Router = express.Router();

userRouter.get("/", getAllUsers);
