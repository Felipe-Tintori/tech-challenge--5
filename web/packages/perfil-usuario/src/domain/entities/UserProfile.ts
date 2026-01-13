export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  neurodivergence?: string[];
  specificNeeds: string[];
  studyRoutine?: StudyRoutine;
  workRoutine?: WorkRoutine;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudyRoutine {
  days: string[]; // ['monday', 'tuesday', ...]
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  breakInterval: number; // minutos
  subjects: string[];
}

export interface WorkRoutine {
  days: string[];
  startTime: string;
  endTime: string;
  breakInterval: number;
  projects: string[];
}

export interface UpdateProfileDTO {
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  neurodivergence?: string[];
  specificNeeds?: string[];
  studyRoutine?: StudyRoutine;
  workRoutine?: WorkRoutine;
}
