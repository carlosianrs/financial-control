'use client'

import { MainCard } from "@/components/main-card";
import { ChartAreaInteractive } from "./components/area-chart";
import { SelectItems } from "@/components/select-items";
import { useEffect, useState } from "react";
import CardWithPieChart, { CardData } from "./components/card-with-pie-chart";
import { getTransactions } from "./lib/session";
import { chartAreaConfig, chartBarConfig, months, years } from "@/lib/contants";
import { DashboardSkeleton } from "./components/dashboard-skeleton";
import { StatusTransaction, TypeTransaction } from "../transactions/lib/types";
import { ChartBarMultiple } from "./components/bar-chart-multiple";
import { getCategories } from "../transactions/lib/session";

export default function Page() {
  const [month, setMonth] = useState<string>(new Date().toLocaleString("pt-BR", { month: "long" }));
  const [year, setYear] = useState<string>(new Date().getFullYear()?.toString());
  const [debouncedSearch, setDebouncedSearch] = useState<{ month: string, year: string }>({ month, year });
  const [balancePerBank, setBalancePerBank] = useState<CardData[]>([]);
  const [expensesPerCategory, setExpensesPerCategory] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dailyBalance, setDailyBalance] = useState<{ date: string, income: number, expenses: number }[]>([]);
  const [expensesPlanning, setExpensesPlanning] = useState<{ category: string, expenses: number, goal: number }[]>([]);
  const [balance, setBalance] = useState<{ expenses: number, income: number, current: number }>({
    expenses: 0, income: 0, current: 0
  });
  const [balancePending, setBalancePending] = useState<{ expenses: number, income: number, current: number }>({
    expenses: 0, income: 0, current: 0
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
        const resCategories = await getCategories();

        const banks = new Map<string, CardData>();
        const categories = new Map<string, CardData>();
        const transactions = new Map<string, { date: string, income: number, expenses: number }>();
        const planning = new Map<string, { category: string, expenses: number, goal: number }>();

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

        let incomePending = 0;
        let expensesPending = 0;
        let balPending = 0;
  
        res.data.forEach(transaction => {
          const paymentDate = transaction.payment_date?.toString().split('T')[0]
          
          const isIncome = transaction.type === TypeTransaction.income;
          const isPending = transaction.status === StatusTransaction.pending;
          const value = isIncome ? transaction.value : -transaction.value;
          
          const currentTransaction = transactions.get(paymentDate)
          transactions.set(paymentDate, {
            date: paymentDate,
            income: (currentTransaction?.income || 0) + (isIncome && !isPending ? transaction.value : 0),
            expenses: (currentTransaction?.expenses || 0) + (!isIncome && !isPending ? transaction.value : 0),
          })

          const currentBank = banks.get(transaction.bank_account.id)
          banks.set(transaction.bank_account.id, {
            name: transaction.bank_account.name,
            value: (currentBank?.value || 0) + value,
            color: transaction.bank_account.icon_color,
            iconPath: transaction.bank_account.icon_path,
          })
  
          if (!isIncome) {
            const currentCategory = categories.get(transaction.category.id)
            categories.set(transaction.category.id, {
              name: transaction.category.name,
              value: transaction.value + (currentCategory?.value || 0),
              color: transaction.category.icon_color
            })
          }

          if (isPending) {
            balPending += value;
            if (isIncome) incomePending += transaction.value;
            else expensesPending += transaction.value;
            
          } else {
            current += value;
            if (isIncome) income += transaction.value;
            else expenses += transaction.value;
          }
        })

        resCategories.data.forEach((category) => {
          const currentCategory = categories.get(category.id)

          if (!currentCategory) {
            categories.set(category.id, {
              name: category.name,
              value: 0,
              color: category.icon_color
            })
          }

          planning.set(category.id, {
            category: category.name,
            expenses: currentCategory?.value || 0,
            goal: 0,
          })
        })
  
        setBalance({ expenses, income, current });
        setBalancePending({ expenses: expensesPending, income: incomePending, current: balPending });
        setBalancePerBank(Array.from(banks.values()));
        setExpensesPerCategory(Array.from(categories.values()));
        setExpensesPlanning(Array.from(planning.values()));
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
            <MainCard
              title="Receitas"
              value={balance.income}
              valuePending={balancePending.income}
              glowColor="#22c55e"
              textColor="text-green-500"
              icon={{ name: 'TrendingUp', color: "bg-green-500/20" }}
            />

            <MainCard
              title="Despesas"
              value={balance.expenses}
              valuePending={balancePending.expenses}
              glowColor="#fb2c36"
              textColor="text-red-500"
              icon={{ name: 'TrendingDown', color: "bg-red-500/20" }}
            />

            <MainCard
              title="Saldo Atual"
              value={balance.current}
              valuePending={balancePending.current}
              glowColor="#60a5fa"
              textColor="text-blue-400"
              icon={{ name: 'Wallet', color: "bg-blue-400/20" }}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 text-green-500">
            <CardWithPieChart
              title="Saldo por conta"
              description="Saldo atual de cada conta"
              data={balancePerBank}
            />
          </div>

          <ChartAreaInteractive config={chartAreaConfig} data={dailyBalance} />

          <div className="grid grid-cols-2 gap-3 text-green-500">
            <CardWithPieChart
              title="Gastos por categoria"
              description="Porcentagem de gasto em cada categoria"
              data={expensesPerCategory}
            />
            <CardWithPieChart
              title="Receitas x Despesas"
              description="Comparativo de receitas e gastos"
              data={[
                { name: 'Receitas', value: balance.income, color: '#22c55e' },
                { name: 'Despesas', value: balance.expenses, color: '#fb2c36' }
              ]}
            />
          </div>

          <ChartBarMultiple config={chartBarConfig} data={expensesPlanning} />
        </>
      )}
    </div>
  )
}