// src/lib/dbConnect.ts
import mongoose from "mongoose";
import "@/models/Tool";
import "@/models/Request";
import "@/models/Notification";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose; // <-- CAMBIO: Deshabilitar no-explicit-any

if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (global as any).mongoose = { conn: null, promise: null }; // <-- CAMBIO: Deshabilitar no-explicit-any
}

async function dbConnect() {
  if (cached.conn) {
    console.log("🚀 Reutilizando conexión a la base de datos cacheada.");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("✨ Creando una nueva promesa de conexión a la base de datos.");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ Nueva conexión a la base de datos establecida.");
    return cached.conn;
  } catch (e: unknown) {
    cached.promise = null;
    throw e;
  }
}

export default dbConnect;
