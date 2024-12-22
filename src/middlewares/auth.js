import jwt from "jsonwebtoken";
import userModel from "../models/user.js";

export const userAuth = async (req, res, next) => {
  try {
    const token = req?.cookies?.token;
    if (!token) throw new Error("Unauthorized");
    const decodedMsg = await jwt.verify(
      token,
      "SECRET_PASSWORD_FOR_JWT_DEV_NODE"
    );
    if (decodedMsg?._id) {
      const user = await userModel.findById(decodedMsg?._id);
      if (!user) throw new Error("Invalid credentials");
      else {
        req.user = user;
        next();
      }
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(401).send({ message: "Unauthorized" });
  }
};
