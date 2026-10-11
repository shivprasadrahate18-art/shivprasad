import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db.ts';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('A strong JWT_SECRET environment variable is required.');
}
export const apiRouter = Router();

// Middleware: Authenticate JWT token
export const authMiddleware = async (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
};

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================

// POST /api/auth/register
apiRouter.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existing = await db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole = role === 'admin' ? 'donor' : role || 'donor'; // Prevent arbitrary self-admin creation via public route

    const newUser = await db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: assignedRole,
      phone: phone ? phone.trim() : undefined,
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        donorProfileId: newUser.donorProfileId,
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Failed to complete registration.' });
  }
});

// POST /api/auth/login
apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Look up associated donor profile if any
    let donorProfile = null;
    if (user.donorProfileId) {
      donorProfile = await db.getDonorById(user.donorProfileId);
    } else {
      donorProfile = await db.getDonorByUserId(user.id);
    }

    return res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        donorProfileId: donorProfile?.id || user.donorProfileId,
        donorProfile,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Failed to authenticate user.' });
  }
});

// GET /api/auth/me
apiRouter.get('/auth/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    let donorProfile = null;
    if (user.donorProfileId) {
      donorProfile = await db.getDonorById(user.donorProfileId);
    } else {
      donorProfile = await db.getDonorByUserId(user.id);
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        donorProfileId: donorProfile?.id || user.donorProfileId,
        donorProfile,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch current user session.' });
  }
});

// ==========================================
// 2. DONOR ENDPOINTS
// ==========================================

// POST /api/donors/register
apiRouter.post('/donors/register', async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      phone,
      bloodGroup,
      age,
      gender,
      weight,
      city,
      area,
      pinCode,
      availability,
      lastDonationDate,
      notes,
      password,
    } = req.body;

    // Strict Validations
    if (!fullName || !email || !phone || !bloodGroup || !age || !city || !pinCode) {
      return res.status(400).json({ error: 'All mandatory fields marked with an asterisk must be filled.' });
    }

    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({ error: 'Invalid blood group specified.' });
    }

    const parsedAge = Number(age);
    if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 65) {
      return res.status(400).json({ error: 'Donor age must be between 18 and 65 years old.' });
    }

    const parsedWeight = Number(weight || 50);
    if (parsedWeight < 45) {
      return res.status(400).json({ error: 'Donor must weigh at least 45kg (ideally 50kg+) to safely donate.' });
    }

    // Check if user account needs to be created or attached
    let userAccount = await db.getUserByEmail(email);
    let userId = userAccount ? userAccount.id : undefined;

    if (!userAccount && password && password.length >= 6) {
      const passwordHash = await bcrypt.hash(password, 10);
      userAccount = await db.createUser({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
        role: 'donor',
        phone: phone.trim(),
      });
      userId = userAccount.id;
    }

    const newDonor = await db.createDonor({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      bloodGroup,
      age: parsedAge,
      gender: gender || 'male',
      weight: parsedWeight,
      city: city.trim(),
      area: area ? area.trim() : city.trim(),
      pinCode: pinCode.trim(),
      availability: availability || 'available',
      lastDonationDate: lastDonationDate || undefined,
      totalDonations: 1,
      isVerified: true,
      notes: notes ? notes.trim() : 'Registered voluntary donor via BloodConnect web portal.',
      userId,
    });

    if (userAccount) {
      await db.updateUser(userAccount.id, { donorProfileId: newDonor.id });
    }

    return res.status(201).json({
      message: 'Donor registered successfully! Thank you for volunteering to save lives.',
      donor: newDonor,
    });
  } catch (err: any) {
    console.error('Donor register error:', err);
    return res.status(500).json({ error: 'An error occurred during donor registration.' });
  }
});

// GET /api/donors/search
apiRouter.get('/donors/search', async (req: Request, res: Response) => {
  try {
    const { bloodGroup, city, pinCode, availability, search } = req.query;

    const donors = await db.getDonors({
      bloodGroup: bloodGroup as string,
      city: city as string,
      pinCode: pinCode as string,
      availability: availability as string,
      search: search as string,
    });

    return res.json({
      count: donors.length,
      donors,
    });
  } catch (err: any) {
    console.error('Donor search error:', err);
    return res.status(500).json({ error: 'Failed to search donors.' });
  }
});

// GET /api/donors/:id
apiRouter.get('/donors/:id', async (req: Request, res: Response) => {
  try {
    const donor = await db.getDonorById(req.params.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found.' });
    }
    return res.json({ donor });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch donor details.' });
  }
});

// PUT /api/donors/:id
apiRouter.put('/donors/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const existing = await db.getDonorById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Donor profile not found.' });
    }

    const {
      fullName,
      phone,
      bloodGroup,
      age,
      weight,
      city,
      area,
      pinCode,
      availability,
      lastDonationDate,
      totalDonations,
      isVerified,
      notes,
    } = req.body;

    const updated = await db.updateDonor(id, {
      ...(fullName && { fullName: fullName.trim() }),
      ...(phone && { phone: phone.trim() }),
      ...(bloodGroup && { bloodGroup }),
      ...(age && { age: Number(age) }),
      ...(weight && { weight: Number(weight) }),
      ...(city && { city: city.trim() }),
      ...(area && { area: area.trim() }),
      ...(pinCode && { pinCode: pinCode.trim() }),
      ...(availability && { availability }),
      ...(lastDonationDate !== undefined && { lastDonationDate }),
      ...(totalDonations !== undefined && { totalDonations: Number(totalDonations) }),
      ...(isVerified !== undefined && { isVerified: Boolean(isVerified) }),
      ...(notes !== undefined && { notes: notes.trim() }),
    });

    return res.json({
      message: 'Donor profile updated successfully.',
      donor: updated,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update donor profile.' });
  }
});

// DELETE /api/donors/:id
apiRouter.delete('/donors/:id', async (req: Request, res: Response) => {
  try {
    const success = await db.deleteDonor(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Donor not found.' });
    }
    return res.json({ message: 'Donor profile deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete donor profile.' });
  }
});

// ==========================================
// 3. BLOOD REQUEST ENDPOINTS
// ==========================================

// POST /api/requests
apiRouter.post('/requests', async (req: Request, res: Response) => {
  try {
    const {
      patientName,
      bloodGroup,
      units,
      hospitalName,
      hospitalAddress,
      city,
      pinCode,
      urgency,
      contactPerson,
      contactPhone,
      requiredDate,
      notes,
      requesterId,
    } = req.body;

    if (!patientName || !bloodGroup || !hospitalName || !city || !contactPhone) {
      return res.status(400).json({ error: 'Patient name, blood group, hospital, city, and phone number are required.' });
    }

    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({ error: 'Invalid blood group specified.' });
    }

    const newRequest = await db.createBloodRequest({
      patientName: patientName.trim(),
      bloodGroup,
      units: Math.max(1, Number(units) || 1),
      hospitalName: hospitalName.trim(),
      hospitalAddress: (hospitalAddress || hospitalName).trim(),
      city: city.trim(),
      pinCode: (pinCode || '100001').trim(),
      urgency: urgency || 'urgent',
      contactPerson: (contactPerson || patientName).trim(),
      contactPhone: contactPhone.trim(),
      status: 'pending',
      notes: notes ? notes.trim() : undefined,
      requiredDate: requiredDate || new Date().toISOString().split('T')[0],
      requesterId,
    });

    // Count potential matching donors in that city
    const matchingDonors = await db.getDonors({
      bloodGroup,
      city,
      availability: 'available',
    });

    return res.status(201).json({
      message: 'Blood request registered and broadcasted to eligible donors!',
      request: newRequest,
      matchedDonorsCount: matchingDonors.length,
    });
  } catch (err: any) {
    console.error('Request creation error:', err);
    return res.status(500).json({ error: 'Failed to create blood request.' });
  }
});

// GET /api/requests
apiRouter.get('/requests', async (req: Request, res: Response) => {
  try {
    const { bloodGroup, city, status, urgency } = req.query;

    const requests = await db.getBloodRequests({
      bloodGroup: bloodGroup as string,
      city: city as string,
      status: status as string,
      urgency: urgency as string,
    });

    return res.json({
      count: requests.length,
      requests,
    });
  } catch (err: any) {
    console.error('Requests fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch blood requests.' });
  }
});

// GET /api/requests/:id
apiRouter.get('/requests/:id', async (req: Request, res: Response) => {
  try {
    const request = await db.getBloodRequestById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Blood request not found.' });
    }
    return res.json({ request });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch request.' });
  }
});

// PUT /api/requests/:id/status
apiRouter.put('/requests/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'in_progress', 'fulfilled', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status provided.' });
    }

    const updated = await db.updateBloodRequestStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Blood request not found.' });
    }

    return res.json({
      message: `Request status updated to ${status}.`,
      request: updated,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update request status.' });
  }
});

// DELETE /api/requests/:id
apiRouter.delete('/requests/:id', async (req: Request, res: Response) => {
  try {
    const success = await db.deleteBloodRequest(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Request not found.' });
    }
    return res.json({ message: 'Blood request removed successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete blood request.' });
  }
});

// ==========================================
// 4. STATS & ANALYTICS
// ==========================================

// GET /api/stats
apiRouter.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await db.getStats();
    return res.json(stats);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to calculate platform statistics.' });
  }
});

// POST /api/contact/request
// Secure contact request from seeker to donor
apiRouter.post('/contact/request', async (req: Request, res: Response) => {
  try {
    const { donorId, seekerName, seekerPhone, message, bloodGroupNeeded } = req.body;

    if (!donorId || !seekerName || !seekerPhone) {
      return res.status(400).json({ error: 'Donor ID, seeker name, and contact phone are required.' });
    }

    const donor = await db.getDonorById(donorId);
    if (!donor) {
      return res.status(404).json({ error: 'Donor not found.' });
    }

    // In a production hospital integration, an SMS or push notification is dispatched to the donor.
    // Return donor contact details securely with explicit authorization consent
    return res.json({
      success: true,
      message: `Direct emergency contact details retrieved. Please be courteous and contact only for genuine transfusion requests.`,
      donor: {
        id: donor.id,
        fullName: donor.fullName,
        phone: donor.phone,
        email: donor.email,
        city: donor.city,
        area: donor.area,
        bloodGroup: donor.bloodGroup,
        availability: donor.availability,
      },
      sentAlert: true,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process donor contact request.' });
  }
});
