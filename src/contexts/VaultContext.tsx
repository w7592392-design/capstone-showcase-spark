import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Credential } from '@/lib/storage';
import {
  saveEncryptedData,
  getEncryptedData,
  updateLastActivity,
  getLastActivity,
  saveMasterPasswordHash,
} from '@/lib/storage';
import { encryptData, decryptData, hashPassword, verifyPassword } from '@/lib/encryption';

interface VaultContextType {
  isLocked: boolean;
  credentials: Credential[];
  masterPassword: string;
  unlock: (password: string) => void;
  lock: () => void;
  addCredential: (credential: Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCredential: (id: string, credential: Partial<Credential>) => void;
  deleteCredential: (id: string) => void;
  changeMasterPassword: (currentPassword: string, newPassword: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

const AUTO_LOCK_TIME = 5 * 60 * 1000; // 5 minutes

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [masterPassword, setMasterPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const saveCredentials = useCallback((creds: Credential[], password: string) => {
    const jsonData = JSON.stringify(creds);
    const encrypted = encryptData(jsonData, password);
    saveEncryptedData(encrypted);
  }, []);

  const loadCredentials = useCallback((password: string) => {
    const encrypted = getEncryptedData();
    if (!encrypted) {
      setCredentials([]);
      return;
    }
    
    try {
      const decrypted = decryptData(encrypted, password);
      const parsed = JSON.parse(decrypted);
      setCredentials(parsed);
    } catch (error) {
      console.error('Failed to decrypt credentials');
      setCredentials([]);
    }
  }, []);

  const unlock = useCallback((password: string) => {
    setMasterPassword(password);
    setIsLocked(false);
    loadCredentials(password);
    updateLastActivity();
  }, [loadCredentials]);

  const lock = useCallback(() => {
    setIsLocked(true);
    setMasterPassword('');
    setCredentials([]);
    setSearchQuery('');
    setCategoryFilter('all');
  }, []);

  const addCredential = useCallback((credential: Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCredential: Credential = {
      ...credential,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updated = [...credentials, newCredential];
    setCredentials(updated);
    saveCredentials(updated, masterPassword);
    updateLastActivity();
  }, [credentials, masterPassword, saveCredentials]);

  const updateCredential = useCallback((id: string, updates: Partial<Credential>) => {
    const updated = credentials.map(cred =>
      cred.id === id
        ? { ...cred, ...updates, updatedAt: new Date().toISOString() }
        : cred
    );
    setCredentials(updated);
    saveCredentials(updated, masterPassword);
    updateLastActivity();
  }, [credentials, masterPassword, saveCredentials]);

  const deleteCredential = useCallback((id: string) => {
    const updated = credentials.filter(cred => cred.id !== id);
    setCredentials(updated);
    saveCredentials(updated, masterPassword);
    updateLastActivity();
  }, [credentials, masterPassword, saveCredentials]);

  const changeMasterPassword = useCallback((currentPassword: string, newPassword: string) => {
    // Verify current password matches
    if (currentPassword !== masterPassword) {
      throw new Error('Current password is incorrect');
    }

    // Re-encrypt all credentials with new password
    saveCredentials(credentials, newPassword);
    
    // Update master password hash
    const newHash = hashPassword(newPassword);
    saveMasterPasswordHash(newHash);
    
    // Update state
    setMasterPassword(newPassword);
    updateLastActivity();
  }, [credentials, masterPassword, saveCredentials]);

  // Auto-lock functionality
  useEffect(() => {
    if (isLocked) return;

    const checkActivity = setInterval(() => {
      const now = Date.now();
      const lastActivity = getLastActivity();
      
      if (now - lastActivity > AUTO_LOCK_TIME) {
        lock();
      }
    }, 10000); // Check every 10 seconds

    const handleActivity = () => {
      if (!isLocked) {
        updateLastActivity();
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      clearInterval(checkActivity);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [isLocked, lock]);

  return (
    <VaultContext.Provider
      value={{
        isLocked,
        credentials,
        masterPassword,
        unlock,
        lock,
        addCredential,
        updateCredential,
        deleteCredential,
        changeMasterPassword,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};
