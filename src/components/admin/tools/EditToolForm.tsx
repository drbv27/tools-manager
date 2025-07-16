// src/components/admin/tools/EditToolForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateTool } from "@/hooks/useTools";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { ITool } from "@/models/Tool";

interface EditToolFormValues {
  name: string;
  description: string;
  imageUrl: FileList | string;
  stockTotal: number;
}

interface EditToolFormProps {
  onFormSubmit: () => void;
  tool: ITool;
}

export default function EditToolForm({
  onFormSubmit,
  tool,
}: EditToolFormProps) {
  const { mutate: updateTool, isPending: isUpdatingTool } = useUpdateTool();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EditToolFormValues>();

  useEffect(() => {
    if (tool) {
      reset({
        name: tool.name,
        description: tool.description,
        stockTotal: tool.stockTotal,
        imageUrl: tool.imageUrl,
      });
    }
  }, [tool, reset]);

  const newImageFile = watch("imageUrl");

  const onSubmit = async (data: EditToolFormValues) => {
    setIsUploadingImage(true);
    let finalImageUrl = tool.imageUrl;

    if (data.imageUrl instanceof FileList && data.imageUrl.length > 0) {
      toast.loading("Actualizando imagen...");
      const imageFile = data.imageUrl[0];
      const formData = new FormData();
      formData.append("image", imageFile);

      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Error al subir la nueva imagen.");
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.imageUrl;
        toast.dismiss();
      } catch (error) {
        console.error(error);
        toast.error("No se pudo actualizar la imagen.");
        setIsUploadingImage(false);
        return;
      }
    }
    setIsUploadingImage(false);

    updateTool(
      { _id: tool._id as string, ...data, imageUrl: finalImageUrl },
      {
        onSuccess: () => {
          toast.success("Herramienta actualizada con éxito.");
          onFormSubmit();
        },
        onError: (error) => {
          toast.error(`Error al actualizar: ${error.message}`);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          {...register("name", { required: "El nombre es obligatorio." })}
          disabled={isUpdatingTool || isUploadingImage}
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
          })}
          disabled={isUpdatingTool || isUploadingImage}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
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
          })}
          disabled={isUpdatingTool || isUploadingImage}
        />
        {errors.stockTotal && (
          <p className="text-sm text-destructive">
            {errors.stockTotal.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="editImageUrl">Imagen</Label>
        <Input
          id="editImageUrl"
          type="file"
          accept="image/*"
          {...register("imageUrl")}
          disabled={isUpdatingTool || isUploadingImage}
        />
        {errors.imageUrl && (
          <p className="text-sm text-destructive">
            {errors.imageUrl.message as string}
          </p>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        {newImageFile instanceof FileList && newImageFile.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img // <-- CAMBIO: Deshabilitar la regla en la línea de <img>
            src={URL.createObjectURL(newImageFile[0])}
            alt="Nueva imagen"
            className="max-h-32 rounded-md border object-contain"
          />
        ) : (
          tool.imageUrl && (
            <div className="relative max-h-32 h-32 w-32">
              <Image
                src={tool.imageUrl}
                alt="Imagen actual"
                fill
                className="rounded-md border object-contain"
                sizes="128px"
              />
            </div>
          )
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isUpdatingTool || isUploadingImage}>
          {isUpdatingTool || isUploadingImage
            ? "Actualizando..."
            : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}
