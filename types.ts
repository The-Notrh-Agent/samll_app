
export enum WorkerType {
  Caregiver = 'מטפלת',
  Assistant = 'סייעת',
  Substitute = 'מחליפה',
}

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  idNumber?: string;
  dateOfBirth: string; // YYYY-MM-DD
}

export interface Caregiver {
  id: string;
  firstName: string;
  lastName: string;
  idNumber?: string;
  workerType: WorkerType;
}

export interface Classroom {
  id: string;
  name: string;
  minCapacity: number;
  maxCapacity: number;
  assignedCaregiverIds: string[];
  minAge: number;
  maxAge: number;
  childIds: string[];
}

export type DataModel = 'children' | 'caregivers' | 'classrooms';

export type AppView = 'classrooms' | 'children' | 'caregivers' | 'settings' | 'import_export' | 'manage_classrooms';