import { Request, Response } from "express";
import { AppError } from "../../shared/services/Error.service";
import { programsService } from "./programs.service";
import {
  CreateProgramSchema,
  UpdateProgramSchema,
} from "./programs.validations";
import { asyncLocalStorage } from "../../middlewares/localStorage.middleware";

export const getPrograms = async (req: Request, res: Response) => {
  try {
    const filter = req.query as Record<string, string>;
    const programs = await programsService.getAll(filter);
    res.status(200).json(programs);
  } catch (error) {
    const err = AppError.handleResponse(error);
    res.status(err.status || 500).json({
      message: err.message || "An unexpected error occurred",
      errors: err.errors || {},
    });
  }
};

export const getProgramById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const program = await programsService.getById(id);
    if (!program) {
      throw new AppError("Program not found", 404);
    }
    res.status(200).json(program);
  } catch (error) {
    const err = AppError.handleResponse(error);
    res.status(err.status || 500).json({
      message: err.message || "An unexpected error occurred",
      errors: err.errors || {},
    });
  }
};

export const createProgram = async (req: Request, res: Response) => {
  try {
    const validatedData = CreateProgramSchema.parse(req.body);
    const id = asyncLocalStorage.getStore()?.sessionUser?.id;
    if (!id) {
      throw new AppError("User not authenticated", 401);
    }
    const program = await programsService.create(validatedData, id);
    res.status(201).json({
      message: "Program created successfully",
      data: program,
    });
  } catch (error) {
    const err = AppError.handleResponse(error);
    res.status(err.status || 500).json({
      message: err.message || "An unexpected error occurred",
      errors: err.errors || {},
    });
  }
};

export const updateProgram = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateProgramSchema.parse(req.body);
    const program = await programsService.update(id, validatedData);
    res.status(200).json({
      message: "Program updated successfully",
      data: program,
    });
  } catch (error) {
    const err = AppError.handleResponse(error);
    res.status(err.status || 500).json({
      message: err.message || "An unexpected error occurred",
      errors: err.errors || {},
    });
  }
};

export const deleteProgram = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const program = await programsService.delete(id);
    res.status(200).json({
      message: "Program deleted successfully",
      data: program,
    });
  } catch (error) {
    const err = AppError.handleResponse(error);
    res.status(err.status || 500).json({
      message: err.message || "An unexpected error occurred",
      errors: err.errors || {},
    });
  }
};
