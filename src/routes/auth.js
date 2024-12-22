import { Router } from "express";
import { validateSignUpData } from "../utils/validation.js";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/user.js";

const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //Validate
    validateSignUpData(req);
    const { firstName, lastName, email, password, about } = req?.body;
    //Encrypt
    const hashedPwd = await bcrypt.hash(password, 10);
    //Create the user instance
    const user = new userModel({
      firstName,
      lastName,
      email,
      password: hashedPwd,
      about,
    });
    await user.save();
    res.send({ message: "User saved successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email address");
    }
    const user = await userModel.findOne({ email });
    if (user?.id) {
      const passwordValid = await user.validatePassword(password);
      if (passwordValid) {
        const token = await user.getJWT();
        res.cookie("token", token, { expires: new Date(Date.now() + 3600000) });
        res.send({ message: "Login successful" });
      } else res.status(401).send({ message: "Invalid credentials" });
    } else throw new Error("Invalid credentials");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.send({ message: 'Logged out successfully' });
});

export default authRouter;
