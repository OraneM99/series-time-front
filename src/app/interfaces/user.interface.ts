import { SerieInterface } from './serie.interface';

export interface UserInterface {
  id: number;
  username: string;
  email: string;
  roles: string[];
  isVerified: boolean;
  profilePicture?: string | null;
  isActive: boolean;
  createdAt: string;
  favoriteSeries: SerieInterface[];
}
