"use client";

import { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  ShieldCheck,
  Smartphone,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

interface AdminSecurityGateProps {
  onAuthenticated: () => void;
}

export default function AdminSecurityGate({ onAuthenticated }: AdminSecurityGateProps) {
  // View states: "login" | "forgot"
  const [view, setView] = useState<"login" | "forgot">("login");

  // Login form state
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Forgot password / OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [showNewPasscode, setShowNewPasscode] = useState(false);
  const [otpPreview, setOtpPreview] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMsg("Please enter your admin security passcode.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: passcode.trim(),
          rememberDevice,
          deviceName: navigator.userAgent.slice(0, 40),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) {
          localStorage.setItem("admin_device_token", data.token);
        }
        setSuccessMsg("Security verified! Unlocking dashboard...");
        setTimeout(() => {
          onAuthenticated();
        }, 600);
      } else {
        setErrorMsg(data.message || "Invalid security passcode. Please try again.");
      }
    } catch {
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/auth/otp/send", {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setOtpSent(true);
        setResendTimer(45);
        if (data.otpPreview) {
          setOtpPreview(data.otpPreview);
        }
        setSuccessMsg(`OTP sent to registered number: +91 99301 92705`);
      } else {
        setErrorMsg(data.message || "Failed to dispatch OTP SMS.");
      }
    } catch {
      setErrorMsg("Failed to connect to OTP service.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMsg("Please enter the 6-digit OTP code.");
      return;
    }
    if (!newPasscode || newPasscode.length < 4) {
      setErrorMsg("New passcode must be at least 4 characters.");
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setErrorMsg("Passcodes do not match.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/auth/otp/verify-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp: otpCode.trim(),
          newPasscode: newPasscode.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Passcode updated successfully! You can now log in with your new passcode.");
        setPasscode(newPasscode);
        setTimeout(() => {
          setView("login");
          setOtpSent(false);
          setOtpCode("");
          setNewPasscode("");
          setConfirmPasscode("");
          setOtpPreview(null);
        }, 1200);
      } else {
        setErrorMsg(data.message || "OTP verification failed.");
      }
    } catch {
      setErrorMsg("Failed to reset passcode.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c080d] via-[#2a0e14] to-[#140609] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#240d12]/90 backdrop-blur-xl border border-amber-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 relative z-10 text-white">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-600/30 border border-amber-500/40 mb-3 shadow-lg shadow-amber-950/40">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-amber-300 tracking-wide flex items-center justify-center gap-2">
            <span>Moti Atya</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
              STAFF ONLY
            </span>
          </h1>
          <p className="text-xs text-amber-200/70 mt-1">
            Restricted Admin Control Panel • Secure Verification
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/50 flex items-start gap-2.5 text-red-200 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-start gap-2.5 text-emerald-200 text-xs">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Simulation / Dev OTP Banner */}
        {otpPreview && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/80 border border-amber-400/60 text-amber-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>SMS OTP sent to 99301 92705: <strong className="text-white text-sm tracking-widest">{otpPreview}</strong></span>
            </div>
            <button
              type="button"
              onClick={() => setOtpCode(otpPreview)}
              className="text-[11px] underline text-amber-300 hover:text-white font-medium cursor-pointer"
            >
              Fill Code
            </button>
          </div>
        )}

        {/* VIEW 1: LOGIN FORM */}
        {view === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-amber-200/90 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Security Passcode / Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full bg-[#17070a] border border-amber-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-300 transition-colors p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Device Checkbox */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded border-amber-500/40 bg-[#17070a] text-amber-500 focus:ring-amber-400 focus:ring-offset-0 accent-amber-500 cursor-pointer"
                />
                <span>Remember this device (30 days)</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setView("forgot");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
              >
                Forgot passcode?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 hover:from-amber-400 hover:to-red-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-950/50 hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Passcode...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Unlock Admin Dashboard</span>
                </>
              )}
            </button>

            {/* Registered admin phone note */}
            <div className="pt-4 border-t border-white/10 text-center">
              <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Authorized Store Mobile: <strong>+91 99301 92705</strong></span>
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                Default Master Key: <code className="text-amber-400 font-mono">MotiAtya@2026</code>
              </p>
            </div>
          </form>
        )}

        {/* VIEW 2: FORGOT PASSWORD / RESET VIA OTP */}
        {view === "forgot" && (
          <div className="space-y-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200">
              <p className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" />
                <span>OTP Reset Verification</span>
              </p>
              <p>
                An OTP verification code will be sent to the registered admin phone number:{" "}
                <strong className="text-white">+91 99301 92705</strong>.
              </p>
            </div>

            {!otpSent ? (
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending OTP SMS...</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>Send OTP to 99301 92705</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="w-full text-center text-xs text-gray-400 hover:text-white pt-2 cursor-pointer"
                >
                  ← Back to Passcode Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleVerifyReset} className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-amber-200/90 mb-1">
                    6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full text-center tracking-widest text-lg font-mono font-bold bg-[#17070a] border border-amber-500/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    autoFocus
                  />
                  <div className="flex justify-between items-center text-[11px] text-gray-400 mt-1">
                    <span>Sent to +91 99301 92705</span>
                    {resendTimer > 0 ? (
                      <span className="text-gray-500">Resend in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200/90 mb-1">
                    New Security Passcode
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPasscode ? "text" : "password"}
                      value={newPasscode}
                      onChange={(e) => setNewPasscode(e.target.value)}
                      placeholder="Min. 4 characters"
                      className="w-full bg-[#17070a] border border-amber-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPasscode(!showNewPasscode)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-300 p-1"
                    >
                      {showNewPasscode ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200/90 mb-1">
                    Confirm New Passcode
                  </label>
                  <input
                    type="password"
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    placeholder="Repeat new passcode"
                    className="w-full bg-[#17070a] border border-amber-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm mt-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Updating Passcode...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Verify OTP & Save New Passcode</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="w-full text-center text-xs text-gray-400 hover:text-white pt-1 cursor-pointer"
                >
                  Cancel and Return to Login
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
