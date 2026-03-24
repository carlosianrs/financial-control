'use client'

import { Icon } from "@/components/icon";
import { SelectItems } from "@/components/select-items";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMoney } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { fetcher, ParamsRequest } from "@/http/api/session";
import useSWRInfinite from "swr/infinite";
import { getCategories, Payment } from "./lib/session"
import { LoadingCard } from "@/components/loading-card";

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  const [categorySelect, setCategorySelect] = useState<string>();
  const [month, setMonth] = useState<string>(new Date().toLocaleString("pt-BR", { month: "long" }));
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [categories, setCategories] = useState<{ value: string, name: string }[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>();

  const months = [
    { value: "janeiro", name: "Janeiro" },
    { value: "fevereiro", name: "Fevereiro" },
    { value: "março", name: "Março" },
    { value: "abril", name: "Abril" },
    { value: "maio", name: "Maio" },
    { value: "junho", name: "Junho" },
    { value: "julho", name: "Julho" },
    { value: "agosto", name: "Agosto" },
    { value: "setembro", name: "Setembro" },
    { value: "outubro", name: "Outubro" },
    { value: "novembro", name: "Novembro" },
    { value: "dezembro", name: "Dezembro" }
  ]

  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: 5 }, (_, index) => {
    const year = (currentYear - index).toString();
    return { value: year, name: year };
  });

  const getParams = useCallback((pgIndx: number, previousPageData?: any) => {
    const baseQuery = debouncedSearch?.trim();

    if (previousPageData?.nextCursor) {
      const { created_at, id } = previousPageData.nextCursor;
      return `/report/${baseQuery}&nextCreatedAt=${created_at}&nextId=${id}`;
    } else if (baseQuery) {
      return `/report${baseQuery}`;
    } else {
      const monthCurrent = new Date().toLocaleString("pt-BR", { month: "long" });
      const yearCurrent = new Date().getFullYear()?.toString();
      return `/report?month_year=${monthCurrent}/${yearCurrent}`;
    }
  }, [debouncedSearch])

  const { data: payments, isLoading, isValidating, size, setSize, mutate, error: errorPayments } = useSWRInfinite<ParamsRequest<Payment[]>>(getParams, fetcher, {
    revalidateOnFocus: true,
    parallel: true,
    onErrorRetry(err, key, config, revalidate, revalidateOpts) {
      if (err.status == 401) return;
    },
  })

  useEffect(() => {
    const handler = setTimeout(() => {
      const monthCurrent = month || new Date().toLocaleString("pt-BR", { month: "long" });
      const yearCurrent = year || new Date().getFullYear()?.toString()
      
      let search = `?month_year=${monthCurrent}/${yearCurrent}`;
      if (activeTab != "overview") search += `&type=${activeTab}`;

      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [month, year, activeTab]);

  useEffect(() => {
    const scrollArea = document?.querySelector('#scroll-area');
    const meta = payments?.at(-1)?.results;

    function handleScroll() {
      if (scrollArea && meta && !isValidating) {
        const { scrollTop, scrollHeight, clientHeight } = scrollArea;

        if (scrollTop + clientHeight >= scrollHeight - 10) {
          setSize(prev => prev + 1);
        }
      }
    }

    const intervalCheckScroll: NodeJS.Timeout = setInterval(() => {
      if (scrollArea && meta && !isValidating) {
        if (
          scrollArea?.clientHeight == scrollArea?.scrollHeight && !errorPayments
        ) {
          setSize(prev => prev + 1);
        } else {
          clearInterval(intervalCheckScroll);
        }
      }
    }, 500);

    scrollArea?.addEventListener('scroll', handleScroll);

    return () => {
      scrollArea?.removeEventListener('scroll', handleScroll);
      clearInterval(intervalCheckScroll);
    };
  }, [payments, setSize, errorPayments, isValidating]);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
          items={years}
          value={year}
          onValueChange={setYear}
          defaultValue={new Date().getFullYear().toString()}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList variant="line" className="w-full grid grid-cols-3">
          <TabsTrigger value="overview">Todas</TabsTrigger>
          <TabsTrigger value="income">Receitas</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className={`relative grid gap-2 ${(isLoading || (payments && payments[0].data?.length)) ? 'sm:grid-cols-2 lg:grid-cols-3' : ''} grid-cols-1`}>
        {isLoading ? <LoadingCard /> :
          (size >= 0 && !errorPayments) ? (
            payments?.length && payments[0] && payments[0]?.data?.length ?
              payments.map(({ data }, index ) => {
                if (data?.length) {
                  return data.map((payment, index) => (
                    <Card className="relative overflow-hidden w-full rounded-xl h-full bg-card shadow-lg shadow-muted-foreground/15"
                      onClick={() => {}}
                      key={`${payment.category.name}-${index}`}
                    >
                      <div
                        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 blur-3xl rounded-full"
                        style={{ background: payment.category.icon_color, opacity: 0.35 }}
                      />
    
                      <CardContent className="p-2 items-center justify-center">
                        <div className="flex items-center justify-start gap-3">
                          <div
                            className="flex shrink-0 items-center justify-center h-12 w-12 ml-3 rounded-xl transition-colors duration-300"
                            style={{ backgroundColor: `${payment.category.icon_color}33`, color: payment.category.icon_color }}
                          >
                            <Icon name={payment.category.icon_name as any} className="size-6" />
                          </div>
                          <div className="flex flex-col items-start min-w-0">
                            <p className="truncate">{payment.category.name}</p>
                            <div className="flex flex-row gap-2 items-center justify-center">
                              <span className="text-sm text-zinc-600 dark:text-zinc-400 break:words">Descrição: {payment.description}</span>
                            </div>
                            <div className="flex flex-row gap-2 items-center flex-wrap">
                              <span className="text-md font-semibold text-zinc-900 dark:text-zinc-100">
                                Valor:
                              </span>

                              <span className={`text-md font-bold ${payment.type == "income" ? "text-green-500" : "text-red-500"}`}>
                                {formatMoney(payment.value)}
                              </span>
                            </div>
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
              <p>{errorPayments?.data?.message || "Falha ao buscar transações"}</p>
            </div>
          )
        }
      </div>
    </div>
  )
}