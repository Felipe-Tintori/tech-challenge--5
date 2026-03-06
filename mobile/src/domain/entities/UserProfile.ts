export type Neurodivergence = 'tdah' | 'tea' | 'dislexia' | 'ansiedade' | 'outro';

export interface StudyRoutine {
  daysOfWeek: number[]; // 0=Dom, 1=Seg, ..., 6=Sab
  startTime: string;    // HH:mm
  endTime: string;      // HH:mm
  breakInterval: number; // minutos
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  neurodivergence: Neurodivergence[];
  specificNeeds: string[];
  studyRoutine?: StudyRoutine;
  createdAt: string;
  updatedAt: string;
}

export type UpdateProfileDTO = Partial<Omit<UserProfile, 'id' | 'createdAt'>>;
