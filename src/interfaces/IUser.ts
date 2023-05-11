import { Model, Document } from "mongoose";

interface IUser {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  background?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}
