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

connectDB()
  .then(() => {
    console.log("DB connection established");
    app.listen(3000, () => console.log("Server listening on Port 3000"));
  })
  .catch((err) => console.log(err));
