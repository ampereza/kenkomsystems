
export type TreatmentFormValues = {
  treatmentDate: string;
  cylinderNumber: string;
  clientId: string;
  waterAddedLiters: number;
  kegsAdded: number;
  kegsRemaining: number;
  chemicalStrength: number;
  chemicalUsed: string;
  facingPoles: number | null;
  telecomPoles: number | null;
  distributionPoles: number | null;
  highVoltagePoles: number | null;
  notes: string;
  sortedStockId: string;
  quantity: number | null;
  isClientOwnedPoles: boolean;
};

export interface TreatmentLogFormProps {
  onSubmitSuccess: () => void;
  onCancel: () => void;
}
