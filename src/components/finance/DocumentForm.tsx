
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

interface DocumentFormProps {
  onSuccess: () => void;
}

export function DocumentForm({ onSuccess }: DocumentFormProps) {
  // Create a simple form placeholder
  const form = useForm<any>({
    defaultValues: {
      date: new Date(),
    },
  });

  // Simple handler
  const onSubmit = async (data: any) => {
    console.log("Document form functionality has been removed");
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
