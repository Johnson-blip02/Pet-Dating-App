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
