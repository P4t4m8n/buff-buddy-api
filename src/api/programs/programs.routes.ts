import { Router } from "express";
import {
  createProgram,
  deleteProgram,
  getProgramById,
  getPrograms,
  updateProgram,
} from "./programs.controller";

export const programsRoutes = Router();

programsRoutes.get("/", getPrograms);
programsRoutes.get("/:id", getProgramById);

programsRoutes.post("/edit", createProgram);
programsRoutes.put("/edit/:id", updateProgram);

programsRoutes.delete("/:id", deleteProgram);
