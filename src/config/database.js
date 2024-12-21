import { connect } from "mongoose";

export async function connectDB() {
  await connect(
    "mongodb+srv://srinismart2:Kv54C8oAVPB3Jwri@tinder-node.6b8qg.mongodb.net/devTinder"
  );
}
