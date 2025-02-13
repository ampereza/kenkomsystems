
import { BarChart3, Package } from "lucide-react";
import { StockMetricCard } from "./StockMetricCard";

export function StockCategories() {
  // Example data - in a real app, this would come from an API
  const categories = [
    {
      title: "Unsorted Stock",
      value: "1,234",
      change: { value: 12, type: "increase" as const },
    },
    {
      title: "Sorted Stock",
      value: "5,678",
      change: { value: 8, type: "increase" as const },
    },
    {
      title: "Rejects",
      value: "123",
      change: { value: 3, type: "decrease" as const },
    },
    {
      title: "Client Treatment",
      value: "456",
      change: { value: 5, type: "increase" as const },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <StockMetricCard
          key={category.title}
          title={category.title}
          value={category.value}
          change={category.change}
        />
      ))}
    </div>
  );
}
