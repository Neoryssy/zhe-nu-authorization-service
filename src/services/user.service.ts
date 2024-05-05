import { User } from '../models/User.model';
import { PasswordUtils } from '../utils/PasswordUtils';

export class UserService {
  static async login(email: string, password: string) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return null;
      }

      const isPasswordValid = await PasswordUtils.comparePassword(
        password,
        user.passwordHash,
        user.passwordSalt
      );

      if (!isPasswordValid) {
        return null;
      }

      return user;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  static async register(email: string, password: string) {
    try {
      const SALT_LENGTH = Number(process.env.SALT_LENGTH);

      const passwordSalt = PasswordUtils.generateSalt(SALT_LENGTH);
      const passwordHash = await PasswordUtils.generateHash(
        password,
        passwordSalt
      );

      const user = new User({
        email,
        passwordHash,
        passwordSalt,
      });

      await user.save();

      return user;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  static async userExists(email: string) {
    const user = await User.findOne({ email });
    return !!user;
  }
}
