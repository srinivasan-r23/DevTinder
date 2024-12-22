import { Router } from "express";
import { userAuth } from "../middlewares/auth.js";

const requestRouter = Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const { firstName } = req?.user;
  res.send({ message: "Connection request sent", firstName });
});

export default requestRouter;
