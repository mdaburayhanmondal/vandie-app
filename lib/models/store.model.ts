import { model, models, Schema } from 'mongoose';

export interface IStore {
  _id?: string;
  ownerId: string;
  storeName: string;
  bio: string;
  location: string;
  coverImage?: string;
  applicationStatus: 'pending' | 'approved' | 'rejected';
  isLive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const StoreSchema = new Schema(
  {
    ownerId: {
      type: String,
      required: true,
      ref: 'User',
    },
    storeName: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    applicationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isLive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Store = models.Store || model<IStore>('Store', StoreSchema);
export default Store;
