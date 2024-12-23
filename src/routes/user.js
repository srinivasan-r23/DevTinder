import express from "express";
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequestModel from "../models/ConnectionRequest.js";
import userModel from "../models/user.js";

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    res.send(connectionRequest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const connections = await ConnectionRequestModel.find({
      $or: [
        { toUserId: user._id, status: "accepted" },
        { fromUserId: user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "about",
        "skills",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "about",
        "skills",
      ]);

    const data = connections?.map((connection) => {
      if (connection.fromUserId._id.toString() === user._id.toString()) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const page = +req.query.page || 1;
    let limit = +req.query.limit || 10;
    limit = limit > 50 ? 50 : limit;

    const connections = await ConnectionRequestModel.find({
      $or: [
        {
          fromUserId: user._id,
        },
        { toUserId: user._id },
      ],
    }).select("toUserId fromUserId");
    const hideUsersFromFeed = new Set();
    connections.forEach((req) => {
      hideUsersFromFeed.add(req.toUserId.toString());
      hideUsersFromFeed.add(req.fromUserId.toString());
    });

    const users = await userModel
      .find({
        _id: { $nin: [...hideUsersFromFeed, user._id] },
      })
      .select("firstName lastName photoUrl about skills")
      .limit(limit)
      .skip((page - 1) * limit);

    res.send(users);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

export default userRouter;
