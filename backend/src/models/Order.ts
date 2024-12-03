import mongoose, { Schema, Document } from 'mongoose';
import { DeliveryPartner } from './DeliveryPartner';

export interface Order extends Document {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  area: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: 'pending' | 'assigned' | 'picked' | 'delivered';
  scheduledFor: string; // HH:mm
  assignedTo?: DeliveryPartner['_id'];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    area: { type: String, required: true },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    status: { type: String, enum: ['pending', 'assigned', 'picked', 'delivered'], default: 'pending' },
    scheduledFor: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'DeliveryPartner' },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<Order>('Order', OrderSchema);
