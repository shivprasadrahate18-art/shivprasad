import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IDonorRecord {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface IUserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'donor' | 'requester' | 'admin';
  phone?: string;
  donorProfileId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBloodRequestRecord {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface IDatabaseStore {
  donors: IDonorRecord[];
  users: IUserRecord[];
  requests: IBloodRequestRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'bloodconnect_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Data with varied blood groups and locations
const getInitialSeedData = (): IDatabaseStore => {
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);
  const donorPasswordHash = bcrypt.hashSync('donor123', 10);
  const requesterPasswordHash = bcrypt.hashSync('request123', 10);

  const initialUsers: IUserRecord[] = [
    {
      id: 'usr_admin_1',
      name: 'Dr. Evelyn Reed (Medical Director)',
      email: 'admin@bloodconnect.org',
      passwordHash: adminPasswordHash,
      role: 'admin',
      phone: '+1 (555) 019-2834',
      createdAt: new Date('2026-01-15T08:00:00Z').toISOString(),
      updatedAt: new Date('2026-01-15T08:00:00Z').toISOString(),
    },
    {
      id: 'usr_donor_1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      passwordHash: donorPasswordHash,
      role: 'donor',
      phone: '+91 98765 43210',
      donorProfileId: 'dnr_1',
      createdAt: new Date('2026-02-10T10:00:00Z').toISOString(),
      updatedAt: new Date('2026-02-10T10:00:00Z').toISOString(),
    },
    {
      id: 'usr_req_1',
      name: 'Priya Verma',
      email: 'priya.verma@example.com',
      passwordHash: requesterPasswordHash,
      role: 'requester',
      phone: '+91 98220 11223',
      createdAt: new Date('2026-03-01T11:00:00Z').toISOString(),
      updatedAt: new Date('2026-03-01T11:00:00Z').toISOString(),
    },
  ];

  const initialDonors: IDonorRecord[] = [
    {
      id: 'dnr_1',
      fullName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      bloodGroup: 'O+',
      age: 28,
      gender: 'male',
      weight: 72,
      city: 'Mumbai',
      area: 'Andheri West',
      pinCode: '400058',
      availability: 'available',
      lastDonationDate: '2025-11-20',
      totalDonations: 4,
      isVerified: true,
      notes: 'Universal RBC donor. Regular platelet and whole blood donor.',
      userId: 'usr_donor_1',
      createdAt: new Date('2026-02-10T10:00:00Z').toISOString(),
      updatedAt: new Date('2026-02-10T10:00:00Z').toISOString(),
    },
    {
      id: 'dnr_2',
      fullName: 'Ananya Deshmukh',
      email: 'ananya.deshmukh@example.com',
      phone: '+91 97654 32109',
      bloodGroup: 'A+',
      age: 25,
      gender: 'female',
      weight: 58,
      city: 'Pune',
      area: 'Kothrud',
      pinCode: '411038',
      availability: 'available',
      lastDonationDate: '2025-12-15',
      totalDonations: 3,
      isVerified: true,
      notes: 'Available on weekends and rapid emergency call.',
      createdAt: new Date('2026-02-14T09:30:00Z').toISOString(),
      updatedAt: new Date('2026-02-14T09:30:00Z').toISOString(),
    },
    {
      id: 'dnr_3',
      fullName: 'Marcus Vance',
      email: 'marcus.vance@example.com',
      phone: '+1 (555) 234-5678',
      bloodGroup: 'O-',
      age: 34,
      gender: 'male',
      weight: 80,
      city: 'New York',
      area: 'Manhattan',
      pinCode: '10001',
      availability: 'available',
      lastDonationDate: '2025-10-05',
      totalDonations: 7,
      isVerified: true,
      notes: 'Rare universal whole blood donor (O-negative). Gold donor badge.',
      createdAt: new Date('2026-01-20T14:15:00Z').toISOString(),
      updatedAt: new Date('2026-01-20T14:15:00Z').toISOString(),
    },
    {
      id: 'dnr_4',
      fullName: 'Aarav Patel',
      email: 'aarav.patel@example.com',
      phone: '+91 99887 76655',
      bloodGroup: 'B+',
      age: 31,
      gender: 'male',
      weight: 68,
      city: 'Ahmedabad',
      area: 'Navrangpura',
      pinCode: '380009',
      availability: 'available',
      lastDonationDate: '2025-09-12',
      totalDonations: 5,
      isVerified: true,
      notes: 'Ready for emergency blood drives.',
      createdAt: new Date('2026-01-25T11:45:00Z').toISOString(),
      updatedAt: new Date('2026-01-25T11:45:00Z').toISOString(),
    },
    {
      id: 'dnr_5',
      fullName: 'Dr. Sarah Jenkins',
      email: 'dr.jenkins@example.com',
      phone: '+1 (555) 345-6789',
      bloodGroup: 'AB+',
      age: 39,
      gender: 'female',
      weight: 64,
      city: 'Chicago',
      area: 'Lincoln Park',
      pinCode: '60614',
      availability: 'available',
      lastDonationDate: '2026-01-08',
      totalDonations: 9,
      isVerified: true,
      notes: 'Universal plasma donor (AB+). Clinical researcher.',
      createdAt: new Date('2026-02-01T16:20:00Z').toISOString(),
      updatedAt: new Date('2026-02-01T16:20:00Z').toISOString(),
    },
    {
      id: 'dnr_6',
      fullName: 'Vikram Sengupta',
      email: 'vikram.s@example.com',
      phone: '+91 98301 23456',
      bloodGroup: 'A-',
      age: 29,
      gender: 'male',
      weight: 74,
      city: 'Kolkata',
      area: 'Salt Lake City',
      pinCode: '700091',
      availability: 'on_call',
      lastDonationDate: '2025-11-01',
      totalDonations: 2,
      isVerified: true,
      notes: 'On-call volunteer; call 2 hours in advance.',
      createdAt: new Date('2026-02-18T10:10:00Z').toISOString(),
      updatedAt: new Date('2026-02-18T10:10:00Z').toISOString(),
    },
    {
      id: 'dnr_7',
      fullName: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      phone: '+91 94401 56789',
      bloodGroup: 'B-',
      age: 27,
      gender: 'female',
      weight: 55,
      city: 'Hyderabad',
      area: 'Banjara Hills',
      pinCode: '500034',
      availability: 'available',
      lastDonationDate: '2025-08-19',
      totalDonations: 4,
      isVerified: true,
      notes: 'Rare B- donor. Always willing for maternity emergencies.',
      createdAt: new Date('2026-02-22T13:00:00Z').toISOString(),
      updatedAt: new Date('2026-02-22T13:00:00Z').toISOString(),
    },
    {
      id: 'dnr_8',
      fullName: 'Karthik Raman',
      email: 'karthik.raman@example.com',
      phone: '+91 98410 98765',
      bloodGroup: 'AB-',
      age: 33,
      gender: 'male',
      weight: 71,
      city: 'Chennai',
      area: 'Adyar',
      pinCode: '600020',
      availability: 'available',
      lastDonationDate: '2025-10-30',
      totalDonations: 6,
      isVerified: true,
      notes: 'Extremely rare blood group AB-. Verified donor.',
      createdAt: new Date('2026-03-02T15:30:00Z').toISOString(),
      updatedAt: new Date('2026-03-02T15:30:00Z').toISOString(),
    },
    {
      id: 'dnr_9',
      fullName: 'Tanvi Iyer',
      email: 'tanvi.iyer@example.com',
      phone: '+91 98801 12345',
      bloodGroup: 'O+',
      age: 24,
      gender: 'female',
      weight: 52,
      city: 'Bangalore',
      area: 'Indiranagar',
      pinCode: '560038',
      availability: 'available',
      lastDonationDate: '2026-01-10',
      totalDonations: 2,
      isVerified: true,
      notes: 'Available for Bangalore hospital emergency calls.',
      createdAt: new Date('2026-03-05T08:45:00Z').toISOString(),
      updatedAt: new Date('2026-03-05T08:45:00Z').toISOString(),
    },
    {
      id: 'dnr_10',
      fullName: 'Mohammad Farooq',
      email: 'm.farooq@example.com',
      phone: '+91 98111 22334',
      bloodGroup: 'O-',
      age: 36,
      gender: 'male',
      weight: 76,
      city: 'Delhi',
      area: 'Connaught Place',
      pinCode: '110001',
      availability: 'available',
      lastDonationDate: '2025-11-14',
      totalDonations: 8,
      isVerified: true,
      notes: 'Universal donor O- on call for NCR critical cases.',
      createdAt: new Date('2026-03-10T12:00:00Z').toISOString(),
      updatedAt: new Date('2026-03-10T12:00:00Z').toISOString(),
    },
  ];

  const initialRequests: IBloodRequestRecord[] = [
    {
      id: 'req_1',
      patientName: 'Kavita Sundaram (Trauma ICU)',
      bloodGroup: 'O-',
      units: 3,
      hospitalName: 'Apollo Speciality Hospital',
      hospitalAddress: 'Greams Road, Thousand Lights',
      city: 'Chennai',
      pinCode: '600006',
      urgency: 'critical',
      contactPerson: 'Dr. R. Natarajan / Duty Incharge',
      contactPhone: '+91 98400 11990',
      status: 'pending',
      notes: 'Emergency surgical crossmatch required immediately. Accident patient in critical trauma.',
      requiredDate: '2026-10-12',
      createdAt: new Date('2026-10-11T09:15:00Z').toISOString(),
      updatedAt: new Date('2026-10-11T09:15:00Z').toISOString(),
    },
    {
      id: 'req_2',
      patientName: 'Master Ayaan Sheikh (Thalassemia)',
      bloodGroup: 'B+',
      units: 2,
      hospitalName: 'Lilavati Hospital & Research Centre',
      hospitalAddress: 'A-791, Bandra Reclamation, Bandra West',
      city: 'Mumbai',
      pinCode: '400050',
      urgency: 'urgent',
      contactPerson: 'Zeenat Sheikh (Parent)',
      contactPhone: '+91 98200 44556',
      status: 'in_progress',
      notes: 'Bi-weekly transfusion needed for 7-year old thalassemia patient. One unit arranged, 1 remaining.',
      requiredDate: '2026-10-13',
      createdAt: new Date('2026-10-10T14:30:00Z').toISOString(),
      updatedAt: new Date('2026-10-11T08:00:00Z').toISOString(),
    },
    {
      id: 'req_3',
      patientName: 'Rajesh Mehra (Cardiology Bypass)',
      bloodGroup: 'A+',
      units: 4,
      hospitalName: 'Fortis Escorts Heart Institute',
      hospitalAddress: 'Okhla Road, New Friends Colony',
      city: 'Delhi',
      pinCode: '110025',
      urgency: 'urgent',
      contactPerson: 'Sandeep Mehra',
      contactPhone: '+91 98101 77889',
      status: 'pending',
      notes: 'Scheduled open heart valve replacement. Pre-operative blood reserve.',
      requiredDate: '2026-10-14',
      createdAt: new Date('2026-10-09T16:00:00Z').toISOString(),
      updatedAt: new Date('2026-10-09T16:00:00Z').toISOString(),
    },
    {
      id: 'req_4',
      patientName: 'Devika Nair (Maternity)',
      bloodGroup: 'AB-',
      units: 2,
      hospitalName: 'Manipal Hospital',
      hospitalAddress: '98, HAL Old Airport Rd, Kodihalli',
      city: 'Bangalore',
      pinCode: '560017',
      urgency: 'normal',
      contactPerson: 'Gautam Nair',
      contactPhone: '+91 99000 33445',
      status: 'fulfilled',
      notes: 'Emergency cesarean delivery. Successfully matched with registered donor Karthik Raman.',
      requiredDate: '2026-10-08',
      createdAt: new Date('2026-10-07T11:20:00Z').toISOString(),
      updatedAt: new Date('2026-10-08T18:40:00Z').toISOString(),
    },
  ];

  return {
    donors: initialDonors,
    users: initialUsers,
    requests: initialRequests,
  };
};

class DatabaseManager {
  private store: IDatabaseStore;
  private isConnectedToMongo: boolean = false;

  constructor() {
    this.store = this.loadFromFile();
    this.tryMongoConnect();
  }

  private loadFromFile(): IDatabaseStore {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.donors && parsed.users && parsed.requests) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not read existing db file, using fresh seeds', err);
    }

    const initial = getInitialSeedData();
    this.saveToFile(initial);
    return initial;
  }

  private saveToFile(data: IDatabaseStore): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file', err);
    }
  }

  private async tryMongoConnect() {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri && mongoUri.trim().length > 0) {
      try {
        await mongoose.connect(mongoUri);
        this.isConnectedToMongo = true;
        console.log('Successfully connected to MongoDB instance');
      } catch (err) {
        console.warn('MongoDB connection failed; utilizing persistent embedded JSON database', err);
        this.isConnectedToMongo = false;
      }
    } else {
      console.log('MONGODB_URI not specified. Using high-performance persistent storage file at data/bloodconnect_db.json');
    }
  }

  // --- Donors CRUD ---
  public async getDonors(query?: {
    bloodGroup?: string;
    city?: string;
    pinCode?: string;
    availability?: string;
    search?: string;
  }): Promise<IDonorRecord[]> {
    let results = [...this.store.donors];

    if (query?.bloodGroup && query.bloodGroup !== 'ALL') {
      results = results.filter((d) => d.bloodGroup === query.bloodGroup);
    }

    if (query?.city && query.city.trim() !== '') {
      const c = query.city.trim().toLowerCase();
      results = results.filter((d) => d.city.toLowerCase().includes(c));
    }

    if (query?.pinCode && query.pinCode.trim() !== '') {
      const pin = query.pinCode.trim();
      results = results.filter((d) => d.pinCode.includes(pin));
    }

    if (query?.availability && query.availability !== 'ALL') {
      results = results.filter((d) => d.availability === query.availability);
    }

    if (query?.search && query.search.trim() !== '') {
      const s = query.search.trim().toLowerCase();
      results = results.filter(
        (d) =>
          d.fullName.toLowerCase().includes(s) ||
          d.city.toLowerCase().includes(s) ||
          d.area.toLowerCase().includes(s) ||
          d.pinCode.includes(s)
      );
    }

    // Sort: available first, then totalDonations descending
    results.sort((a, b) => {
      if (a.availability === 'available' && b.availability !== 'available') return -1;
      if (b.availability === 'available' && a.availability !== 'available') return 1;
      return b.totalDonations - a.totalDonations;
    });

    return results;
  }

  public async getDonorById(id: string): Promise<IDonorRecord | null> {
    const donor = this.store.donors.find((d) => d.id === id);
    return donor || null;
  }

  public async getDonorByUserId(userId: string): Promise<IDonorRecord | null> {
    const donor = this.store.donors.find((d) => d.userId === userId);
    return donor || null;
  }

  public async createDonor(donorData: Omit<IDonorRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<IDonorRecord> {
    const now = new Date().toISOString();
    const newDonor: IDonorRecord = {
      ...donorData,
      id: 'dnr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      createdAt: now,
      updatedAt: now,
    };
    this.store.donors.unshift(newDonor);
    this.saveToFile(this.store);
    return newDonor;
  }

  public async updateDonor(id: string, updates: Partial<IDonorRecord>): Promise<IDonorRecord | null> {
    const idx = this.store.donors.findIndex((d) => d.id === id);
    if (idx === -1) return null;

    this.store.donors[idx] = {
      ...this.store.donors[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToFile(this.store);
    return this.store.donors[idx];
  }

  public async deleteDonor(id: string): Promise<boolean> {
    const prevLen = this.store.donors.length;
    this.store.donors = this.store.donors.filter((d) => d.id !== id);
    if (this.store.donors.length !== prevLen) {
      this.saveToFile(this.store);
      return true;
    }
    return false;
  }

  // --- Users CRUD & Auth ---
  public async getUserByEmail(email: string): Promise<IUserRecord | null> {
    const user = this.store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }

  public async getUserById(id: string): Promise<IUserRecord | null> {
    const user = this.store.users.find((u) => u.id === id);
    return user || null;
  }

  public async createUser(userData: {
    name: string;
    email: string;
    passwordHash: string;
    role: 'donor' | 'requester' | 'admin';
    phone?: string;
    donorProfileId?: string;
  }): Promise<IUserRecord> {
    const now = new Date().toISOString();
    const newUser: IUserRecord = {
      ...userData,
      id: 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      createdAt: now,
      updatedAt: now,
    };
    this.store.users.push(newUser);
    this.saveToFile(this.store);
    return newUser;
  }

  public async updateUser(id: string, updates: Partial<IUserRecord>): Promise<IUserRecord | null> {
    const idx = this.store.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    this.store.users[idx] = {
      ...this.store.users[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToFile(this.store);
    return this.store.users[idx];
  }

  // --- Blood Requests CRUD ---
  public async getBloodRequests(filter?: {
    bloodGroup?: string;
    city?: string;
    status?: string;
    urgency?: string;
  }): Promise<IBloodRequestRecord[]> {
    let results = [...this.store.requests];

    if (filter?.bloodGroup && filter.bloodGroup !== 'ALL') {
      results = results.filter((r) => r.bloodGroup === filter.bloodGroup);
    }
    if (filter?.city && filter.city.trim() !== '') {
      const c = filter.city.trim().toLowerCase();
      results = results.filter((r) => r.city.toLowerCase().includes(c));
    }
    if (filter?.status && filter.status !== 'ALL') {
      results = results.filter((r) => r.status === filter.status);
    }
    if (filter?.urgency && filter.urgency !== 'ALL') {
      results = results.filter((r) => r.urgency === filter.urgency);
    }

    // Urgency sort: critical first, then urgent, then normal; then newest
    const urgencyWeight: Record<string, number> = { critical: 3, urgent: 2, normal: 1 };
    results.sort((a, b) => {
      const diff = (urgencyWeight[b.urgency] || 0) - (urgencyWeight[a.urgency] || 0);
      if (diff !== 0) return diff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return results;
  }

  public async getBloodRequestById(id: string): Promise<IBloodRequestRecord | null> {
    const req = this.store.requests.find((r) => r.id === id);
    return req || null;
  }

  public async createBloodRequest(
    data: Omit<IBloodRequestRecord, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<IBloodRequestRecord> {
    const now = new Date().toISOString();
    const newReq: IBloodRequestRecord = {
      ...data,
      id: 'req_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      createdAt: now,
      updatedAt: now,
    };
    this.store.requests.unshift(newReq);
    this.saveToFile(this.store);
    return newReq;
  }

  public async updateBloodRequestStatus(
    id: string,
    status: 'pending' | 'in_progress' | 'fulfilled' | 'cancelled'
  ): Promise<IBloodRequestRecord | null> {
    const idx = this.store.requests.findIndex((r) => r.id === id);
    if (idx === -1) return null;

    this.store.requests[idx].status = status;
    this.store.requests[idx].updatedAt = new Date().toISOString();
    this.saveToFile(this.store);
    return this.store.requests[idx];
  }

  public async deleteBloodRequest(id: string): Promise<boolean> {
    const prevLen = this.store.requests.length;
    this.store.requests = this.store.requests.filter((r) => r.id !== id);
    if (this.store.requests.length !== prevLen) {
      this.saveToFile(this.store);
      return true;
    }
    return false;
  }

  // --- Aggregate Stats ---
  public async getStats() {
    const totalDonors = this.store.donors.length;
    const availableDonors = this.store.donors.filter((d) => d.availability === 'available').length;
    const totalRequests = this.store.requests.length;
    const pendingRequests = this.store.requests.filter((r) => r.status === 'pending').length;
    const inProgressRequests = this.store.requests.filter((r) => r.status === 'in_progress').length;
    const fulfilledRequests = this.store.requests.filter((r) => r.status === 'fulfilled').length;
    const criticalRequests = this.store.requests.filter(
      (r) => r.urgency === 'critical' && r.status !== 'fulfilled' && r.status !== 'cancelled'
    ).length;

    // Group breakdown
    const bloodGroups: Array<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'> = [
      'A+',
      'A-',
      'B+',
      'B-',
      'AB+',
      'AB-',
      'O+',
      'O-',
    ];

    const groupCounts: Record<string, { total: number; available: number }> = {};
    for (const bg of bloodGroups) {
      groupCounts[bg] = {
        total: this.store.donors.filter((d) => d.bloodGroup === bg).length,
        available: this.store.donors.filter((d) => d.bloodGroup === bg && d.availability === 'available').length,
      };
    }

    const livesSavedEst = fulfilledRequests * 3 + this.store.donors.reduce((acc, d) => acc + d.totalDonations * 3, 0);

    return {
      totalDonors,
      availableDonors,
      totalRequests,
      pendingRequests,
      inProgressRequests,
      fulfilledRequests,
      criticalRequests,
      livesSavedEst,
      groupCounts,
      isMongoConnected: this.isConnectedToMongo,
    };
  }
}

export const db = new DatabaseManager();
