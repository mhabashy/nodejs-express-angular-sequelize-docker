import {Patient} from './patient';

export interface IClinic {
  id: number,
  title?: string;
  date?: string;
  desiredAttendance: string;
  createAt: Date;
  updateAt: Date;
  Patients: Patient[];
  psychiatrist?: boolean;
}
