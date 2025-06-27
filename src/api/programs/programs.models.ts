import { IBaseFilter } from "../../shared/models/base.model";

export interface IProgramFilter extends IBaseFilter {
  name?: string;
  exerciseTypes?: string;
  exerciseEquipment?: string;
  exerciseMuscles?: string;
  exerciseName?: string;
}

