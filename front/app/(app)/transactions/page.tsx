'use client'

import { Icon } from "@/components/icon";
import { SelectItems } from "@/components/select-items";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMoney } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { fetcher, ParamsRequest } from "@/http/api/session";
import useSWRInfinite from "swr/infinite";
import { getCategories, Transaction } from "./lib/session"
import { LoadingCard } from "@/components/loading-card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CreateTransaction } from "./components/ui/create-transaction";
import { months, years } from "@/lib/contants";

export enum StatusColor {
  pending = 'text-yellow-400',
  paid = 'text-red-400',
  received = 'text-green-400',
}

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  const [categorySelect, setCategorySelect] = useState<string>();
  const [month, setMonth] = useState<string>(new Date().toLocaleString("pt-BR", { month: "long" }));
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [categories, setCategories] = useState<{ value: string, name: string }[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>();
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);

  const getParams = useCallback((pgIndx: number, previousPageData?: any) => {
    const baseQuery = debouncedSearch?.trim();

    if (previousPageData?.nextCursor) {
      const { date, id } = previousPageData.nextCursor;
      return `/transaction${baseQuery}&nextDate=${date}&nextId=${id}`;
    } else if (baseQuery) {
      return `/transaction${baseQuery}`;
    } else {
      const monthCurrent = new Date().toLocaleString("pt-BR", { month: "long" });
      const yearCurrent = new Date().getFullYear()?.toString();
      return `/transaction?month=${monthCurrent}&year=${yearCurrent}`;
    }
  }, [debouncedSearch])

  const { data: transactions, isLoading, isValidating, size, setSize, mutate, error: errorTransactions } = useSWRInfinite<ParamsRequest<Transaction[]>>(getParams, fetcher, {
    revalidateOnFocus: true,
    onErrorRetry(err, key, config, revalidate, revalidateOpts) {
      if (err.status == 401) return;
    },
  })

  useEffect(() => {
    const handler = setTimeout(() => {
      const monthCurrent = month || new Date().toLocaleString("pt-BR", { month: "long" });
      const yearCurrent = year || new Date().getFullYear()?.toString()
      
      let search = `?month=${monthCurrent}&year=${yearCurrent}`;
      if (activeTab != "overview") search += `&type=${activeTab}`;
      if (categorySelect) search += `&category_id=${categorySelect}`

      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [month, year, categorySelect, activeTab]);

  useEffect(() => {
    function handleScroll() {
      const meta = transactions?.at(-1)?.nextCursor;
      if (!meta || isValidating) return;

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        setSize(prev => prev + 1);
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [transactions, isValidating, setSize]);

  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.data?.length) {
          const categoriesFormatted = res.data.map((c) => ({ name: c.name, value: c.id }))
          setCategories(categoriesFormatted)
        }
      });
  }, [])

  return (
    <div className="min-h-screen flex px-4 flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <SelectItems
          placeholder="Selecione a categoria"
          label="Categorias"
          items={categories}
          value={categorySelect}
          onValueChange={setCategorySelect}
        />

        <SelectItems
          placeholder="Selecione o mês"
          label="Meses"
          items={months}
          value={month}
          onValueChange={setMonth}
          defaultValue={new Date().toLocaleString("pt-BR", { month: "long" })}
        />

        <SelectItems
          placeholder="Selecione o ano"
          label="Anos"
          items={years()}
          value={year}
          onValueChange={setYear}
          defaultValue={new Date().getFullYear().toString()}
        />
        
        <Button onClick={() => setCreateOpen(true)}>
          Adicionar transação
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList variant="line" className="w-full grid grid-cols-3">
          <TabsTrigger value="overview">Todas</TabsTrigger>
          <TabsTrigger value="income">Receitas</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
        </TabsList>
      </Tabs>

      <CreateTransaction
        currentTransaction={currentTransaction}
        setCurrentTransaction={setCurrentTransaction}
        open={createOpen}
        setOpen={setCreateOpen}
        mutate={mutate}
      />

      <div className={`relative grid gap-3 grid-cols-2 ${(isLoading || (transactions && transactions[0].data?.length)) ? 'lg:grid-cols-3' : ''}`}>
        {isLoading ? <LoadingCard /> :
          (size >= 0 && !errorTransactions) ? (
            transactions?.length && transactions[0] && transactions[0]?.data?.length ?
              transactions.map(({ data }, index ) => {
                if (data?.length) {
                  return data.map((transaction, index) => (
                    <Card
                      className="relative w-full h-full overflow-hidden rounded-xl bg-card hover:opacity-90 transition shadow-md shadow-zinc-300 dark:shadow-blue-900/50"
                      onClick={() => {
                        setCurrentTransaction(transaction);
                        setCreateOpen(true);
                      }}
                      key={`${transaction.category.name}-${index}`}
                    >
                      <div
                        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl"
                        style={{ background: transaction.category.icon_color, opacity: 0.5 }}
                      />

                      <CardContent className="p-3 flex flex-col gap-2 sm:gap-4">
                        <div className="flex items-start gap-2">
                          <div
                            className="flex shrink-0 items-center justify-center h-9 w-9 sm:h-12 sm:w-12 rounded-xl"
                            style={{ backgroundColor: `${transaction.category.icon_color}33`, color: transaction.category.icon_color }}
                          >
                            <Icon name={transaction.category.icon_name as any} className="size-4 sm:size-6" />
                          </div>

                          <div className="flex flex-col leading-tight min-w-0">
                            <p className="font-bold text-sm sm:text-lg truncate">{transaction.category.name}</p>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {transaction.description || 'Sem descrição...'}
                            </span>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                          <div className="flex items-center gap-1 text-xs sm:text-sm">
                            <span>Data:</span>
                            <span className="font-bold">{new Date(transaction.payment_date).toLocaleDateString()}</span>
                          </div>

                          <div className="flex items-center gap-1 text-xs sm:text-sm">
                            <span>Valor:</span>
                            <span className={`font-bold ${StatusColor[transaction.status]}`}>
                              {formatMoney(transaction.value)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
              })
            : (
              <div className="text-sm text-zinc-400 text-center">
                <p>{"Nenhuma transação encontrado"}</p>
              </div>
            )
          ) : (
            <div className="text-sm text-zinc-400 text-center">
              <p>{errorTransactions?.data?.message || "Falha ao buscar transações"}</p>
            </div>
          )
        }
      </div>
    </div>
  )
}