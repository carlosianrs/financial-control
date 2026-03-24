import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { transactionsSchema, transactionsSchemaType } from "../../lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@/components/date-picker"
import { toast } from "sonner"
import { SelectItems } from "@/components/select-items"

type CreateTransactionProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function CreateTransaction({ open, setOpen }: CreateTransactionProps) {
  const [banks, setBanks] = useState<{ name: string, value: string }[] | null>(null);

  const { control, handleSubmit, reset } = useForm<transactionsSchemaType>({
    resolver: zodResolver(transactionsSchema),
    defaultValues: {
      type: 'expenses',
      value: 0,
      desc: '',
      status: '',
      bank: '',
      date: new Date(),
    }
  })

  async function onSubmit(data: transactionsSchemaType) {
    await new Promise((rs) => setTimeout(rs, 10000))
    toast.info('Sucesso', {description: 'coisa boa'})
  }

  useCallback(() => {
    if (open) {
      setBanks(null)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form id="form-transaction" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Criar transação</DialogTitle>
            <DialogDescription>
              Crie suas transações informando os dados essenciais.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <div className="flex flex-row gap-5">
              <Controller
                name="type"
                control={control}
                render={({ field, fieldState}) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Tipo</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="Selecione o tipo"
                      autoComplete="off"
                      {...field}
                    />
                    {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
                  </Field>
                )}
              />
              <Controller
                name="value"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Valor</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="Digite o valor"
                      autoComplete="off"
                      type="number"
                      {...field}
                    />
                  </Field>
                )}
              />
            </div>
            <Controller
              name="bank"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Banco</FieldLabel>
                  <SelectItems
                    items={banks || []}
                    onValueChange={field.onChange}
                    value={field.value}
                  />
                </Field>
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Status</FieldLabel>
                  <SelectItems
                    placeholder="Selecione o status"
                    items={[
                      { name: 'Pendente', value: 'pending' },
                      { name: 'Pago', value: 'paid' },
                      { name: 'Received', value: 'received' },
                    ]}
                    onValueChange={field.onChange}
                    value={field.value}
                  />
                </Field>
              )}
            />              
            <Controller
              name="date"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Data</FieldLabel>
                  <DatePicker
                    onChange={field.onChange}
                    value={field.value}
                    placeholder="Selecione a data da transação"
                  />
                </Field>
              )}
            />
            <Controller
              name="desc"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Descrição</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite a descrição"
                    autoComplete="off"
                    {...field}
                  />
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" form="form-transaction">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}