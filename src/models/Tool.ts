import mongoose, { Schema, Document } from "mongoose";

export interface ITool extends Document {
  name: string;
  description: string;
  imageUrl: string;
  stockTotal: number;
  stockOnLoan: number;
}

const ToolSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio."],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria."],
    },
    imageUrl: {
      type: String,
      required: [true, "La URL de la imagen es obligatoria."],
    },
    stockTotal: {
      type: Number,
      required: [true, "El stock total es obligatorio."],
      min: 0,
    },
    stockOnLoan: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.Tool ||
  mongoose.model<ITool>("Tool", ToolSchema);
