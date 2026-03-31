'use client'

import { MainCard } from "@/components/main-card";
import { ChartAreaInteractive } from "./components/area-chart";
import { SelectItems } from "@/components/select-items";
import { useEffect, useState } from "react";
import CardWithPieChart, { CardData } from "./components/card-with-pie-chart";
import { getTransactions } from "./lib/session";
import { chartConfig, months, years } from "@/lib/contans";
import { DashboardSkeleton } from "./components/dashboard-skeleton";

export default function Page() {
  const [month, setMonth] = useState<string>(new Date().toLocaleString("pt-BR", { month: "long" }));
  const [year, setYear] = useState<string>(new Date().getFullYear()?.toString());
  const [debouncedSearch, setDebouncedSearch] = useState<{ month: string, year: string }>({ month, year });
  const [balancePerBank, setBalancePerBank] = useState<CardData[]>([]);
  const [expensesPerCategory, setExpensesPerCategory] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dailyBalance, setDailyBalance] = useState<{ date: string, income: number, expenses: number }[]>([]);
  const [balance, setBalance] = useState<{ expenses: number, income: number, current: number }>({
    expenses: 0,
    income: 0,
    current: 0
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch({ month, year });
    }, 500);

    return () => clearTimeout(handler);
  }, [month, year]);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const res = await getTransactions(debouncedSearch);
        const banks = new Map<string, CardData>();
        const categories = new Map<string, CardData>();
        const transactions = new Map<string, { date: string, income: number, expenses: number }>();

        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() - 3)
        currentDate.setDate(1);

        for (let i = 0; i <= 31; i++) {
          if (currentDate.toLocaleString("pt-BR", { month: "long" }) != month) break;
          const formatDate = currentDate.toISOString().split('T')[0]
          transactions.set(formatDate, { date: formatDate, income: 0, expenses: 0 })
          currentDate.setDate(currentDate.getDate() + 1)
        }
  
        let income = 0;
        let expenses = 0;
        let current = 0;
  
        res.data.forEach(t => {
          const paymentDate = t.payment_date?.toString().split('T')[0]
          const currentTransaction = transactions.get(paymentDate)
          transactions.set(paymentDate, {
            date: paymentDate,
            income: (currentTransaction?.income || 0) + (t.type == 'income' ? t.value : 0),
            expenses: (currentTransaction?.expenses || 0) + (t.type == 'expenses' ? t.value : 0),
          })

          const currentBank = banks.get(t.bank_account.id)
          banks.set(t.bank_account.id, {
            name: t.bank_account.name,
            value: t.value + (currentBank?.value || 0),
            color: t.bank_account.icon_color,
            iconPath: t.bank_account.icon_path,
          })
  
          const currentCategory = categories.get(t.category.id)
          categories.set(t.category.id, {
            name: t.category.name,
            value: t.value + (currentCategory?.value || 0),
            color: t.category.icon_color
          })
  
          if (t.type == 'income') {
            income += t.value;
            current += t.value;
          } else if (t.type == 'expenses') {
            expenses += t.value;
            current -= t.value;
          }
        })
  
        setBalance({ expenses, income, current });
        setBalancePerBank(Array.from(banks.values()));
        setExpensesPerCategory(Array.from(categories.values()));
        setDailyBalance(Array.from(transactions.values())
          .sort((a, b) => Number(a.date.slice(-2)) - Number(b.date.slice(-2)))
        );
      } finally {
        setIsLoading(false);
      }
    }

    load()
  }, [debouncedSearch])

  return (
    <div className="min-h-screen flex px-4 flex-col gap-5">
      <div className="flex justify-end gap-3">
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
          defaultValue={new Date().getFullYear()?.toString()}
        />
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-3 grid-cols-1">
            <MainCard title="Receitas" value={balance.income} glowColor="#22c55e" textColor="text-green-500" icon={{ name: 'TrendingUp', color: "bg-green-500/20" }} />
            <MainCard title="Despesas" value={balance.expenses} glowColor="#fb2c36" textColor="text-red-500" icon={{ name: 'TrendingDown', color: "bg-red-500/20" }} />
            <MainCard title="Saldo Atual" value={balance.current} glowColor="#60a5fa" textColor="text-blue-400" icon={{ name: 'Wallet', color: "bg-blue-400/20" }} />
          </div>

          <div className="grid grid-cols-2 gap-3 text-green-500">
            <CardWithPieChart
              title="Saldo por conta"
              description="Saldo atual de cada conta"
              data={balancePerBank}
            />
            <CardWithPieChart
              title="Gastos por categoria"
              description="Porcentagem de gasto em cada categoria"
              data={expensesPerCategory}
            />
          </div>
        </>
      )}
          
      <ChartAreaInteractive config={chartConfig} data={dailyBalance} />
    </div>
  )
}