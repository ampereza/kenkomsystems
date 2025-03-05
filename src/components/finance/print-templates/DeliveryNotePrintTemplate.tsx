
import { SignatureBlock, formatDate } from "./BasePrintTemplate";

interface DeliveryNote {
  note_number: string;
  date: string;
  client_name: string;
  batch_number?: string;
  vehicle_number?: string;
  transporter?: string;
  loaded_by?: string;
  received_by?: string;
  total_quantity: number;
  notes?: string;
}

interface DeliveryNotePrintTemplateProps {
  document: DeliveryNote;
}

export function DeliveryNotePrintTemplate({ document }: DeliveryNotePrintTemplateProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold uppercase">Delivery Note</h2>
      </div>
      
      <div className="flex justify-between">
        <div>
          <p><strong>Note #:</strong> {document.note_number}</p>
          <p><strong>Date:</strong> {formatDate(document.date)}</p>
          <p><strong>Client:</strong> {document.client_name}</p>
        </div>
        <div>
          {document.batch_number && (
            <p><strong>Batch #:</strong> {document.batch_number}</p>
          )}
          {document.vehicle_number && (
            <p><strong>Vehicle #:</strong> {document.vehicle_number}</p>
          )}
          {document.transporter && (
            <p><strong>Transporter:</strong> {document.transporter}</p>
          )}
        </div>
      </div>
      
      <div className="border-t border-b py-4">
        <h3 className="text-lg font-semibold mb-2">Items</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Description</th>
              <th className="text-right py-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">Poles</td>
              <td className="text-right py-2">{document.total_quantity}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between pt-6">
        <SignatureBlock label="Loaded By" name={document.loaded_by} />
        <SignatureBlock label="Received By" name={document.received_by} />
      </div>
      
      {document.notes && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Notes</h3>
          <p className="text-gray-700">{document.notes}</p>
        </div>
      )}
    </div>
  );
}
