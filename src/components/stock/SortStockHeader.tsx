
import React from "react";

interface SortStockHeaderProps {
  title?: string;
  description?: string;
}

export const SortStockHeader = ({ 
  title = "Sort Stock", 
  description = "Sort and categorize received poles"
}: SortStockHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-muted-foreground">
        {description}
      </p>
    </div>
  );
};
