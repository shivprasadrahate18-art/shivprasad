# BloodConnect – Find Blood, Save Lives

A modern, responsive, and production-grade full-stack healthcare web application designed to connect blood recipients with nearby voluntary blood donors in real time during medical emergencies and scheduled surgeries.

---

## 1. Project Architecture

The application is structured into modular frontend and backend layers:

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide icons.
- **Backend API**: Node.js, Express.js REST API, JSON Web Tokens (JWT), and bcryptjs password hashing.
- **Database Layer**:
  - **MongoDB / Mongoose**: Built-in Mongoose schemas for `Donor`, `User`, and `BloodRequest` (in `/server/models/`). Connects seamlessly to MongoDB Atlas or local MongoDB when `MONGODB_URI` is provided in `.env`.
  - **Zero-Setup Persistent Storage Engine**: Features an embedded JSON database (`data/bloodconnect_db.json`) that saves all registrations, donor profile updates, requests, and accounts directly to disk so the application works out-of-the-box with full data persistence even before an external database is configured.

---

## 2. Key Features

1. **Find Blood Donors**:
   - Filter by blood group: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`.
   - Filter by city, region, or PIN code.
   - Filter by availability status (`Available Now`, `On Call`, `Unavailable`).
   - "Include Medically Compatible Donors" toggle (e.g., universal donors for O+ or AB+).
   - Donor cards display full name, location, donation count, verified status, and last donation date.
   - Secure donor contact modal with explicit authorization disclosure (direct phone call, SMS, and WhatsApp message).

2. **Voluntary Donor Registration**:
   - Comprehensive donor questionnaire: Full name, age (18–65 validation), blood group, weight ($\ge$45kg validation), gender, city, area, PIN code, contact details.
   - Health safety and ethical declaration checklist.
   - Immediate calculation of donation eligibility and 90-day donation interval countdown.
   - Generates digital donor profile and saves to database.

3. **Emergency Blood Request System**:
   - Form for patients and hospitals: Patient name, required blood group, units, hospital address, city, urgency level (`Critical Emergency`, `Urgent Requirement`, `Planned Surgery`), and coordinator phone number.
   - Real-time matching calculation showing number of eligible donors nearby.
   - Live blood request feed with status workflow tracking: `Pending` $\rightarrow$ `In Progress` $\rightarrow$ `Fulfilled`.

4. **Donor Dashboard**:
   - Live availability toggle (`Available Now`, `On Call`, `Unavailable`).
   - Interactive Digital Donor Card with printable ID card view.
   - Donation interval countdown tracker.
   - List of urgent matching patients in their city.
   - Profile edit form.

5. **Admin Portal**:
   - Overview metrics: Total donors, available donors, pending requests, fulfilled transfusions, and critical cases.
   - Donor management: Search, toggle verified status, and remove profiles.
   - Request management: Update transfusion status and manage hospital listings.
   - Database storage engine indicator.

6. **Interactive Blood Compatibility Matrix**:
   - Comprehensive clinical tool detailing RBC compatibility for every blood type, universal donor (O-) rules, and universal recipient (AB+) guidelines.

---

## 3. Installation & Execution Instructions

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Windows Installation Steps
1. Open PowerShell or Command Prompt.
2. Clone or extract the project folder:
   ```cmd
   cd bloodconnect
   ```
3. Install dependencies:
   ```cmd
   npm install
   ```
4. Copy the environment file:
   ```cmd
   copy .env.example .env
   ```
5. Start the development server (runs both Vite frontend and Express API on port 3000):
   ```cmd
   npm run dev
   ```
6. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Production Build & Server
To build the optimized production client and run the standalone Node.js server:
```cmd
npm run build
npm start
```

---

## 4. Connecting MongoDB (Local or MongoDB Atlas)

By default, BloodConnect uses its disk-persisted database engine in `data/bloodconnect_db.json`. To connect to a live MongoDB instance:

### Option A: MongoDB Atlas (Cloud)
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free M0 cluster.
2. Create a database user and whitelist your IP (`0.0.0.0/0` for cloud deployment).
3. Obtain your connection string:
   ```env
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/bloodconnect?retryWrites=true&w=majority"
   ```
4. Add this URI to your `.env` file.

### Option B: Local MongoDB
1. Ensure the MongoDB service is running on your machine:
   ```cmd
   net start MongoDB
   ```
2. Set `MONGODB_URI` in `.env`:
   ```env
   MONGODB_URI="mongodb://localhost:27017/bloodconnect"
   ```

---

## 5. Pre-configured Demo Accounts

For fast testing and presentations, one-click demo logins are available on the Sign In page:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@bloodconnect.org` | `admin123` | Full access to Admin Portal, donor moderation & request status |
| **Donor** | `rahul.sharma@example.com` | `donor123` | Registered O+ donor in Mumbai with 4 donations & digital card |
| **Requester** | `priya.verma@example.com` | `request123` | Hospital seeker profile |

---

## 6. REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token |
| `GET` | `/api/auth/me` | Fetch active user session |
| `POST` | `/api/donors/register` | Register new voluntary donor |
| `GET` | `/api/donors/search` | Search donors by blood group, city, PIN, and availability |
| `GET` | `/api/donors/:id` | Retrieve donor profile by ID |
| `PUT` | `/api/donors/:id` | Update donor profile & availability |
| `DELETE`| `/api/donors/:id` | Delete donor profile (admin) |
| `POST` | `/api/requests` | Post emergency blood request |
| `GET` | `/api/requests` | List blood requests with filter params |
| `PUT` | `/api/requests/:id/status`| Update status (`pending`, `in_progress`, `fulfilled`) |
| `DELETE`| `/api/requests/:id` | Remove blood request record |
| `GET` | `/api/stats` | Aggregate platform statistics and blood group inventory |
| `POST` | `/api/contact/request` | Secure donor contact inquiry authorization |

---

## 7. Testing Instructions

1. **Verify Donor Search**:
   - Go to "Find a Donor".
   - Select `O-` or `A+`.
   - Enter `Mumbai` or `Delhi`.
   - Observe matching cards with availability badges.
   - Click "Contact Donor" and enter a test attendant name and phone to unlock direct contact.

2. **Verify Donor Registration**:
   - Go to "Become a Donor".
   - Fill in full name, age (e.g. 26), blood group (`B+`), city, and weight (60kg).
   - Check the health declarations and submit.
   - Observe immediate confirmation with generated Donor ID.
   - Re-check "Find a Donor" or "Admin Portal" to confirm your new donor is stored in the database.

3. **Verify Blood Request & Status**:
   - Go to "Request Blood".
   - Select Critical Emergency, blood group `AB-`, units `2`, hospital `City Hospital`, city `Pune`.
   - Submit the request and verify matched donor count.
   - Switch to the "Live Requests Feed" tab and toggle status to `In Progress` or `Fulfilled`.

---

## 8. Official Medical & Legal Disclaimer

BloodConnect connects potential voluntary donors with requesters during emergencies. BloodConnect **does not** provide medical advice, diagnosis, or guarantee donor medical eligibility or cross-match compatibility. All blood grouping, infectious disease screening (HIV, Hepatitis, Syphilis), compatibility testing, and transfusions must be executed exclusively by certified blood transfusion facilities and licensed medical practitioners.
