import { Model, Document } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  background?: string;
  info?: string;
  games?: {
    favourites?: IOver[];
    pending?: IOver[];
    over?: IOver[];
  };
  friends?: {
    sent?: string[];
    pending?: string[];
    friends?: string[];
  };
}

export interface UserDocument extends IUser, Document {}

export interface UserModel extends Model<UserDocument> {
  checkCredentials(
    email: string,
    password: string
  ): Promise<UserDocument | null>;
}

export interface IOver {
  id: number;
  name: string;
  cover: string;
  rating: string;
  release_dates: IRelease[];
  platforms: IPlatform[];
  genres: IGenres[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPlatform {
  abbreviation: string;
  name: string;
}

export interface IGenres {
  name: string;
}

export interface IRelease {
  date: string;
}
