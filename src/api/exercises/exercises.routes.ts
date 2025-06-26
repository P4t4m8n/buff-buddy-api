import { Router } from "express";
import {
  createExercise,
  getExercises,
  updateExercise,
  getExerciseById,
  deleteExercise,
} from "./exercises.controller";

export const exerciseRoutes = Router();

exerciseRoutes.get("/", getExercises);
exerciseRoutes.get("/:id", getExerciseById);

exerciseRoutes.post("/edit", createExercise);
exerciseRoutes.put("/edit/:id", updateExercise);

exerciseRoutes.delete("/:id", deleteExercise);
