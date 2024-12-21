import express from "express";
import { connectDB } from "./config/database.js";
import userModel from "./models/user.js";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const user = new userModel(req.body);
    await user.save();
    res.send({ message: "User saved successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.get("/user", async (req, res) => {
  const email = req?.query?.email;
  try {
    const user = await userModel.findOne({ email });
    console.log(user);
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

app.patch("/user", async (req, res) => {
  const data = req.body;
  try {
    const doc = await userModel.findByIdAndUpdate(data?.id, req?.body, {
      returnDocument: "after",
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
