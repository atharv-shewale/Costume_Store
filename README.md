# 🪔 Moti Atya Costume Corner – Online Store & Rental Platform

A modern, high-performance Indian costume rental web application built with **Next.js 16**, **React 19**, **Tailwind CSS 4**, and **Turbopack**.

---

## 🌟 Features

- **Rich Cultural Catalogue:** Extensive collection of authentic Indian festive and mythological costumes (Navratri & Garba, Ramayan / Mahabharat, Historical Kings & Warriors, Regional Folk Outfits, Halloween, Kids Fancy Dress).
- **Date-Locking & Double-Booking Prevention:** Real-time date availability checking disables previously booked dates on calendar pickers, preventing double-booking conflicts with server-side validation.
- **Govt ID Verification & Rental Agreement:** Customers select ID proof type (Aadhaar, Driving License, Voter ID, Passport), preview/upload ID image, and accept legally-compliant rental terms.
- **Counter QR Pickup & Return Passes:** Generates high-res QR passes upon booking completion with printable slip for instant store counter scanning and verification.
- **Return Inspection & Deposit Reconciliation:** Built-in condition inspector in Admin panel (Perfect, Minor Wear, Damaged, Late Return) with automated deduction adjustment and net refund tracking.
- **Supabase Cloud Database Sync:** Seamless dual-layer persistence (Supabase PostgreSQL in cloud with zero-crash fallback to local JSON storage for offline/standalone execution).
- **Hidden & Secure Admin Portal (`/admin`):**
  - Dedicated separate link accessible only directly at `/admin` (completely hidden from customer-facing navigation).
  - **Security Passcode Protection:** Access is locked behind a security gate requiring the store master passcode.
  - **Remember Device Function:** Option to remember authorized devices for 30 days without re-authenticating every visit.
  - **OTP Password Reset (SMS to `+91 99301 92705`):** Passcode can be reset or changed anytime via a 6-digit OTP routed exclusively to the store admin's phone number (`99301 92705`).
  - **Instant 1-Click Logout:** Secure session revocation anytime directly from the admin console top bar.
- **SMS & Return Reminders:** Automated return reminder dispatch via SMS (Fast2SMS / Twilio / Live Simulator) and 1-click WhatsApp customer chat.
- **Direct WhatsApp & Online Enquiries:** Integrated WhatsApp click-to-chat with pre-filled costume and booking details.

---

## 🗄️ Supabase Cloud Database Setup (Optional & Recommended for Vercel)

The system works out-of-the-box with local storage, but for permanent cloud persistence across Vercel deployments:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in Supabase and run the SQL script located in [`supabase/schema.sql`](./supabase/schema.sql).
3. Copy your **Project URL** and **Service Role API Key** from `Settings > API`.
4. In your `.env.local` (or Vercel Environment Variables), add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   ```
5. Reload the Admin panel (`/admin`) — a green badge will confirm `Supabase Connected (Live Cloud Sync)`.

---

## 🔐 Admin Access & Credentials

- **Direct Admin URL:** `http://localhost:3000/admin` (or `/admin` on production)
- **Initial Master Passcode:** `MotiAtya@2026` *(can be changed anytime via OTP)*
- **Registered Admin Mobile:** `+91 99301 92705`

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront, or [http://localhost:3000/admin](http://localhost:3000/admin) to access the Admin Control Panel.

### 3. Production Build
```bash
npm run build
npm start
```
