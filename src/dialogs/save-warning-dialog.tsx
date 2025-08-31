'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';

interface SaveWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaveWarningDialog({
  open,
  onOpenChange,
}: SaveWarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="p-6 text-center">
          <p className="text-gray-800 mb-6">
            This order request is required for approval. Send M.D. to notify!
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onOpenChange(false)}
              className="bg-[#0077bb] text-white px-6 py-2 rounded hover:bg-[#005599]"
            >
              Yes
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              No
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
