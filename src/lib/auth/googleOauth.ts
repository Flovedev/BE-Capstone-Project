import passportGoogle from "passport-google-oauth20";
import UsersModel from "../../api/users/model";
import { createAccessToken } from "./tools";

const GoogleStrategy = passportGoogle.Strategy;

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
    callbackURL: `${process.env.BE_DEV_URL}/users/googleRedirect`,
  },
  async (_, __, profile, passportNext) => {
    try {
      const { email, name, sub } = profile._json;
      //   console.log("PROFILE:", profile);
      const user = await UsersModel.findOne({ email });
      if (user) {
        const accessToken = await createAccessToken({
          _id: user._id,
        });
        passportNext(null, { accessToken });
      } else {
        const newUser = new UsersModel({
          username: name,
          email,
          googleId: sub,
        });

        const createdUser = await newUser.save();
        const accessToken = await createAccessToken({
          _id: createdUser._id,
        });

        passportNext(null, { accessToken });
      }
    } catch (error) {
      passportNext(error as string);
    }
  }
);

export default googleStrategy;
