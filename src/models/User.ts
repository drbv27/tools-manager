import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  cargo: string;
  role: "employee" | "admin";
  provider: "email" | "google";
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: [true, "El nombre es obligatorio."] },
    email: {
      type: String,
      required: [true, "El email es obligatorio."],
      unique: true,
    },
    password: { type: String },
    image: { type: String },
    cargo: { type: String, required: [true, "El cargo es obligatorio."] },
    role: { type: String, enum: ["employee", "admin"], default: "employee" },
    provider: { type: String, enum: ["email", "google"], default: "email" },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
