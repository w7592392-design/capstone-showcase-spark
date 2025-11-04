import { useState } from 'react';
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
import { toast } from 'sonner';
import { Key } from 'lucide-react';
import { generatePassword } from '@/lib/encryption';

interface AddCredentialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddCredentialDialog = ({ open, onOpenChange }: AddCredentialDialogProps) => {
  const { addCredential } = useVault();
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    category: 'social',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.username || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    addCredential(formData);
    toast.success('Credential added successfully');
    onOpenChange(false);
    setFormData({
      title: '',
      username: '',
      password: '',
      url: '',
      category: 'social',
      notes: '',
    });
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
          <DialogTitle>Add New Credential</DialogTitle>
          <DialogDescription>
            Store your login credentials securely
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Facebook, Gmail"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
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
            <Label htmlFor="username">Username / Email *</Label>
            <Input
              id="username"
              placeholder="username or email"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="flex gap-2">
              <Input
                id="password"
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
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
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
            <Button type="submit">Add Credential</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
