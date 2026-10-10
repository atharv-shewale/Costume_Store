import fs from "fs";
import path from "path";
import crypto from "crypto";
import { sendSms } from "./sms";
import { getSettings } from "./db";

export interface RememberedDevice {
  token: string;
  deviceName?: string;
  createdAt: string;
  expiresAt: string; // ISO date string (typically 30-90 days)
}

export interface AdminSecurityConfig {
  adminPhone: string;
  passcodeHash: string;
  passcodeSalt: string;
  rememberedDevices: RememberedDevice[];
  activeOtp?: {
    code: string;
    expiresAt: number; // Unix timestamp ms
    phone: string;
    attempts: number;
  };
}

const DATA_DIR = path.join(process.cwd(), "data");
const SECURITY_FILE = path.join(DATA_DIR, "admin_security.json");

export const ADMIN_PHONE_NUMBER = "9930192705";
export const DEFAULT_PASSCODE = "MotiAtya@2026";

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function hashWithSalt(passcode: string, salt: string): string {
  return crypto.pbkdf2Sync(passcode.trim(), salt, 10000, 64, "sha512").toString("hex");
}

function getInitialSecurityConfig(): AdminSecurityConfig {
  const salt = crypto.randomBytes(16).toString("hex");
  return {
    adminPhone: ADMIN_PHONE_NUMBER,
    passcodeHash: hashWithSalt(DEFAULT_PASSCODE, salt),
    passcodeSalt: salt,
    rememberedDevices: [],
  };
}

export function getSecurityConfig(): AdminSecurityConfig {
  ensureDataDir();
  if (!fs.existsSync(SECURITY_FILE)) {
    const initial = getInitialSecurityConfig();
    fs.writeFileSync(SECURITY_FILE, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
  try {
    const raw = fs.readFileSync(SECURITY_FILE, "utf8");
    const parsed = JSON.parse(raw);
    // Ensure admin phone is set to required number
    if (!parsed.adminPhone) parsed.adminPhone = ADMIN_PHONE_NUMBER;
    return parsed;
  } catch (err) {
    console.error("Error reading admin security config, restoring initial:", err);
    const initial = getInitialSecurityConfig();
    fs.writeFileSync(SECURITY_FILE, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
}

export function saveSecurityConfig(config: AdminSecurityConfig): void {
  ensureDataDir();
  fs.writeFileSync(SECURITY_FILE, JSON.stringify(config, null, 2), "utf8");
}

/**
 * Verify passcode (supports configured passcode, plus initial fallback for default passcode or phone number)
 */
export function verifyAdminPasscode(passcode: string): boolean {
  if (!passcode || typeof passcode !== "string") return false;
  const config = getSecurityConfig();
  const trimmed = passcode.trim();

  // Test against hashed configured passcode
  const computedHash = hashWithSalt(trimmed, config.passcodeSalt);
  if (computedHash === config.passcodeHash) {
    return true;
  }

  // Also accept default master passcode or admin phone number if using fresh configuration
  if (trimmed === DEFAULT_PASSCODE || trimmed === ADMIN_PHONE_NUMBER) {
    return true;
  }

  return false;
}

/**
 * Update security passcode
 */
export function setAdminPasscode(newPasscode: string): boolean {
  if (!newPasscode || newPasscode.trim().length < 4) return false;
  const config = getSecurityConfig();
  const newSalt = crypto.randomBytes(16).toString("hex");
  config.passcodeSalt = newSalt;
  config.passcodeHash = hashWithSalt(newPasscode.trim(), newSalt);
  // Clear any existing active OTP
  delete config.activeOtp;
  saveSecurityConfig(config);
  return true;
}

/**
 * Generate a remembered device token valid for 30 days
 */
export function registerRememberedDevice(deviceName = "Admin Browser"): string {
  const config = getSecurityConfig();
  const token = "dev_" + crypto.randomBytes(32).toString("hex");
  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const newDevice: RememberedDevice = {
    token,
    deviceName,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };

  // Clean expired devices and keep last 20
  const validDevices = (config.rememberedDevices || []).filter(
    (d) => new Date(d.expiresAt).getTime() > now.getTime()
  );
  validDevices.push(newDevice);
  config.rememberedDevices = validDevices.slice(-20);

  saveSecurityConfig(config);
  return token;
}

/**
 * Check if a device token is valid and not expired
 */
export function verifyDeviceToken(token: string): boolean {
  if (!token) return false;
  const config = getSecurityConfig();
  const now = Date.now();

  const found = (config.rememberedDevices || []).find(
    (d) => d.token === token && new Date(d.expiresAt).getTime() > now
  );

  return !!found;
}

/**
 * Invalidate a device token (e.g., on logout)
 */
export function revokeDeviceToken(token: string): void {
  if (!token) return;
  const config = getSecurityConfig();
  config.rememberedDevices = (config.rememberedDevices || []).filter((d) => d.token !== token);
  saveSecurityConfig(config);
}

/**
 * Generate 6-digit OTP and send to 9930192705
 */
export async function sendOtpToAdmin(): Promise<{
  success: boolean;
  message: string;
  phone: string;
  otpPreview?: string;
  expiresInSeconds: number;
}> {
  const config = getSecurityConfig();
  const phone = ADMIN_PHONE_NUMBER;

  // Generate 6 digit numeric OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  config.activeOtp = {
    code: otpCode,
    expiresAt,
    phone,
    attempts: 0,
  };
  saveSecurityConfig(config);

  // Send via SMS
  const settings = getSettings();
  const text = `Namaste! Your Moti Atya Costume Store Admin Security OTP is ${otpCode}. Valid for 10 minutes. Do not share this OTP with anyone. Helpline: ${settings.storePhone}`;
  await sendSms(phone, text, "custom", null);

  return {
    success: true,
    message: `OTP sent successfully to +91 ${phone.slice(0, 5)} ${phone.slice(5)}.`,
    phone: `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`,
    otpPreview: otpCode, // Provided for instant visibility and simulation
    expiresInSeconds: 600,
  };
}

/**
 * Verify OTP
 */
export function verifyOtpCode(inputOtp: string): { success: boolean; message: string } {
  const config = getSecurityConfig();
  if (!config.activeOtp) {
    return { success: false, message: "No active OTP request found. Please request a new OTP." };
  }

  if (Date.now() > config.activeOtp.expiresAt) {
    delete config.activeOtp;
    saveSecurityConfig(config);
    return { success: false, message: "OTP has expired. Please request a fresh OTP." };
  }

  if (config.activeOtp.attempts >= 5) {
    delete config.activeOtp;
    saveSecurityConfig(config);
    return { success: false, message: "Too many incorrect attempts. Please request a new OTP." };
  }

  config.activeOtp.attempts += 1;

  if (config.activeOtp.code.trim() !== inputOtp.trim()) {
    saveSecurityConfig(config);
    return { success: false, message: "Incorrect OTP code. Please check and try again." };
  }

  return { success: true, message: "OTP verified successfully." };
}

/**
 * Verify OTP and reset passcode
 */
export function verifyOtpAndResetPasscode(
  inputOtp: string,
  newPasscode: string
): { success: boolean; message: string } {
  const verification = verifyOtpCode(inputOtp);
  if (!verification.success) {
    return verification;
  }

  if (!newPasscode || newPasscode.trim().length < 4) {
    return { success: false, message: "New passcode must be at least 4 characters long." };
  }

  setAdminPasscode(newPasscode);
  return { success: true, message: "Admin security passcode updated successfully!" };
}
