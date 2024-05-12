import { model, Schema, Types } from 'mongoose';

interface ISession {
  userId: Types.ObjectId;
  refreshToken: string;
  userAgent: string;
  fingerprint: string;
  ip: string;
  expiresIn: number;
  createdAt: Date;
}

const sessionSchema = new Schema<ISession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true },
  userAgent: { type: String, required: true },
  fingerprint: { type: String, required: true },
  ip: { type: String, required: true },
  expiresIn: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Session = model<ISession>('Session', sessionSchema);
