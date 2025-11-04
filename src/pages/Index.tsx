import { useEffect, useState } from 'react';
import { getMasterPasswordHash } from '@/lib/storage';
import { SetupMaster } from '@/components/Auth/SetupMaster';
import { LoginScreen } from '@/components/Auth/LoginScreen';
import { VaultDashboard } from '@/components/Vault/VaultDashboard';
import { VaultProvider, useVault } from '@/contexts/VaultContext';

const VaultApp = () => {
  const { isLocked, unlock } = useVault();
  const [hasSetup, setHasSetup] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const hash = getMasterPasswordHash();
    setHasSetup(!!hash);
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!hasSetup) {
    return <SetupMaster onComplete={() => setHasSetup(true)} />;
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
