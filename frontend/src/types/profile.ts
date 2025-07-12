// src/types/profile.ts

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface PetProfile {
  id: string;
  userName: string;
  age: number;
  petType: string;
  location: string;
  photoPath: string;
  likedUserIds: string[];
  likedByUserIds: string[];
}
