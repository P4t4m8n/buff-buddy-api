import { Request, Response, NextFunction } from "express";
import { asyncLocalStorage } from "./localStorage.middleware";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const store = asyncLocalStorage.getStore();
  if (!store?.sessionUser) {
    res.status(401).send("Not Authenticated");
    return;
  }

  next();
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const store = asyncLocalStorage.getStore();
  const sessionUser = store?.sessionUser;

  if (!sessionUser) {
    res.status(401).send("Not Authenticated");
    return;
  }

  if (!sessionUser.isAdmin) {
    res.status(403).send("Not Authorized");
    return;
  }

  next();
}
