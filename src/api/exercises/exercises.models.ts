import { IBaseFilter } from "../../shared/models/base.model";

export interface IExerciseFilter extends IBaseFilter {
  name?: string;
  types?: string;
  equipment?: string;
  muscles?: string;
}


