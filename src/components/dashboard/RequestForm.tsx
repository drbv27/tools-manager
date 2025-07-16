// src/components/dashboard/RequestForm.tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { useTools } from "@/hooks/useTools";
import { useCreateRequest } from "@/hooks/useRequests";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface RequestFormValues {
  tool: string;
  justification: string;
}

interface RequestFormProps {
  onFormSubmit: () => void;
}

export function RequestForm({ onFormSubmit }: RequestFormProps) {
  const { data: tools, isLoading: isLoadingTools } = useTools();
  const { mutate: createRequest, isPending: isCreatingRequest } =
    useCreateRequest();

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    reset, // Añadir reset
  } = useForm<RequestFormValues>();

  const onSubmit = (data: RequestFormValues) => {
    console.log("Datos enviados desde el formulario:", data);
    toast.promise(
      new Promise((resolve, reject) => {
        createRequest(data, {
          onSuccess: (res) => {
            reset();
            onFormSubmit();
            resolve(res);
          },
          onError: (error) => {
            reject(error);
          },
        });
      }),
      {
        loading: "Enviando solicitud...",
        success: "Solicitud enviada con éxito.",
        error: (err) => `Error: ${err.message}`,
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
      <div className="space-y-2">
        <Label htmlFor="tool">Herramienta</Label>
        <Controller
          name="tool"
          control={control}
          rules={{ required: "Debes seleccionar una herramienta." }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isLoadingTools || isCreatingRequest}
            >
              <SelectTrigger id="tool">
                <SelectValue placeholder="Selecciona una herramienta..." />
              </SelectTrigger>
              <SelectContent>
                {isLoadingTools ? (
                  <SelectItem value="loading" disabled>
                    Cargando...
                  </SelectItem>
                ) : (
                  tools?.map((tool) => (
                    <SelectItem
                      key={tool._id as string}
                      value={tool._id as string}
                    >
                      {tool.name} (Disponibles:{" "}
                      {tool.stockTotal - tool.stockOnLoan})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />
        {errors.tool && (
          <p className="text-sm text-destructive">{errors.tool.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="justification">Justificación</Label>
        <Textarea
          id="justification"
          placeholder="Ej: Necesito un monitor adicional para mejorar la productividad..."
          {...register("justification", {
            required: "La justificación es obligatoria.",
            minLength: { value: 10, message: "Mínimo 10 caracteres." },
          })}
          disabled={isCreatingRequest}
        />
        {errors.justification && (
          <p className="text-sm text-destructive">
            {errors.justification.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isCreatingRequest}>
          {isCreatingRequest ? "Enviando..." : "Enviar Solicitud"}
        </Button>
      </div>
    </form>
  );
}
