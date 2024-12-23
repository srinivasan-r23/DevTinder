import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true }
);


connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); // Compound index - whenever im making a query to find a connection request with fromId and toId, placing this will be faster
connectionRequestSchema.pre("save", async function (next) {
  const connectionRequest = this;
  const { fromUserId, toUserId } = connectionRequest;
  if (fromUserId.equals(toUserId)) {
    throw new Error("You can't send connection request to yourself");
  }
  next();
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

export default ConnectionRequestModel;
