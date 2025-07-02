import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    ClientName: { type: String, required: true },
    MemberOf: { type: String},
    phone: { type: String },
    address: { type: String },
    mofNo: { type: String },
    city: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    role: { type: String, enum: ["admin", "user", "client"], default: "user" }, //Role based access
  },
  { timestamps: true }
);

export default mongoose.model("Client", ClientSchema);
    