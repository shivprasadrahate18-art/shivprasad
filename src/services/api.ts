import { Donor, BloodRequest, StatsData, User } from '../types';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('bloodconnect_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function parseResponse<T>(res: Response, fallbackError: string): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || fallbackError);
    }
    return data;
  }
  if (!res.ok) {
    throw new Error(`${fallbackError} (Status: ${res.status})`);
  }
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Unexpected non-JSON response from server');
  }
}

export const api = {
  // Statistics
  async getStats(): Promise<StatsData> {
    const res = await fetch('/api/stats');
    return parseResponse<StatsData>(res, 'Failed to load stats');
  },

  // Donors
  async searchDonors(params?: {
    bloodGroup?: string;
    city?: string;
    pinCode?: string;
    availability?: string;
    search?: string;
  }): Promise<{ count: number; donors: Donor[] }> {
    const query = new URLSearchParams();
    if (params?.bloodGroup && params.bloodGroup !== 'ALL') query.set('bloodGroup', params.bloodGroup);
    if (params?.city) query.set('city', params.city);
    if (params?.pinCode) query.set('pinCode', params.pinCode);
    if (params?.availability && params.availability !== 'ALL') query.set('availability', params.availability);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`/api/donors/search?${query.toString()}`);
    return parseResponse<{ count: number; donors: Donor[] }>(res, 'Failed to search donors');
  },

  async getDonor(id: string): Promise<{ donor: Donor }> {
    const res = await fetch(`/api/donors/${id}`);
    return parseResponse<{ donor: Donor }>(res, 'Failed to fetch donor details');
  },

  async registerDonor(data: any): Promise<{ message: string; donor: Donor }> {
    const res = await fetch('/api/donors/register', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return parseResponse<{ message: string; donor: Donor }>(res, 'Failed to register donor');
  },

  async updateDonor(id: string, data: Partial<Donor>): Promise<{ message: string; donor: Donor }> {
    const res = await fetch(`/api/donors/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return parseResponse<{ message: string; donor: Donor }>(res, 'Failed to update donor');
  },

  async deleteDonor(id: string): Promise<{ message: string }> {
    const res = await fetch(`/api/donors/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return parseResponse<{ message: string }>(res, 'Failed to delete donor');
  },

  // Blood Requests
  async getBloodRequests(params?: {
    bloodGroup?: string;
    city?: string;
    status?: string;
    urgency?: string;
  }): Promise<{ count: number; requests: BloodRequest[] }> {
    const query = new URLSearchParams();
    if (params?.bloodGroup && params.bloodGroup !== 'ALL') query.set('bloodGroup', params.bloodGroup);
    if (params?.city) query.set('city', params.city);
    if (params?.status && params.status !== 'ALL') query.set('status', params.status);
    if (params?.urgency && params.urgency !== 'ALL') query.set('urgency', params.urgency);

    const res = await fetch(`/api/requests?${query.toString()}`);
    return parseResponse<{ count: number; requests: BloodRequest[] }>(res, 'Failed to fetch blood requests');
  },

  async getBloodRequest(id: string): Promise<{ request: BloodRequest }> {
    const res = await fetch(`/api/requests/${id}`);
    return parseResponse<{ request: BloodRequest }>(res, 'Failed to fetch blood request');
  },

  async createBloodRequest(data: any): Promise<{ message: string; request: BloodRequest; matchedDonorsCount: number }> {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return parseResponse<{ message: string; request: BloodRequest; matchedDonorsCount: number }>(
      res,
      'Failed to submit blood request'
    );
  },

  async updateBloodRequestStatus(
    id: string,
    status: 'pending' | 'in_progress' | 'fulfilled' | 'cancelled'
  ): Promise<{ message: string; request: BloodRequest }> {
    const res = await fetch(`/api/requests/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return parseResponse<{ message: string; request: BloodRequest }>(res, 'Failed to update request status');
  },

  async deleteBloodRequest(id: string): Promise<{ message: string }> {
    const res = await fetch(`/api/requests/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return parseResponse<{ message: string }>(res, 'Failed to delete blood request');
  },

  // Contact Donor
  async requestDonorContact(data: {
    donorId: string;
    seekerName: string;
    seekerPhone: string;
    bloodGroupNeeded: string;
    message?: string;
  }): Promise<{ success: boolean; message: string; donor: Partial<Donor>; sentAlert: boolean }> {
    const res = await fetch('/api/contact/request', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return parseResponse<{ success: boolean; message: string; donor: Partial<Donor>; sentAlert: boolean }>(
      res,
      'Failed to retrieve donor contact'
    );
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User; message: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return parseResponse<{ token: string; user: User; message: string }>(res, 'Login failed');
  },

  async registerUser(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
  }): Promise<{ token: string; user: User; message: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return parseResponse<{ token: string; user: User; message: string }>(res, 'Registration failed');
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders(),
    });
    return parseResponse<{ user: User }>(res, 'Session invalid');
  },
};

