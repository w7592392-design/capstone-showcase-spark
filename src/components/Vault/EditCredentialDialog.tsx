import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVault } from '@/contexts/VaultContext';
import { Credential } from '@/lib/storage';
import { toast } from 'sonner';
import { Key } from 'lucide-react';
import { generatePassword } from '@/lib/encryption';

interface EditCredentialDialogProps {
  credential: Credential;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditCredentialDialog = ({ credential, open, onOpenChange }: EditCredentialDialogProps) => {
  const { updateCredential } = useVault();
  const [formData, setFormData] = useState({
    title: credential.title,
    username: credential.username,
    password: credential.password,
    url: credential.url || '',
    category: credential.category,
    notes: credential.notes || '',
  });

  useEffect(() => {
    setFormData({
      title: credential.title,
      username: credential.username,
      password: credential.password,
      url: credential.url || '',
      category: credential.category,
      notes: credential.notes || '',
    });
  }, [credential]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.username || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateCredential(credential.id, formData);
    toast.success('Credential updated successfully');
    onOpenChange(false);
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(16);
    setFormData({ ...formData, password: newPassword });
    toast.success('Password generated');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Credential</DialogTitle>
          <DialogDescription>
            Update your credential information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              placeholder="e.g., Facebook, Gmail"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-username">Username / Email *</Label>
            <Input
              id="edit-username"
              placeholder="username or email"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-password">Password *</Label>
            <div className="flex gap-2">
              <Input
                id="edit-password"
                type="text"
                placeholder="Enter or generate password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <Button type="button" variant="outline" onClick={handleGeneratePassword}>
                <Key className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-url">Website URL</Label>
            <Input
              id="edit-url"
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              placeholder="Additional information..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
