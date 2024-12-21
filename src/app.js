import express from "express";

const app = express();

app.get("/getUserData", (req, res) => {
  throw new Error("Random error");
  res.send("User Data Sent");
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});
app.listen(3000, () => console.log("Server listening on Port 3000"));
