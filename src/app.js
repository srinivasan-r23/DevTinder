import express from "express";
import { connectDB } from "./config/database.js";
import userModel from "./models/user.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/request.js";
import userRouter from "./routes/user.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
