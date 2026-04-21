import { model, models, Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  foodieId: string;
  vandyId: string;
  vandyName: string;
  items: {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  pickupDate: string;
  pickupTime: string;
  totalPrice: number;
  totalPrePay: number;
  grandTotal: number;
  dueAtPickup: number;
  status:
    | 'requested'
    | 'approved'
    | 'paid'
    | 'preparing'
    | 'ready'
    | 'completed'
    | 'rejected';
  paymentDetails?: {
    trxId?: string;
    method?: string;
    paidAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
  {
    foodieId: { type: String, required: true, index: true },
    vandyId: { type: String, required: true, index: true },
    vandyName: { type: String, required: true },
    items: [
      {
        itemId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    pickupDate: { type: String, required: true },
    pickupTime: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    totalPrePay: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    dueAtPickup: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        'requested',
        'approved',
        'paid',
        'preparing',
        'ready',
        'completed',
        'rejected',
      ],
      default: 'requested',
    },
    paymentDetails: {
      trxId: { type: String },
      method: { type: String },
      paidAt: { type: Date },
    },
    review: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, trim: true },
      createdAt: { type: Date },
    },
  },
  { timestamps: true },
);

const Order = models.Order || model<IOrder>('Order', OrderSchema);

export default Order;
