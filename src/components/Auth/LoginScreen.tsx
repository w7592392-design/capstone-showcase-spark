import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { verifyPassword } from '@/lib/encryption';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface LoginScreenProps {
  onUnlock: (password: string) => void;
}

export const LoginScreen = ({ onUnlock }: LoginScreenProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [masterPasswordHash, setMasterPasswordHash] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('master_password_hash, email')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setMasterPasswordHash(profile.master_password_hash);
          setUserEmail(profile.email);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (masterPasswordHash && verifyPassword(password, masterPasswordHash)) {
        toast.success('Vault unlocked!');
        onUnlock(password);
      } else {
        toast.error('Incorrect master password');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md glass-panel animate-fade-in">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full vault-gradient flex items-center justify-center mb-2">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Unlock Your Vault</CardTitle>
          <CardDescription>
            {userEmail && <span className="block mb-1">Signed in as: {userEmail}</span>}
            Enter your master password to decrypt your vault
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Master Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Enter your master password"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Unlocking...' : 'Unlock Vault'}
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={async () => {
                await supabase.auth.signOut();
                toast.success('Signed out successfully');
              }}
            >
              Sign Out
            </Button>
          </form>

          <div className="mt-6 p-3 bg-accent/10 border border-accent/20 rounded-lg">
            <p className="text-xs text-center text-muted-foreground">
              🔒 Your vault will auto-lock after 5 minutes of inactivity
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
