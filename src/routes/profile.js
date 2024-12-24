import { Router } from "express";
import { userAuth } from "../middlewares/auth.js";
import { validateEditProfile } from "../utils/validation.js";
import validator from "validator";
import bcrypt from "bcrypt";

const profileRouter = Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req?.user;
    res.send(user);
  } catch (err) {
    res.status(401).send({ message: "Unauthorized" });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isAllowed = validateEditProfile(req);
    if (!isAllowed) {
      throw new Error("Invalid Edit request");
    }

    const user = req.user;
    Object.keys(req.body).forEach((field) => {
      user[field] = req.body[field];
    });
    const _user = await user.save();
    res.send({ message: "Profile updated successfully", user: _user });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;
    const isPasswordValid = await user.validatePassword(oldPassword);
    const isStrongPassword = validator.isStrongPassword(newPassword);
    if (isPasswordValid && isStrongPassword) {
      const hashedPwd = await bcrypt.hash(newPassword, 10);
      user.password = hashedPwd;
      await user.save();
      res.send({ message: "Password updated successfully" });
    } else {
      res.status(400).send({ message: "Invalid password" });
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

export default profileRouter;
