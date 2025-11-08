import CryptoJS from 'crypto-js';

export interface PasswordSecurityStatus {
  breachCount: number | null;
  isBreached: boolean;
  isChecking: boolean;
  error?: string;
}

/**
 * Check if a password has been breached using the Have I Been Pwned API
 * Uses k-anonymity to protect the password - only sends first 5 chars of SHA-1 hash
 */
export async function checkPasswordBreach(password: string): Promise<PasswordSecurityStatus> {
  try {
    // Hash the password with SHA-1
    const hash = CryptoJS.SHA1(password).toString().toUpperCase();
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    // Query the HIBP API with the hash prefix
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    
    if (!response.ok) {
      throw new Error('Failed to check password breach');
    }

    const text = await response.text();
    const hashes = text.split('\n');
    
    // Check if our hash suffix appears in the results
    for (const line of hashes) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix === suffix) {
        return {
          breachCount: parseInt(count, 10),
          isBreached: true,
          isChecking: false,
        };
      }
    }

    return {
      breachCount: 0,
      isBreached: false,
      isChecking: false,
    };
  } catch (error) {
    return {
      breachCount: null,
      isBreached: false,
      isChecking: false,
      error: 'Failed to check password breach',
    };
  }
}
