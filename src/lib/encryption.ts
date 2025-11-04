import CryptoJS from 'crypto-js';

export const encryptData = (data: string, masterPassword: string): string => {
  return CryptoJS.AES.encrypt(data, masterPassword).toString();
};

export const decryptData = (encryptedData: string, masterPassword: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, masterPassword);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error('Decryption failed. Invalid master password.');
  }
};

export const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
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
