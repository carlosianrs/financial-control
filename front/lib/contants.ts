import { ChartConfig } from "@/components/ui/chart";

export const statusList = [
  { name: 'Pendente', value: 'pending' },
  { name: 'Pago', value: 'paid' },
  { name: 'Recebido', value: 'received' },
]

export const months = [
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

export const years = () => {
  const currentYear = new Date().getFullYear();
  
  return Array.from({ length: 5 }, (_, index) => {
    const year = currentYear - index;
    return {
      value: String(year),
      name: String(year),
    };
  });
}

export const chartAreaConfig = {
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

export const chartBarConfig = {
  expenses: {
    label: "Despesas",
    color: "#fb2c36",
  },
  goal: {
    label: "Meta",
    color: "#60A5FA",
  },
} satisfies ChartConfig;