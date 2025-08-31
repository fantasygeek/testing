'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DrugRow {
  id: number;
  rxNumber: string;
  fillDate: string;
  drugName: string;
  quantity: string;
  units: string;
  strength: string;
}

interface ChooseDoctorPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  drugRows: DrugRow[];
  onDeleteDrug: (id: number) => void;
  onAddNewDrug: () => void;
  onUpdateDrug: (updatedRows: DrugRow[]) => void;
}

export function ChooseDoctorPopup({
  open,
  onOpenChange,
  drugRows,
  onDeleteDrug,
  onAddNewDrug,
  onUpdateDrug,
}: ChooseDoctorPopupProps) {
  const handleDrugChange = (
    id: number,
    field: keyof DrugRow,
    value: string
  ) => {
    const updatedRows = drugRows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    onUpdateDrug(updatedRows);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Doctor</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          {/* Patient Information */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <div className="mb-2">
                <label className="text-gray-600 text-sm">Patient Name</label>
                <input
                  type="text"
                  defaultValue=""
                  className="w-full bg-white border border-gray-300 rounded h-8 px-2"
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm">Patient Address</label>
                <input
                  type="text"
                  defaultValue="Address Location St. 123"
                  className="w-full bg-white border border-gray-300 rounded h-8 px-2"
                />
              </div>
            </div>
            <div>
              <div className="mb-2">
                <label className="text-gray-600 text-sm">Prescriber</label>
                <input
                  type="text"
                  defaultValue="Dr. Hows"
                  className="w-full bg-white border border-gray-300 rounded h-8 px-2"
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm">Date of Birth</label>
                <input
                  type="text"
                  defaultValue="December 24, 2025"
                  className="w-full bg-white border border-gray-300 rounded h-8 px-2"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-600 text-sm">Age</label>
              <input
                type="text"
                defaultValue=""
                className="w-full bg-white border border-gray-300 rounded h-8 px-2"
              />
            </div>
          </div>

          {/* Drug Information Table */}
          <div className="bg-gray-100 p-4 rounded">
            <div className="grid grid-cols-7 gap-2 mb-2 text-sm text-gray-600 font-medium">
              <div>RX #</div>
              <div>Fill Date</div>
              <div>Drug Name</div>
              <div>Quantity</div>
              <div>Units</div>
              <div>Strength</div>
              <div></div>
            </div>
            {drugRows.map((row) => (
              <div key={row.id} className="grid grid-cols-7 gap-2 mb-2">
                <input
                  type="text"
                  value={row.rxNumber}
                  onChange={(e) =>
                    handleDrugChange(row.id, 'rxNumber', e.target.value)
                  }
                  className="bg-white border border-gray-300 rounded h-8 px-2 text-sm"
                />
                <input
                  type="text"
                  value={row.fillDate}
                  onChange={(e) =>
                    handleDrugChange(row.id, 'fillDate', e.target.value)
                  }
                  className="bg-white border border-gray-300 rounded h-8 px-2 text-sm"
                />
                <input
                  type="text"
                  value={row.drugName}
                  onChange={(e) =>
                    handleDrugChange(row.id, 'drugName', e.target.value)
                  }
                  className="bg-white border border-gray-300 rounded h-8 px-2 text-sm"
                />
                <input
                  type="text"
                  value={row.quantity}
                  onChange={(e) =>
                    handleDrugChange(row.id, 'quantity', e.target.value)
                  }
                  className="bg-white border border-gray-300 rounded h-8 px-2 text-sm"
                />
                <input
                  type="text"
                  value={row.units}
                  onChange={(e) =>
                    handleDrugChange(row.id, 'units', e.target.value)
                  }
                  className="bg-white border border-gray-300 rounded h-8 px-2 text-sm"
                />
                <input
                  type="text"
                  value={row.strength}
                  onChange={(e) =>
                    handleDrugChange(row.id, 'strength', e.target.value)
                  }
                  className="bg-white border border-gray-300 rounded h-8 px-2 text-sm"
                />
                <button
                  onClick={() => onDeleteDrug(row.id)}
                  className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                >
                  delete
                </button>
              </div>
            ))}
            <div className="mt-4">
              <button
                onClick={onAddNewDrug}
                className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
              >
                + New Drug
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
