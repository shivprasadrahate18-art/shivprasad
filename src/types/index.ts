export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type DonorAvailability = 'available' | 'on_call' | 'unavailable';

export type RequestUrgency = 'normal' | 'urgent' | 'critical';

export type RequestStatus = 'pending' | 'in_progress' | 'fulfilled' | 'cancelled';

export type UserRole = 'donor' | 'requester' | 'admin';

export interface Donor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bloodGroup: BloodGroup;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  city: string;
  area: string;
  pinCode: string;
  availability: DonorAvailability;
  lastDonationDate?: string;
  totalDonations: number;
  isVerified: boolean;
  notes?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  units: number;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  pinCode: string;
  urgency: RequestUrgency;
  contactPerson: string;
  contactPhone: string;
  status: RequestStatus;
  notes?: string;
  requiredDate: string;
  requesterId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  donorProfileId?: string;
  donorProfile?: Donor | null;
}

export interface StatsData {
  totalDonors: number;
  availableDonors: number;
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  fulfilledRequests: number;
  criticalRequests: number;
  livesSavedEst: number;
  groupCounts: Record<string, { total: number; available: number }>;
  isMongoConnected: boolean;
}

export interface SearchFilterState {
  bloodGroup: string;
  city: string;
  pinCode: string;
  availability: string;
  search: string;
}

// Blood compatibility mapping
export const BLOOD_COMPATIBILITY: Record<
  BloodGroup,
  { canDonateTo: BloodGroup[]; canReceiveFrom: BloodGroup[]; description: string }
> = {
  'O-': {
    canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-'],
    description: 'Universal Red Blood Cell Donor. Critical in trauma and neonatal emergencies.',
  },
  'O+': {
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O-', 'O+'],
    description: 'Most common blood group. Essential for everyday transfusions and surgeries.',
  },
  'A-': {
    canDonateTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['A-', 'O-'],
    description: 'Can donate RBCs to A and AB patients. Relatively rare.',
  },
  'A+': {
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    description: 'High demand for surgery and cancer chemotherapy transfusions.',
  },
  'B-': {
    canDonateTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['B-', 'O-'],
    description: 'Rare blood group. Critical for targeted emergency matching.',
  },
  'B+': {
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    description: 'Widely prevalent in South Asia and diverse populations.',
  },
  'AB-': {
    canDonateTo: ['AB-', 'AB+'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    description: 'One of the rarest blood groups globally (<1% of population).',
  },
  'AB+': {
    canDonateTo: ['AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    description: 'Universal Recipient for red blood cells. Universal donor for plasma.',
  },
};
