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
import { transactionsSchema, transactionsSchemaType } from "../../lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@/components/date-picker"
import { toast } from "sonner"
import { SelectItems } from "@/components/select-items"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, TrendingDown, TrendingUp } from "lucide-react"
import { createTransaction, getBanksAccount, getCategories, Transaction, updateTransaction } from "../../lib/session"
import { statusList } from "@/lib/contants"
import { CreateTransactionSkeleton } from "./create-transaction-skeleton"
import { SWRInfiniteKeyedMutator } from "swr/infinite"
import { ParamsRequest } from "@/http/api/session"
import { StatusTransaction } from "../../lib/types"

type CreateTransactionProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  currentTransaction: Transaction | null;
  setCurrentTransaction: Dispatch<SetStateAction<Transaction | null>>;
  mutate: SWRInfiniteKeyedMutator<ParamsRequest<Transaction[]>[]>;
}

const defaultValuesForm = {
  type: 'expenses',
  value: 0,
  desc: '',
  status: '',
  bank: '',
  category: '',
  date: new Date(),
}

export function CreateTransaction({ currentTransaction, setCurrentTransaction, open, setOpen, mutate }: CreateTransactionProps) {
  const [banksAccount, setBanksAccount] = useState<{ name: string, value: string }[] | null>(null);
  const [categories, setCategories] = useState<{ name: string, value: string }[] | null>(null);
  const [status, setStatus] = useState<{ name: string, value: string }[] | null>(null);
  const [type, setType] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const form = useForm<transactionsSchemaType>({
    resolver: zodResolver(transactionsSchema),
    defaultValues: defaultValuesForm
  })

  async function onSubmit(data: transactionsSchemaType) {
    try {
      setIsProcessing(true);
      const model = {
        type: type || data.type,
        value: data.value,
        description: data.desc,
        status: data.status,
        category_id: data.category,
        bank_account_id: data.bank,
        payment_date: data.date.toISOString(),
      }

      let result;

      if (currentTransaction) {
        result = await updateTransaction(currentTransaction.id, model);
      } else {
        result = await createTransaction(model);
      }

      if (result.success === false) {
        toast.info('Falha', { description: result.message })
        setIsProcessing(false);
        return;
      }

      mutate();
      toast.info('Sucesso', { description: 'Transação adicionada com sucesso' })
      resetForm(false);
    } catch(err) {
      toast.info('Falha', { description: 'Não foi possível concluir transação' })
    } finally {
      setIsProcessing(false);
    }
  }

  useEffect(() => {
    if (!open) return;

    async function load() {
      try {
        setIsLoading(true)
        const [resCategories, resBankAccounts] = await Promise.all([
          getCategories(),
          getBanksAccount()
        ])

        if (resCategories?.data) {
          setCategories(resCategories.data.map(c => (
            { name: c.name, value: c.id }
          )));
        }
    
        if (resBankAccounts?.data) {
          setBanksAccount(resBankAccounts.data.map(b => (
            { name: b.name, value: b.id }
          )));
        }
      } finally {
        setIsLoading(false)
      }
    }
  
    load();
  }, [open])

  useEffect(() => {
    if (currentTransaction) {
      form.setValue('bank', currentTransaction.bank_account.id)
      form.setValue('category', currentTransaction.category.id)
      form.setValue('date', new Date(currentTransaction.payment_date))
      form.setValue('desc', currentTransaction.description)
      form.setValue('status', currentTransaction.status)
      form.setValue('type', currentTransaction.type)
      form.setValue('value', currentTransaction.value)
    } else {
      form.reset(defaultValuesForm)
    }
    setType(currentTransaction?.type || 'expenses')
  }, [currentTransaction])

  useEffect(() => {
    const categoriesFilter = categories?.filter(c => type === 'income' ? c.name != 'Renda' : c.name == 'Renda')
    setCategories(categoriesFilter || null);

    const statusFilter = statusList.filter(s => s.value !== (type === 'income' ? StatusTransaction.paid : StatusTransaction.received))
    setStatus(statusFilter);
  }, [type])

  useEffect(() => {
    const currentStatus = form.getValues('status')
    const currentCategory = form.getValues('category')
    if (!status?.some(s => s.value === currentStatus)) form.setValue('status', '')
    if (!categories?.some(c => c.value === currentCategory)) form.setValue('category', '')
  }, [categories, status, form])

  function resetForm(isOpen: boolean) {
    if (!isOpen) {
      setTimeout(() => {
        form.reset(defaultValuesForm);
        setBanksAccount(null);
        setCategories(null);
        setType('expenses');
        setCurrentTransaction(null);
      }, 200)
    }

    setOpen(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      resetForm(isOpen);
    }}>
      <form id="form-transaction" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova transação</DialogTitle>
            <DialogDescription>Informe os dados da sua transação</DialogDescription>
          </DialogHeader>
          {isLoading ? <CreateTransactionSkeleton /> : (
            <>
              <FieldGroup className="gap-3">
                <Tabs value={type} onValueChange={setType} className="w-full">
                  <TabsList variant="line" className="grid grid-cols-2">
                    <TabsTrigger value="income" className="data-[state=active]:after:bg-green-500"><TrendingUp className="text-green-500" /> Receitas</TabsTrigger>
                    <TabsTrigger value="expenses" className="data-[state=active]:after:bg-red-500"><TrendingDown className="text-red-500" /> Despesas</TabsTrigger>
                  </TabsList>
                </Tabs>
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
                        placeholder="Ex.: Conta de energia"
                        autoComplete="off"
                        {...field}
                        required
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
                <div className="flex flex-row gap-5">
                  <Controller
                    name="value"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="gap-2">
                        <FieldLabel>Valor</FieldLabel>
                        <div className="relative">
                          <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold ${type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
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
                  <Controller
                    name="date"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="gap-2">
                        <FieldLabel>Data</FieldLabel>
                        <DatePicker
                          onChange={field.onChange}
                          value={field.value}
                          placeholder="Selecione a data da transação"
                        />
                        <FieldError>{fieldState.error?.message}</FieldError>
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  name="bank"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-2">
                      <FieldLabel>Banco</FieldLabel>
                      <SelectItems
                        items={banksAccount || []}
                        placeholder="Selecione o banco"
                        onValueChange={field.onChange}
                        value={field.value}
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-2">
                      <FieldLabel>Status</FieldLabel>
                      <SelectItems
                        placeholder="Selecione o status"
                        items={status || []}
                        onValueChange={field.onChange}
                        value={field.value}
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
              </FieldGroup>
              <DialogFooter>
                <Button type="submit" form="form-transaction" disabled={isProcessing} className="w-full text-white bg-linear-to-r from-blue-950 to-blue-600">
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