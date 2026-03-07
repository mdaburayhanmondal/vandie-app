import { model, models, Schema } from 'mongoose';

export interface IUser {
  _id?: string;
  clerkId: string;
  username?: string;
  name: string;
  email: string;
  role: 'vandy' | 'foodie' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['vandy', 'foodie', 'admin'],
      default: 'foodie',
    },
  },
  {
    timestamps: true,
  },
);

const User = models.User || model<IUser>('User', UserSchema);
export default User;
