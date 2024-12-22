import express from "express";
import { connectDB } from "./config/database.js";
import userModel from "./models/user.js";
import { validateSignUpData } from "./utils/validation.js";
import bcrypt from "bcrypt";
import validator from "validator";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    //Validate
    validateSignUpData(req);
    const { firstName, lastName, email, password, about } = req?.body;
    //Encrypt
    const hashedPwd = await bcrypt.hash(password, 10);
    console.log(hashedPwd);
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email address");
    }
    const user = await userModel.findOne({ email });
    if (user?.id) {
      const passwordValid = await bcrypt.compare(password, user?.password);
      if (passwordValid) {
        res.send({ message: "Login successful" });
      } else res.status(401).send({ message: "Invalid credentials" });
    } else throw new Error("Invalid credentials");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.get("/user", async (req, res) => {
  const email = req?.query?.email;
  try {
    const user = await userModel.findOne({ email });
    if (user?.id) res.send(user);
    else res.status(404).send({ message: "User not found" });
  } catch (err) {
    res.status(500).send({ message: err?.message });
  }
});

app.delete("/user", async (req, res) => {
  const id = req?.query?.id;
  try {
    const user = await userModel.findByIdAndDelete(id);
    if (user) res.send({ message: "User deleted successfully" });
    else res.status(404).send({ message: "User not found" });
  } catch (err) {
    res.status(500).send({ message: err?.message });
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await userModel.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.patch("/user/:id", async (req, res) => {
  const data = req.body;
  const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "password", "age"];
  try {
    const isUpdateAllowed = Object.keys(data).every((update) =>
      ALLOWED_UPDATES.includes(update)
    );
    if (!isUpdateAllowed) {
      return res.status(400).send({ message: "Invalid update operation" });
    }
    const doc = await userModel.findByIdAndUpdate(req?.params?.id, req?.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (doc) {
      res.send({ message: "User updated successfully" });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

connectDB()
  .then(() => {
    console.log("DB connection established");
    app.listen(3000, () => console.log("Server listening on Port 3000"));
  })
  .catch((err) => console.log(err));
