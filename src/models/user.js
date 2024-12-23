import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 90,
    },
    lastName: { type: String, required: false },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
    },
    age: { type: Number, required: false, min: 18 },
    gender: {
      type: String,
      required: false,
      validate(value) {
        if (!["male", "female", "other"].includes(value?.toLowerCase())) {
          throw new Error("Gender is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      required: false,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL");
        }
      },
      default:
        "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-Images.png",
    },
    about: {
      type: String,
      required: false,
      default: "Hey there! I am using Tinder.",
    },
    skills: { type: [String], required: false },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id },
    "SECRET_PASSWORD_FOR_JWT_DEV_NODE",
    {
      expiresIn: "1h",
    }
  );
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    user?.password
  );
  return isPasswordValid;
};
const userModel = mongoose.model("User", userSchema);

export default userModel;
