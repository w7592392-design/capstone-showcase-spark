export interface Credential {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  category: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'secure_vault_data';
const MASTER_PASSWORD_HASH_KEY = 'secure_vault_master';
const LAST_ACTIVITY_KEY = 'secure_vault_last_activity';

export const saveMasterPasswordHash = (hash: string): void => {
  localStorage.setItem(MASTER_PASSWORD_HASH_KEY, hash);
};

export const getMasterPasswordHash = (): string | null => {
  return localStorage.getItem(MASTER_PASSWORD_HASH_KEY);
};

export const saveEncryptedData = (encryptedData: string): void => {
  localStorage.setItem(STORAGE_KEY, encryptedData);
};

export const getEncryptedData = (): string | null => {
  return localStorage.getItem(STORAGE_KEY);
};

export const updateLastActivity = (): void => {
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
};

export const getLastActivity = (): number => {
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
  return lastActivity ? parseInt(lastActivity) : Date.now();
};

export const clearVaultData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(MASTER_PASSWORD_HASH_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
};

export const exportVaultData = (): string | null => {
  return localStorage.getItem(STORAGE_KEY);
};

export const importVaultData = (data: string): void => {
  localStorage.setItem(STORAGE_KEY, data);
};
