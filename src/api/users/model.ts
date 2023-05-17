import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserDocument, UserModel } from "../../interfaces/IUser";

const { Schema, model } = mongoose;

const UsersSchema = new Schema(
  {
    username: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: false },
    info: { type: String, default: "Ey listen! I'm new here!" },
    avatar: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
    },
    background: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/GOODS_South_field.jpg/1024px-GOODS_South_field.jpg",
    },
    games: {
      favourites: [
        {
          id: Number,
          name: String,
          cover: String,
          rating: String,
          release_date: String,
          platforms: Array,
          genres: Array,
        },
      ],
      pending: [
        {
          id: Number,
          name: String,
          cover: String,
          rating: String,
          release_date: String,
          platforms: Array,
          genres: Array,
        },
      ],
      over: [
        {
          id: Number,
          name: String,
          cover: String,
          rating: String,
          release_date: String,
          platforms: Array,
          genres: Array,
        },
      ],
    },
    social: {
      sent: { type: [String], default: [] },
      pending: { type: [String], default: [] },
      friends: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

UsersSchema.pre("save", async function () {
  const newUserData = this;

  if (newUserData.isModified("password")) {
    const plainPW = newUserData.password;

    const hash = await bcrypt.hash(plainPW!, 11);
    newUserData.password = hash;
  }
});

UsersSchema.methods.toJSON = function () {
  const currentUserDocument = this;
  const currentUser = currentUserDocument.toObject();
  delete currentUser.password;
  delete currentUser.createdAt;
  delete currentUser.updatedAt;
  delete currentUser.__v;

  const games = currentUser.games;
  delete currentUser.games;
  const friends = currentUser.friends;
  delete currentUser.friends;
  currentUser.games = games;
  currentUser.friends = friends;

  return currentUser;
};

UsersSchema.static("checkCredentials", async function (email, plainPW) {
  const user = await this.findOne({ email });

  if (user) {
    const passwordMatch = await bcrypt.compare(plainPW, user.password);

    if (passwordMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
});

export default model<UserDocument, UserModel>("user", UsersSchema);
