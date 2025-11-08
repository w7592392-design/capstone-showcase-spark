import { useState, useEffect } from 'react';
import { Credential } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, ExternalLink, Pencil, Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useVault } from '@/contexts/VaultContext';
import { toast } from 'sonner';
import { calculatePasswordStrength } from '@/lib/encryption';
import { checkPasswordBreach, PasswordSecurityStatus } from '@/lib/passwordSecurity';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CredentialCardProps {
  credential: Credential;
  onEdit: () => void;
}

export const CredentialCard = ({ credential, onEdit }: CredentialCardProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { deleteCredential } = useVault();
  const [breachStatus, setBreachStatus] = useState<PasswordSecurityStatus>({
    breachCount: null,
    isBreached: false,
    isChecking: true,
  });

  const strength = calculatePasswordStrength(credential.password);

  useEffect(() => {
    checkPasswordBreach(credential.password).then(setBreachStatus);
  }, [credential.password]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleDelete = () => {
    deleteCredential(credential.id);
    toast.success('Credential deleted');
  };

  return (
    <Card className="glass-panel hover:shadow-lg transition-all duration-200 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{credential.title}</CardTitle>
            <p className="text-sm text-muted-foreground truncate mt-1">{credential.username}</p>
          </div>
          <Badge variant="secondary" className="ml-2 capitalize">
            {credential.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Security Warnings */}
        {breachStatus.isBreached && (
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription>
              This password has been found in {breachStatus.breachCount?.toLocaleString()} data breaches. 
              Change it immediately!
            </AlertDescription>
          </Alert>
        )}

        {strength.score < 3 && !breachStatus.isBreached && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Password strength: <span className="font-semibold">{strength.label}</span>. 
              Consider using a stronger password.
            </AlertDescription>
          </Alert>
        )}

        {/* Password Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Strength: <span className="font-medium" style={{ color: `hsl(var(--${strength.color}))` }}>
                {strength.label}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0 px-3 py-2 bg-muted rounded-md font-mono text-sm truncate">
            {showPassword ? credential.password : '••••••••'}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(credential.password, 'Password')}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* URL Section */}
        {credential.url && (
          <div className="flex items-center gap-2 text-sm">
            <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <a
              href={credential.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate"
            >
              {credential.url}
            </a>
          </div>
        )}

        {/* Notes */}
        {credential.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">{credential.notes}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
            <Pencil className="w-3 h-3 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Trash2 className="w-3 h-3 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Credential?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{credential.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
