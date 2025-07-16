// src/components/admin/tools/ToolForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAddTool } from "@/hooks/useTools";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
/* import Image from "next/image"; */

interface ToolFormValues {
  name: string;
  description: string;
  imageUrl: FileList;
  stockTotal: number;
}

interface ToolFormProps {
  onFormSubmit: () => void;
}

export default function ToolForm({ onFormSubmit }: ToolFormProps) {
  const { mutate: addTool, isPending: isAddingTool } = useAddTool();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ToolFormValues>();

  const onSubmit = async (data: ToolFormValues) => {
    setIsUploadingImage(true);
    const promise = () =>
      new Promise(async (resolve, reject) => {
        const imageFile = data.imageUrl[0];
        const formData = new FormData();
        formData.append("image", imageFile);

        let imageUrl = "";
        try {
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadRes.ok) {
            throw new Error("Error al subir la imagen.");
          }

          const uploadData = await uploadRes.json();
          imageUrl = uploadData.imageUrl;
          setIsUploadingImage(false);
        } catch (error: unknown) {
          setIsUploadingImage(false);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Error desconocido al subir la imagen.";
          return reject(new Error(errorMessage));
        }

        addTool(
          { ...data, imageUrl },
          {
            onSuccess: (createdTool) => {
              onFormSubmit();
              reset();
              resolve(createdTool);
            },
            onError: (error) => {
              reject(error);
            },
          }
        );
      });

    toast.promise(promise, {
      loading: "Creando herramienta...",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      success: (createdTool: any) =>
        `Herramienta "${createdTool.name}" creada con éxito.`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: (err: any) => `Error: ${err.message}`,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          {...register("name", {
            required: "El nombre es obligatorio.",
            minLength: { value: 3, message: "Mínimo 3 caracteres." },
          })}
          disabled={isAddingTool || isUploadingImage}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          {...register("description", {
            required: "La descripción es obligatoria.",
            minLength: { value: 10, message: "Mínimo 10 caracteres." },
          })}
          disabled={isAddingTool || isUploadingImage}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Imagen</Label>
        <Input
          id="imageUrl"
          type="file"
          accept="image/*"
          {...register("imageUrl", {
            required: "La imagen es obligatoria.",
          })}
          disabled={isAddingTool || isUploadingImage}
        />
        {errors.imageUrl && (
          <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
        )}
        {watch("imageUrl") && watch("imageUrl").length > 0 && (
          <div className="mt-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={URL.createObjectURL(watch("imageUrl")[0])}
              alt="Previsualización"
              className="max-h-32 rounded-md border object-contain"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="stockTotal">Stock Total</Label>
        <Input
          id="stockTotal"
          type="number"
          {...register("stockTotal", {
            required: "El stock es obligatorio.",
            valueAsNumber: true,
            min: { value: 1, message: "El stock debe ser al menos 1." },
          })}
          disabled={isAddingTool || isUploadingImage}
        />
        {errors.stockTotal && (
          <p className="text-sm text-destructive">
            {errors.stockTotal.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isAddingTool || isUploadingImage}>
          {isAddingTool || isUploadingImage
            ? "Creando..."
            : "Crear Herramienta"}
        </Button>
      </div>
    </form>
  );
}
