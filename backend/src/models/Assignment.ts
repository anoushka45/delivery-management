import mongoose, { Schema, Document } from 'mongoose';

export interface Assignment extends Document {
  orderId: string;
  partnerId: string;
  timestamp: Date;
  status: 'success' | 'failed';
  reason?: string;
}

const AssignmentSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    partnerId: { type: Schema.Types.ObjectId, ref: 'DeliveryPartner', required: false },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['success', 'failed'], required: true },
    reason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<Assignment>('Assignment', AssignmentSchema);
