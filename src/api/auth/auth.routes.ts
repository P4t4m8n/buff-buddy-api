import { Router } from "express";
import {
  getSessionUser,
  googleCallback,
  signIn,
  signOut,
  signUp,
} from "./auth.controller";

export const authRoutes = Router();

authRoutes.post("/sign-in", signIn);
authRoutes.post("/sign-up", signUp);

authRoutes.post("/sign-out", signOut);

authRoutes.get("/google/callback", googleCallback);
authRoutes.get("/session-user", getSessionUser);
