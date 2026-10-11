import mongoose, { Schema, Document } from 'mongoose';

export interface IBloodRequest extends Document {
  patientName: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  units: number;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  pinCode: string;
  urgency: 'normal' | 'urgent' | 'critical';
  contactPerson: string;
  contactPhone: string;
  status: 'pending' | 'in_progress' | 'fulfilled' | 'cancelled';
  notes?: string;
  requiredDate: string;
  requesterId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const BloodRequestSchema: Schema = new Schema(
  {
    patientName: { type: String, required: true, trim: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    units: { type: Number, required: true, min: 1, max: 20, default: 1 },
    hospitalName: { type: String, required: true, trim: true },
    hospitalAddress: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    pinCode: { type: String, required: true, trim: true },
    urgency: {
      type: String,
      required: true,
      enum: ['normal', 'urgent', 'critical'],
      default: 'urgent',
    },
    contactPerson: { type: String, required: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'in_progress', 'fulfilled', 'cancelled'],
      default: 'pending',
    },
    notes: { type: String, trim: true },
    requiredDate: { type: String, required: true },
    requesterId: { type: String },
  },
  {
    timestamps: true,
  }
);

BloodRequestSchema.index({ bloodGroup: 1, city: 1, status: 1 });
BloodRequestSchema.index({ urgency: 1, createdAt: -1 });

export const BloodRequest = mongoose.models.BloodRequest || mongoose.model<IBloodRequest>('BloodRequest', BloodRequestSchema);
