import { Model, Document } from "mongoose";

interface IUser {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  games?: {
    favourites?: string[];
    pending?: string[];
    over?: string[];
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
