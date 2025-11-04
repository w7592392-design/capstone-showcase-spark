import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Plus, Search, LogOut, Download, Upload, Key, Settings } from 'lucide-react';
import { useVault } from '@/contexts/VaultContext';
import { CredentialList } from './CredentialList';
import { AddCredentialDialog } from './AddCredentialDialog';
import { PasswordGeneratorDialog } from './PasswordGeneratorDialog';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { CategoryFilter } from './CategoryFilter';
import { toast } from 'sonner';
import { exportVaultData, importVaultData } from '@/lib/storage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const VaultDashboard = () => {
  const { lock, credentials, searchQuery, setSearchQuery, categoryFilter } = useVault();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showGeneratorDialog, setShowGeneratorDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleExport = () => {
    const data = exportVaultData();
    if (!data) {
      toast.error('No data to export');
      return;
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `secure-vault-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Vault exported successfully');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          importVaultData(data);
          toast.success('Vault imported successfully. Please refresh the page.');
        } catch (error) {
          toast.error('Failed to import vault data');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const filteredCredentials = credentials.filter((cred) => {
    const matchesSearch = cred.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cred.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cred.url?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || cred.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg vault-gradient flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Secure Vault</h1>
                <p className="text-sm text-muted-foreground">
                  {credentials.length} credential{credentials.length !== 1 ? 's' : ''} stored
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowChangePasswordDialog(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleImport}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowLogoutDialog(true)}>
                <LogOut className="w-4 h-4 mr-2" />
                Lock
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search credentials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowGeneratorDialog(true)} variant="outline">
                <Key className="w-4 h-4 mr-2" />
                Generator
              </Button>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Credential
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <CategoryFilter />

          {/* Credentials List */}
          <CredentialList credentials={filteredCredentials} />
        </div>
      </main>

      {/* Dialogs */}
      <AddCredentialDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      <PasswordGeneratorDialog open={showGeneratorDialog} onOpenChange={setShowGeneratorDialog} />
      <ChangePasswordDialog open={showChangePasswordDialog} onOpenChange={setShowChangePasswordDialog} />
      
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Lock Vault?</AlertDialogTitle>
            <AlertDialogDescription>
              Your vault will be locked and you'll need to enter your master password to access it again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={lock}>Lock Vault</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
