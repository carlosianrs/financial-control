'use client'

import { useCallback, useEffect, useState } from "react"
import { Planning } from "./lib/types";
import useSWRInfinite from "swr/infinite";
import { fetcher, ParamsRequest } from "@/http/api/session";
import { SelectItems } from "@/components/select-items";
import { months, years } from "@/lib/contants";
import { Button } from "@/components/ui/button";
import { LoadingCard } from "@/components/loading-card";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/icon";
import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/lib/utils";
import { CreatePlanning } from "./components/ui/create-planning";
import { MainCard } from "@/components/main-card";

export default function Page() {
  const [month, setMonth] = useState<string>(new Date().toLocaleString("pt-BR", { month: 'long' }));
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>();
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [currentPlannig, setCurrentPlannig] = useState<Planning | null>(null);
  const [balancePlanning, setBalancePlanning] = useState<{ income: number, expenses: number, current: number } | null>(null);

  const getParams = useCallback((pgIndx: number, previoudPageData: any) => {
    const baseQuery = debouncedSearch?.trim();

    if (previoudPageData?.nextCursor) {
      const { date, id } = previoudPageData.nextCursor;
      return `/planning${baseQuery}&nextDate=${date}&nextId=${id}`;
    } else if (baseQuery) {
      return `/planning${baseQuery}`;
    } else {
      const monthCurrent = new Date().toLocaleString("pt-BR", { month: "long" });
      const yearCurrent = new Date().getFullYear()?.toString();
      return `/planning?month=${monthCurrent}&year=${yearCurrent}`;
    }
  }, [debouncedSearch])

  const { data: plannings, isLoading, isValidating, size, setSize, mutate, error: errorPlannings } = useSWRInfinite<ParamsRequest<Planning[]>>(getParams, fetcher, {
    revalidateOnFocus: true,
    onErrorRetry(err, key, config, revalidate, revalidateOpts) {
      if (err.status == 401) return;
    },
  })

  useEffect(() => {
    if (!plannings?.length) return;

    let income = 0;
    let expenses = 0;
    let current = 0;

    plannings[0]?.data?.forEach((planning) => {
      if (planning.category.name == "Renda") {
        income += planning.value;
        current += planning.value;
      } else {
        expenses += planning.value;
        current -= planning.value;
      }
    })

    setBalancePlanning({ income, expenses, current })
  }, [plannings])

  useEffect(() => {
    const handler = setTimeout(() => {
      const monthCurrent = month || new Date().toLocaleString("pt-BR", { month: "long" });
      const yearCurrent = year || new Date().getFullYear().toString();

      setDebouncedSearch(`?month=${monthCurrent}&year=${yearCurrent}`);
    }, 500)

    return () => clearTimeout(handler);
  }, [month, year])

  useEffect(() => {
    function handleScroll() {
      const meta = plannings?.at(-1)?.nextCursor;
      if (!meta || isValidating) return;

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        setSize(prev => prev + 1);
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [plannings, isValidating, setSize]);

  return (
    <div className="min-h-screen flex px-4 flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
          Adicionar planejamento
        </Button>
      </div>
      
      <div className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-3 grid-cols-1">
        <MainCard
          title="Receitas Prevista"
          value={balancePlanning?.income || 0}
          glowColor="#22c55e"
          textColor="text-green-500"
          icon={{ name: 'TrendingUp', color: "bg-green-500/20" }}
        />

        <MainCard
          title="Despesas Prevista"
          value={balancePlanning?.expenses || 0}
          glowColor="#fb2c36"
          textColor="text-red-500"
          icon={{ name: 'TrendingDown', color: "bg-red-500/20" }}
        />

        <MainCard
          title="Saldo Previsto"
          value={balancePlanning?.current || 0}
          glowColor="#60a5fa"
          textColor="text-blue-400"
          icon={{ name: 'Wallet', color: "bg-blue-400/20" }}
        />
      </div>

      <Separator />

      <CreatePlanning
        currentPlanning={currentPlannig}
        setCurrentPlanning={setCurrentPlannig}
        open={createOpen}
        setOpen={setCreateOpen}
        mutate={mutate}
      />
      
      <div className={`relative grid gap-3 ${(isLoading || (plannings && plannings[0].data?.length)) ? 'sm:grid-cols-2 lg:grid-cols-3' : ''} grid-cols-1`}>
        {isLoading ? <LoadingCard /> : 
          (size >= 0 && !errorPlannings) ? (
            plannings?.length && plannings[0] && plannings[0]?.data?.length ?
              plannings.map(({ data }, index) => {
                if (data?.length) {
                  return data.map((planning, index) => (
                    <Card
                      className="relative w-full h-full overflow-hidden roudend-xl bg-card hover:opacity-90 transition shadow-md shadow-blue-900/50"
                      onClick={() => {
                        setCurrentPlannig(planning);
                        setCreateOpen(true);
                      }}
                      key={`${planning.category.name}-${index}`}
                    >
                      <div
                        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl"
                        style={{ background: planning.category.icon_color, opacity: 0.5 }}
                      />

                      <CardContent className="p-4 py-2 flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                          <div
                            className="flex shrink-0 items-center justify-center h-12 w-12 rounded-xl"
                            style={{ backgroundColor: `${planning.category.icon_color}33`, color: planning.category.icon_color }}
                          >
                            <Icon name={planning.category.icon_name as any} className="size-6" />
                          </div>

                          <div className="flex flex-col leading-tight">
                            <p className="font-bold text-lg truncate">{planning.category.name}</p>
                            <span className="text-sm wrap-break-word">{planning.description || 'Sem descrição'}</span>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-end gap-4 flex-wrap">
                          <div className="flex items-center gap-1 text-sm">
                            <span>Valor:</span>
                            <span className="font-bold text-yellow-500">
                              {formatMoney(planning.value)}
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
                <p>{"Nenhuma transação encontrada"}</p>
              </div>
            )
          ) : (
            <div className="text-sm text-zinc-400 text-center">
              <p>{errorPlannings?.data?.message || "Falha ao buscar planejamentos"}</p>
            </div>
          )
        }
      </div>
    </div>
  )
}