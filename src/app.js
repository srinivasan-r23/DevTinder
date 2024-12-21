import express from "express";

const app = express();

app.use("/", (req, res) => {
  res.send("Hello from the root server!!");
});

app.use("/hello", (req, res) => {
  res.send("Hello from the hello server!!");
});

app.use("/test", (req, res) => {
  res.send("Hello from the test server!!");
});

app.listen(3000, () => console.log("Server listening on Port 3000"));
