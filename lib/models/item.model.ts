import { model, models, Schema } from 'mongoose';

export interface IItem {
  _id?: string;
  ownerId: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  isAvailable: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema(
  {
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['Snacks', 'Meals', 'Drinks', 'Desserts', 'Others'],
      default: 'Others',
    },
    description: {
      type: String,
      maxLength: 150,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

const Item = models.Item || model<IItem>('Item', ItemSchema);

export default Item;
