import { model, Schema } from 'mongoose'

interface IUser {
  email: string
  passwordHash: string
  passwordSalt: string
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  passwordSalt: { type: String, required: true },
})

export const User = model<IUser>('User', userSchema)
