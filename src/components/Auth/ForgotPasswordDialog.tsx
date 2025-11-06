import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { clearVaultData } from '@/lib/storage';
import { toast } from 'sonner';

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
}

export const ForgotPasswordDialog = ({ open, onOpenChange, onReset }: ForgotPasswordDialogProps) => {
  const [confirmText, setConfirmText] = useState('');

  const handleReset = () => {
    if (confirmText.toLowerCase() === 'reset') {
      clearVaultData();
      toast.success('Vault has been reset successfully');
      onReset();
      onOpenChange(false);
    } else {
      toast.error('Please type "reset" to confirm');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Forgot Master Password?
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-2">
            <p>
              Unfortunately, your master password cannot be recovered because all your data is encrypted locally.
            </p>
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Warning:</strong> Resetting your vault will permanently delete all stored credentials. This action cannot be undone.
              </AlertDescription>
            </Alert>
            <p className="text-sm">
              If you're sure you want to reset your vault and start fresh, type <strong>reset</strong> below to confirm.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type 'reset' to confirm"
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleReset}
            disabled={confirmText.toLowerCase() !== 'reset'}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Reset Vault
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
