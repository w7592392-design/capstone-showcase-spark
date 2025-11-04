import CryptoJS from 'crypto-js';

// Generate a cryptographic salt
const generateSalt = (): string => {
  return CryptoJS.lib.WordArray.random(128/8).toString();
};

// Derive a key from password using PBKDF2 with 100,000 iterations
const deriveKey = (password: string, salt: string): string => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256/32,
    iterations: 100000,
    hasher: CryptoJS.algo.SHA512
  }).toString();
};

export const encryptData = (data: string, masterPassword: string): string => {
  const salt = generateSalt();
  const key = deriveKey(masterPassword, salt);
  const encrypted = CryptoJS.AES.encrypt(data, key).toString();
  // Prepend salt to encrypted data
  return salt + ':' + encrypted;
};

export const decryptData = (encryptedData: string, masterPassword: string): string => {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    const [salt, encrypted] = parts;
    const key = deriveKey(masterPassword, salt);
    const bytes = CryptoJS.AES.decrypt(encrypted, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      throw new Error('Decryption failed');
    }
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed. Invalid master password.');
  }
};

export const hashPassword = (password: string): string => {
  const salt = CryptoJS.lib.WordArray.random(128/8).toString();
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256/32,
    iterations: 100000,
    hasher: CryptoJS.algo.SHA512
  }).toString() + ':' + salt;
};

export const verifyPassword = (password: string, hash: string): boolean => {
  try {
    const parts = hash.split(':');
    if (parts.length !== 2) return false;
    const [storedHash, salt] = parts;
    const testHash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 100000,
      hasher: CryptoJS.algo.SHA512
    }).toString();
    return storedHash === testHash;
  } catch {
    return false;
  }
};

export const generatePassword = (length: number = 16, options: {
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
} = {}): string => {
  const {
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true,
  } = options;

  let charset = '';
  if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) charset += '0123456789';
  if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }

  return password;
};

export const calculatePasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-destructive' };
  if (score <= 4) return { score: 2, label: 'Fair', color: 'bg-warning' };
  if (score <= 5) return { score: 3, label: 'Good', color: 'bg-primary' };
  return { score: 4, label: 'Strong', color: 'bg-success' };
};
