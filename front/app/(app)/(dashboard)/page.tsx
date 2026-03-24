'use client'

import { MainCard } from "@/components/main-card";
import { ChartAreaInteractive } from "./components/AreaChart";
import { ChartConfig } from "@/components/ui/chart";
import { SelectItems } from "@/components/select-items";
import { useCallback, useEffect, useState } from "react";
import CardWithPieChart from "./components/CardWithPieChart";
import { fetcher, ParamsRequest } from "@/http/api/session";
import useSWRInfinite from "swr/infinite";
import { Payment } from "./lib/session";

export default function Page() {
  const [month, setMonth] = useState<string | undefined>();
  const [year, setYear] = useState<string | undefined>();
  const [debouncedSearch, setDebouncedSearch] = useState<{ month?: string, year?: string }>({
    month: undefined,
    year: undefined,
  });

  const months = [
    { value: "01", name: "Janeiro" },
    { value: "02", name: "Fevereiro" },
    { value: "03", name: "Março" },
    { value: "04", name: "Abril" },
    { value: "05", name: "Maio" },
    { value: "06", name: "Junho" },
    { value: "07", name: "Julho" },
    { value: "08", name: "Agosto" },
    { value: "09", name: "Setembro" },
    { value: "10", name: "Outubro" },
    { value: "11", name: "Novembro" },
    { value: "12", name: "Dezembro" }
  ]

  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: 5 }, (_, index) => {
    const year = currentYear - index;
    return {
      value: String(year),
      name: String(year),
    };
  });

  const getParams = useCallback((pgIndx: number, prevPgIndx?: any) => {
    const find = debouncedSearch.month?.trim();

    if (find && find?.length > 0 && find?.length < 255) {
      return `/payment`;
    } else {
      return `/payment`;
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
      setDebouncedSearch({ month, year });
    }, 500);

    return () => clearTimeout(handler);
  }, [month, year]);

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

  const dataBalance = [
    { name: "Nubank", value: 1600, color: "#60A5FA" },
    { name: "Inter", value: 200, color: "#34D399" },
    { name: "Dinheiro", value: 200, color: "#A78BFA" },
  ]

  const dataPayments = [
    { name: "Alimentação", value: 1600, color: "#60A5FA" },
    { name: "Casa", value: 200, color: "#34D399" },
    { name: "Igreja", value: 200, color: "#A78BFA" },
    { name: "Investimento", value: 0, color: "#818CF8" },
    { name: "Transporte", value: 200, color: "#34D399" },
    { name: "Imprevisto", value: 200, color: "#A78BFA" },
    { name: "Presente", value: 0, color: "#818CF8" },
  ]

  const chartData = [
    { date: "2024-06-01", income: 7000, expenses: 0 },
    { date: "2024-06-02", income: 0, expenses: 0 },
    { date: "2024-06-03", income: 0, expenses: 160 },
    { date: "2024-06-04", income: 0, expenses: 0 },
    { date: "2024-06-05", income: 0, expenses: 0 },
    { date: "2024-06-06", income: 0, expenses: 250 },
    { date: "2024-06-07", income: 0, expenses: 0 },
    { date: "2024-06-08", income: 0, expenses: 0 },
    { date: "2024-06-09", income: 200, expenses: 0 },
    { date: "2024-06-10", income: 0, expenses: 0 },
    { date: "2024-06-11", income: 0, expenses: 0 },
    { date: "2024-06-12", income: 0, expenses: 0 },
    { date: "2024-06-13", income: 0, expenses: 0 },
    { date: "2024-06-14", income: 0, expenses: 0 },
    { date: "2024-06-15", income: 0, expenses: 0 },
    { date: "2024-06-16", income: 0, expenses: 0 },
    { date: "2024-06-17", income: 0, expenses: 0 },
    { date: "2024-06-18", income: 0, expenses: 0 },
    { date: "2024-06-19", income: 0, expenses: 755 },
    { date: "2024-06-20", income: 0, expenses: 500 },
    { date: "2024-06-21", income: 0, expenses: 57 },
    { date: "2024-06-22", income: 0, expenses: 98 },
    { date: "2024-06-23", income: 0, expenses: 0 },
    { date: "2024-06-24", income: 0, expenses: 0 },
    { date: "2024-06-25", income: 0, expenses: 0 },
    { date: "2024-06-26", income: 0, expenses: 0 },
    { date: "2024-06-27", income: 0, expenses: 55 },
    { date: "2024-06-28", income: 0, expenses: 0 },
    { date: "2024-06-29", income: 0, expenses: 0 },
    { date: "2024-06-30", income: 0, expenses: 23 },
  ]

  const chartConfig = {
    balance: {
      label: "Saldo",
      color: "#60A5FA",
    },
    income: {
      label: "Receita",
      color: "#34D399",
    },
    expenses: {
      label: "Despesa",
      color: "#FB2C36"
    }
  } satisfies ChartConfig;

  return (
    <div className="min-h-screen flex px-4 flex-col gap-5">
      <div className="flex justify-end gap-3">
        <SelectItems
          placeholder="Selecione o mês"
          label="Meses"
          items={months}
          value={month}
          onValueChange={setMonth}
        />

        <SelectItems
          placeholder="Selecione o ano"
          label="Anos"
          items={years}
          value={year}
          onValueChange={setYear}
        />
      </div>

      <div className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-3 grid-cols-1">
        <MainCard title="Receitas" value={10000} glowColor="#22c55e" textColor="text-green-500" icon={{ name: 'TrendingUp', color: "bg-green-500/20" }} />
        <MainCard title="Despesas" value={8000} glowColor="#fb2c36" textColor="text-red-500" icon={{ name: 'TrendingDown', color: "bg-red-500/20" }} />
        <MainCard title="Saldo Atual" value={2000} glowColor="#60a5fa" textColor="text-blue-400" icon={{ name: 'Wallet', color: "bg-blue-400/20" }} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-green-500">
        <CardWithPieChart
          title="Saldo por conta"
          description="Saldo atual de cada conta"
          data={dataBalance}
        />
        <CardWithPieChart
          title="Gastos por categoria"
          description="Porcentagem de gasto em cada categoria"
          data={dataPayments}
        />
      </div>
      
      <ChartAreaInteractive config={chartConfig} data={chartData} />
    </div>
  )
}