import { Router } from "express";
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequestModel from "../models/ConnectionRequest.js";
import userModel from "../models/user.js";

const requestRouter = Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      if (allowedStatus.includes(status) === false) {
        return res.status(400).json({ message: "Invalid status " + "status" });
      }

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      const toUser = await userModel.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already sent" });
      }

      const connectionRequest = await ConnectionRequestModel.create({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.send({
        message: `${req.user.firstName} is ${status} ${toUser?.firstName}`,
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    const user = req.user;
    const allowedStatus = ["accepted", "rejected"];
    const status = req.params.status;
    const requestId = req.params.requestId;

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const connectionRequest = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: user._id,
      status: "interested",
    });
    if (!connectionRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.send({ message: "Request " + status, data });
    try {
    } catch (error) {
      res.send(500).json({ message: error.message });
    }
  }
);

export default requestRouter;
