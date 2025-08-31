'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search } from 'lucide-react';

interface PatientDetailsPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientDetailsPopup({
  open,
  onOpenChange,
}: PatientDetailsPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Patient"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded">
              <div className="text-sm">1</div>
              <div className="text-sm">Patient Name 1</div>
              <div className="text-sm">Male</div>
              <div className="text-sm">35</div>
            </div>
            <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded">
              <div className="text-sm">1</div>
              <div className="text-sm">Patient Name 1</div>
              <div className="text-sm">Male</div>
              <div className="text-sm">35</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
