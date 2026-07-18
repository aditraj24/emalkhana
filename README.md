# 🏛️ Digital e-Malkhana System

A **secure, role-based digital evidence & property management platform** for police departments to manage seized properties, track chain of custody, generate QR codes, and maintain complete audit logs — built using **Next.js App Router + MongoDB + NextAuth**.

---one change--


deployed link: "https://jh-emalkhana.vercel.app"
 
TO LOGIN AS ADMIN USE:-  id : ADM001
                         pass : 123456

TO LOGIN AS OFFICER USE:-  id : OFF001
                         pass : 123456

ONLY ADMIN CAN ADD OTHER ADMIN OR OFFICER

REPORT PDG GENERATION
QR CODE FOR PROPERTIES IN CUSODY
LOG FOR UPDATE ON CUSTODY OF PROPERTIES
SEARCH CASE
ADD NEW CASE
DISPOSE CASE AND PROPERTIES
TECH STACK USED:
    NEXTJS 15.0.0 (APP ROUTER)
    REACT 18.0.0
    AUTHJS
    NEXT API
    VERCEL CRON
    QR CODE
    TAILWIND CSS
    MONGODB
    MONGOOSE



## 🚔 Project Overview

The **Digital e-Malkhana System** replaces manual registers with a secure digital system to:

- Register criminal cases
- Record seized properties
- Track custody movement
- Generate QR-based evidence tracking
- Dispose properties with audit logs
- Notify officers about pending cases
- Maintain transparency & accountability

---

## ⚙️ Tech Stack

### Frontend
- **Next.js 15 (App Router)**
- **React 18**
- **Tailwind CSS**
- **TypeScript**
- Responsive UI (Mobile + Desktop)
- Modern Police Dashboard UI

### Backend
- **Next.js API Routes**
- **MongoDB Atlas**
- **Mongoose ODM**
- **NextAuth (JWT based auth)**
- **Cloudinary (image upload)**
- **QR Code generation**

### Deployment
- **Vercel (Frontend + Backend)**
- **MongoDB Atlas (Database)**

---

## 👮 Roles & Permissions

### 🟢 ADMIN
- Create cases
- View all cases
- View all properties
- Dispose properties
- View custody logs
- View audit logs
- Receive pending case alerts
- Manage officers (optional)

### 🔵 OFFICER
- Create cases
- Add seized properties
- View assigned cases
- View properties
- Add custody movements
- Generate & print QR codes
- Dispose property (if authorized)
- Receive alerts

> 🔐 Access is enforced using **NextAuth JWT + middleware protection**

---

## 🔐 Authentication Logic

- Login using **Officer ID + Password**
- Passwords are **bcrypt hashed**
- Session stored in **JWT**
- Role & officerId embedded in token
- All routes protected by middleware
- Unauthorized users redirected to `/login`

---

## 🧩 Core Modules

### 📁 Case Management
- Create criminal cases
- Auto-assign investigating officer
- Search & filter cases
- Mark case as DISPOSED when all properties are disposed

---

### 📦 Property Management
- Add seized properties to cases
- Store image + description
- Generate QR code for each property
- View property details page
- Track status (IN_CUSTODY / DISPOSED)

---

### 🔁 Chain of Custody
- Record every property movement
- From → To location
- Purpose + remarks
- Full timeline view
- Immutable history

---

### 🗑️ Property Disposal
- Dispose property with reason
- Court order reference
- Auto updates case status
- Full audit log created

---

### 🔔 Alerts & Notifications
- Cron-based pending case detection
- Alerts for long pending cases
- Notifications visible on dashboard
- Admin + Officer both notified

---

### 📜 Audit Logs
- Every critical action is logged:
  - Case created
  - Property added
  - Custody moved
  - Property disposed
- Maintains full accountability

---

## 🧾 QR Code System

- Each property gets a unique QR
- QR links to property detail page
- Can be printed & pasted on evidence
- QR scan → instant verification

---

## 📂 Folder Structure (Important)
emalkhana/
│
├── .next/                     # Next.js build output (auto-generated)
│
├── app/                       # App Router (Next.js 13+)
│   │
│   ├── (app)/                 # Protected application routes
│   │   │
│   │   ├── admin/             # Admin dashboard & management
│   │   ├── cases/             # Case listing, details & management
│   │   ├── custody/           # Chain of custody module
│   │   ├── property/          # Seized property management
│   │   ├── search/            # Global search (cases, properties)
│   │   │
│   │   ├── layout.tsx         # Auth-protected layout (navbar, sidebar)
│   │   └── page.tsx           # Dashboard home
│   │
│   ├── (auth)/                # Public authentication routes
│   │   └── login/             # Login page (officer login)
│   │
│   ├── api/                   # Backend API routes
│   │   │
│   │   ├── auth/              # NextAuth endpoints
│   │   ├── case/              # Case CRUD APIs
│   │   ├── custody/           # Custody log APIs
│   │   ├── property/          # Property CRUD + QR APIs
│   │   ├── disposal/          # Property disposal APIs
│   │   ├── notifications/     # Alerts & notification APIs
│   │   ├── reports/           # Report generation APIs
│   │   └── cron/              # Scheduled tasks (pending cases alerts)
│   │
│   └── layout.tsx             # Root layout (providers, theme)
│
├── components/                # Reusable UI components
│   ├── common/                # Buttons, modals, cards, inputs
│   ├── case/                  # Case related components
│   ├── custody/               # Custody timeline, forms
│   ├── property/              # Property cards, QR preview
│   ├── dashboard/             # Metrics, alerts, charts
│   └── navbar/                # Navbar, sidebar, user menu
│
├── lib/                       # Core utilities
│   ├── db.ts                  # MongoDB connection
│   ├── auth.ts                # NextAuth configuration
│   └── cloudinary.ts          # Cloudinary setup
│
├── models/                    # Mongoose models
│   ├── User.ts                # User / Officer model
│   ├── Case.ts                # Case model
│   ├── Property.ts            # Property model
│   ├── Custody.ts             # Custody log model
│   ├── Disposal.ts            # Disposal model
│   ├── AuditLog.ts            # Audit log model
│   └── Notification.ts        # Alerts model
│
├── services/                  # Business logic layer
│   ├── pendingCaseAlert.service.ts
│   ├── report.service.ts
│   └── audit.service.ts
│
├── utils/                     # Helper utilities
│   ├── generateCaseReport.ts  # PDF / report generator
│   ├── qr.ts                  # QR code helper
│   └── constants.ts
│
├── types/                     # Global TypeScript types
│   ├── case.ts
│   ├── property.ts
│   └── user.ts
│
├── styles/                    # Global styles
│   └── globals.css
│
├── public/                    # Static assets
│   ├── jhpolice.png
│   └── logos/
│
├── .env.local                 # Environment variables
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
└── package-lock.json


---

## 🛠️ Setup Instructions

### 1️⃣ Clone repository
```bash
git clone https://github.com/yourusername/emalkhana.git
cd emalkhana
npm install

Create .env.local
MONGO_URI=mongodb+srv://...
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

NEXT_PUBLIC_SITE_URL=http://localhost:3000

Whitelist all IPs for development:

0.0.0.0/0

Run locally
npm run dev


Open:

http://localhost:3000

Screens & Features

✔ Dashboard metrics
✔ Secure login
✔ QR code evidence
✔ Case details page
✔ Property detail page
✔ Custody timeline
✔ Disposal module
✔ Alerts panel

Security Features

JWT authentication

Role-based access control

Protected API routes

Password hashing (bcrypt)

Audit logging

Immutable custody history

Secure image uploads

MongoDB indexing


Use Case Flow

Officer logs in

Creates a case

Adds seized properties

QR generated for each item

Property moved → custody logs added

Property disposed

Case auto-marked disposed

Alerts generated for delays

Admin audits activity

Project Use

This system is ideal for:

Police departments

Evidence rooms

Malkhana digitization

Academic final year project

Govt. tech demo

📜 License

This project is built for academic & demonstration purposes.

👨‍💻 Author

Aditya Raj
B.Tech CSE Student
NIT Jamshedpur
Digital e-Malkhana System
2026
