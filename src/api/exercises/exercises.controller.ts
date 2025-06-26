import { Request, Response } from "express";
import { AppError } from "../../shared/services/Error.service";
import {
  CreateExerciseSchema,
  UpdateExerciseSchema,
} from "./exercises.validations";
import { exerciseService } from "./exercises.service";

export const getExercises = async (req: Request, res: Response) => {
  try {
    const filter = req.query as Record<string, string>;
    const exercises = await exerciseService.getAll(filter);

    res.status(200).json(
      exercises,
    );
  } catch (error) {
    const err = AppError.handleResponse(error);
    res.status(err.status || 500).json({
      message: err.message || "An unexpected error occurred",
      errors: err.errors || {},
    });
  }
};

export const getExerciseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exercise = await exerciseService.getBtyId(id);

    res.status(200).json({
      data: exercise,
    });
  } catch (error) {
    const err = AppError.handleResponse(error);
    res.status(err.status || 500).json({
      message: err.message || "An unexpected error occurred",
      errors: err.errors || {},
    });
  }
};

export const createExercise = async (req: Request, res: Response) => {
  try {
    const validatedData = CreateExerciseSchema.parse(req.body);

    const exercise = await exerciseService.add(validatedData);

    res.status(201).json({
      message: "Exercise created successfully",
      data: exercise,
    });
  } catch (error) {
    const err = AppError.handleResponse(error);
    res.status(err.status || 500).json({
      message: err.message || "An unexpected error occurred",
      errors: err.errors || {},
    });
  }
};

export const updateExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateExerciseSchema.parse(req.body);

    const exercise = await exerciseService.update(id, validatedData);

    res.status(200).json({
      data: exercise,
    });
  } catch (error) {
    const err = AppError.handleResponse(error);
    res.status(err.status || 500).json({
      message: err.message || "An unexpected error occurred",
      errors: err.errors || {},
    });
  }
};

export const deleteExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

  await exerciseService.delete(id);

    res.status(200).json({
      message: "Exercise deleted successfully",
    });
  } catch (error) {
    const err = AppError.handleResponse(error);
    res.status(err.status || 500).json({
      message: err.message || "An unexpected error occurred",
      errors: err.errors || {},
    });
  }
};
