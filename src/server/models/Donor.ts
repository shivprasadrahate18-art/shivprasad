import mongoose, { Schema, Document } from 'mongoose';

export interface IDonor extends Document {
  fullName: string;
  email: string;
  phone: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  city: string;
  area: string;
  pinCode: string;
  availability: 'available' | 'on_call' | 'unavailable';
  lastDonationDate?: string;
  totalDonations: number;
  isVerified: boolean;
  notes?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const DonorSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    age: { type: Number, required: true, min: 18, max: 65 },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    weight: { type: Number, required: true, min: 45 },
    city: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    pinCode: { type: String, required: true, trim: true },
    availability: {
      type: String,
      required: true,
      enum: ['available', 'on_call', 'unavailable'],
      default: 'available',
    },
    lastDonationDate: { type: String },
    totalDonations: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: true },
    notes: { type: String },
    userId: { type: String },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying
DonorSchema.index({ bloodGroup: 1, city: 1, availability: 1 });
DonorSchema.index({ pinCode: 1 });

export const Donor = mongoose.models.Donor || mongoose.model<IDonor>('Donor', DonorSchema);
