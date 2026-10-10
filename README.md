# 🪔 Moti Atya Costume Corner – Online Store & Rental Platform

A modern, high-performance Indian costume rental web application built with **Next.js 16**, **React 19**, **Tailwind CSS 4**, and **Turbopack**.

---

## 🌟 Features

- **Rich Cultural Catalogue:** Extensive collection of authentic Indian festive and mythological costumes (Navratri & Garba, Ramayan / Mahabharat, Historical Kings & Warriors, Regional Folk Outfits, Halloween, Kids Fancy Dress).
- **Booking & Security Deposits:** Transparent rental fees with automated security deposit tracking and refunds upon return.
- **Hidden & Secure Admin Portal (`/admin`):**
  - Dedicated separate link accessible only directly at `/admin` (completely hidden from customer-facing navigation).
  - **Security Passcode Protection:** Access is locked behind a security gate requiring the store master passcode.
  - **Remember Device Function:** Option to remember authorized devices for 30 days without re-authenticating every visit.
  - **OTP Password Reset (SMS to `+91 99301 92705`):** Passcode can be reset or changed anytime via a 6-digit OTP routed exclusively to the store admin's phone number (`99301 92705`).
  - **Instant 1-Click Logout:** Secure session revocation anytime directly from the admin console top bar.
- **SMS & Return Reminders:** Automated return reminder dispatch via SMS (Fast2SMS / Twilio / Live Simulator) and 1-click WhatsApp customer chat.
- **Direct WhatsApp & Online Enquiries:** Integrated WhatsApp click-to-chat with pre-filled costume and booking details.

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
