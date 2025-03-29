// ✅ training-list.model.ts
export interface Employee {
  name: string;
  lastName: string;
  email: string;
  departmentName: string;
}

export interface TrainingWithParticipants {
  trainingId: number;
  trainingName: string;
  trainingType: string;
  startDate: string;
  endDate: string;
  location: string;
  participants: Employee[];
}
export interface TrainerInfo {
  name: string;
  lastName: string;
  email: string;
  departmentName: string;
  trainingName: string;
  trainingType: string;
  location: string;
  startDate: string;
  endDate: string;
}