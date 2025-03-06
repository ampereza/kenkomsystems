
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UnsortedStock, FormData, CATEGORIES, SIZES } from "./types";

interface SortStockFormFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  unsortedStocks: UnsortedStock[];
  getLengthUnit: (category: string) => "ft" | "m";
}

export const SortStockFormFields = ({ 
  formData, 
  setFormData, 
  unsortedStocks,
  getLengthUnit
}: SortStockFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Unsorted Stock*</label>
        <Select
          value={formData.unsorted_stock_id}
          onValueChange={(value) =>
            setFormData({ ...formData, unsorted_stock_id: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select unsorted stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {unsortedStocks.map((stock) => (
                <SelectItem key={stock.id} value={stock.id}>
                  {stock.quantity} poles from{" "}
                  {stock.suppliers?.name || "Unknown"} (
                  {new Date(stock.received_date).toLocaleDateString()})
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category*</label>
        <Select
          value={formData.category}
          onValueChange={(value: any) =>
            setFormData({
              ...formData,
              category: value,
              length_unit: getLengthUnit(value),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Size*</label>
        <Select
          value={formData.size || ""}
          onValueChange={(value: any) =>
            setFormData({ ...formData, size: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {SIZES.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="length">
          Length* ({formData.length_unit})
        </label>
        <Input
          id="length"
          type="number"
          step="0.01"
          required
          value={formData.length_value}
          onChange={(e) =>
            setFormData({ ...formData, length_value: e.target.value })
          }
        />
      </div>

      {formData.category !== "fencing" && (
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="diameter">
            Diameter (mm)*
          </label>
          <Input
            id="diameter"
            type="number"
            required
            min="150"
            max="240"
            value={formData.diameter_mm}
            onChange={(e) =>
              setFormData({ ...formData, diameter_mm: e.target.value })
            }
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="quantity">
          Quantity*
        </label>
        <Input
          id="quantity"
          type="number"
          required
          min="1"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="notes">
          Notes
        </label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
    </>
  );
};
