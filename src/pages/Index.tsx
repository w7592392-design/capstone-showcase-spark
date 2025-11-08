import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Auth } from './Auth';
import { LoginScreen } from '@/components/Auth/LoginScreen';
import { VaultDashboard } from '@/components/Vault/VaultDashboard';
import { VaultProvider, useVault } from '@/contexts/VaultContext';
import type { User } from '@supabase/supabase-js';

const VaultApp = () => {
  const { isLocked, unlock } = useVault();
  const [user, setUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsChecking(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (isLocked) {
    return <LoginScreen onUnlock={unlock} />;
  }

  return <VaultDashboard />;
};

const Index = () => {
  return (
    <VaultProvider>
      <VaultApp />
    </VaultProvider>
  );
};

export default Index;
