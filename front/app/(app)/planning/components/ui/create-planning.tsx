import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Planning } from "../../lib/types"
import { ParamsRequest } from "@/http/api/session"
import { SWRInfiniteKeyedMutator } from "swr/infinite"
import { zodResolver } from "@hookform/resolvers/zod"
import { planningsSchema, planningsSchemaType } from "../../lib/schemas"
import { createPlanning, getCategories, updatePlanning } from "../../lib/session"
import { toast } from "sonner"
import { CreatePlanningSkeleton } from "./create-planning-skeleton"
import { SelectItems } from "@/components/select-items"
import { Loader2 } from "lucide-react"
import { months, years } from "@/lib/contants"

type CreatePlanningProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  currentPlanning: Planning | null;
  setCurrentPlanning: Dispatch<SetStateAction<Planning | null>>;
  mutate: SWRInfiniteKeyedMutator<ParamsRequest<Planning[]>[]>;
}

const defaultValuesForm = {
  category: '',
  desc: '',
  value: 0,
  month: new Date().toLocaleString("pt-BR", { month: "long" }),
  year: new Date().getFullYear().toString(),
}

export function CreatePlanning({ currentPlanning, setCurrentPlanning, open, setOpen, mutate }: CreatePlanningProps) {
  const [categories, setCategories] = useState<{ name: string, value: string }[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const form = useForm<planningsSchemaType>({
    resolver: zodResolver(planningsSchema),
    defaultValues: defaultValuesForm
  })

  async function onSubmit(data: planningsSchemaType) {
    try {
      setIsProcessing(true);
      const model = {
        category_id: data.category,
        description: data.desc,
        value: data.value,
        month: data.month,
        year: data.year,
      }

      let result;

      if (currentPlanning) {
        result = await updatePlanning(currentPlanning.id, model);
      } else {
        result = await createPlanning(model);
      }

      if (result.success === false) {
        toast.info('Falha', { description: result.message })
        setIsProcessing(false);
        return;
      }

      mutate();
      toast.info('Sucesso', { description: 'Planejamento adicionada com sucesso' })
      resetForm(false);
    } catch(err) {
      toast.info('Falha', { description: 'Não foi possível concluir planejamento' })
    } finally {
      setIsProcessing(false);
    }
  }

  useEffect(() => {
    if (!open) return;

    async function load() {
      try {
        setIsLoading(true)
        const resCategories = await getCategories();

        if (resCategories?.data) {
          setCategories(resCategories.data.map(c => (
            { name: c.name, value: c.id }
          )));
        }
      } finally {
        setIsLoading(false)
      }
    }
  
    load();
  }, [open])

  useEffect(() => {
    if (currentPlanning) {
      form.setValue('category', currentPlanning.category.id)
      form.setValue('desc', currentPlanning.description)
      form.setValue('value', currentPlanning.value)
      form.setValue('month', currentPlanning.month)
      form.setValue('year', currentPlanning.year)
    } else {
      form.reset(defaultValuesForm)
    }
  }, [currentPlanning])
  
  function resetForm(isOpen: boolean) {
    if (!isOpen) {
      setTimeout(() => {
        form.reset(defaultValuesForm);
        setCategories(null);
        setCurrentPlanning(null);
      }, 200)
    }

    setOpen(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      resetForm(isOpen);
    }}>
      <form id="form-planning" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo planejamento</DialogTitle>
            <DialogDescription>Informe os dados do seu planejamento</DialogDescription>
          </DialogHeader>
          {isLoading ? <CreatePlanningSkeleton /> : (
            <>
              <FieldGroup className="gap-3">
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-2">
                      <FieldLabel>Categoria</FieldLabel>
                      <SelectItems
                        placeholder="Selecione a categoria"
                        items={categories || []}
                        onValueChange={field.onChange}
                        value={field.value}
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
                <Controller
                  name="desc"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-2">
                      <FieldLabel>Descrição</FieldLabel>
                      <Input
                        aria-invalid={fieldState.invalid}
                        placeholder="Ex.: Contas de casa"
                        autoComplete="off"
                        {...field}
                        required
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
                <Controller
                  name="value"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-2">
                      <FieldLabel>Valor</FieldLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-yellow-500">
                          R$
                        </span>

                        <Input
                          aria-invalid={fieldState.invalid}
                          placeholder="0,00"
                          autoComplete="off"
                          type="number"
                          className="pl-10"
                          required
                          {...field}
                        />
                      </div>
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
                <div className="flex flex-row gap-5">
                  <Controller
                    name="month"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="gap-2">
                        <FieldLabel>Mês</FieldLabel>
                        <SelectItems
                          placeholder="Selecione o mês"
                          items={months || []}
                          onValueChange={field.onChange}
                          value={field.value}
                        />
                        <FieldError>{fieldState.error?.message}</FieldError>
                      </Field>
                    )}
                  />
                  <Controller
                    name="year"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="gap-2">
                        <FieldLabel>Ano</FieldLabel>
                        <SelectItems
                          placeholder="Selecione o ano"
                          items={years() || []}
                          onValueChange={field.onChange}
                          value={field.value}
                        />
                        <FieldError>{fieldState.error?.message}</FieldError>
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
              <DialogFooter>
                <Button type="submit" form="form-planning" disabled={isProcessing} className="w-full text-white bg-linear-to-r from-blue-950 to-blue-600">
                  {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />} Salvar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </form>
    </Dialog>
  )
}