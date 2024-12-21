import express from "express";

const app = express();

app.use(
  "/user",
  [(req, res, next) => {
    console.log("First handler");
    next();
  },
  [(req, res, next) => {
    console.log("Second handler");
    next();
  }]],
  [(req, res, next) => {
    console.log("Third handler");
    res.send('End');
    next();
  },
  (req, res, next) => {
    console.log("Fourth handler");
  }]
);

app.listen(3000, () => console.log("Server listening on Port 3000"));
