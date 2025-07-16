// src/models/Request.ts

import mongoose, { Schema, Document } from "mongoose";
import { ITool } from "./Tool";

export interface IRequest extends Document {
  user: string;
  tool: ITool["_id"];
  justification: string;
  status: "pendiente" | "aprobada" | "rechazada" | "devuelta";
  approvedOrRejectedAt?: Date;
  returnedAt?: Date;
  createdAt: Date;
}

const RequestSchema: Schema = new Schema(
  {
    user: {
      type: String, // Aceptamos el ID de Clerk como un string
      required: true,
    },
    tool: {
      type: Schema.Types.ObjectId,
      ref: "Tool",
      required: true,
    },
    justification: {
      type: String,
      required: [true, "La justificación es obligatoria."],
    },
    status: {
      type: String,
      enum: ["pendiente", "aprobada", "rechazada", "devuelta"],
      default: "pendiente",
    },
    approvedOrRejectedAt: {
      type: Date,
    },
    returnedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Request ||
  mongoose.model<IRequest>("Request", RequestSchema);
