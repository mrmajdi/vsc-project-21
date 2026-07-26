import bcrypt from 'bcryptjs';

/**
 * Hash a plain text password using bcrypt.
 * @param plainPassword - The plain text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(plainPassword, saltRounds);
}

/**
 * Compare a plain text password with a hashed password.
 * @param plainPassword - The plain text password to compare.
 * @param hashedPassword - The hashed password stored in the database.
 * @returns A promise that resolves to true if the passwords match, otherwise false.
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}