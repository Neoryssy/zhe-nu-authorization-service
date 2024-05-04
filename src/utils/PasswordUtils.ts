import { randomBytes, scrypt, timingSafeEqual } from 'crypto';

export class PasswordUtils {
  static KEY_LENGTH = 64;

  static generateSalt(length: number) {
    return randomBytes(length).toString('hex');
  }

  /**
   * Has a password or a secret with a password hashing algorithm (scrypt)
   * @param {string} password
   * @returns {string} hash
   */
  static generateHash(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      scrypt(password, salt, this.KEY_LENGTH, (err, derivedKey) => {
        if (err) reject(err);

        resolve(derivedKey.toString('hex'));
      });
    });
  }

  /**
   * Compare a plain text password with a salt+hash password
   * @param {string} password The plain text password
   * @param {string} hash The hash to check
   * @param {string} salt The salt
   * @returns {Promise<boolean>}
   */
  static comparePassword(
    password: string,
    hash: string,
    salt: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const hashKeyBuff = Buffer.from(hash, 'hex');

      scrypt(password, salt, this.KEY_LENGTH, (err, derivedKey) => {
        if (err) reject(err);

        resolve(timingSafeEqual(hashKeyBuff, derivedKey));
      });
    });
  }
}
