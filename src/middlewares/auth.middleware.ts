// import { Request, Response, NextFunction } from "express";
// import { asyncLocalStorage } from "./localStorage.middleware";
// import Logger from "../src/services/Logger.service";

// export async function requireAuth(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   const store = asyncLocalStorage.getStore();
//   if (!store?.loggedinUser) {
//     res.status(401).send("Not Authenticated");
//     return;
//   }

//   next();
// }

// export async function requireAdmin(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   const store = asyncLocalStorage.getStore();
//   const loggedinUser = store?.loggedinUser;

//   if (!loggedinUser) {
//     res.status(401).send("Not Authenticated");
//     return;
//   }

//   if (!loggedinUser.isTrainer) {
//     Logger.warn(`${loggedinUser.id} attempted to perform admin action`);
//     res.status(403).send("Not Authorized");
//     return;
//   }

//   next();
// }
