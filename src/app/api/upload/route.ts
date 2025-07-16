// src/app/api/upload/route.ts
import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(new Error("Error al subir la imagen a Cloudinary."));
        }
        if (!result) {
          return reject(new Error("No se obtuvo resultado de Cloudinary."));
        }
        resolve(result.secure_url);
      })
      .end(buffer);
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No se proporcionó ningún archivo de imagen.",
        },
        { status: 400 }
      );
    }

    const imageUrl = await uploadToCloudinary(file);

    return NextResponse.json({ success: true, imageUrl }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error en la API de subida:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error interno del servidor al procesar la subida.";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
