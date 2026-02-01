"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
export default function LoginPage() {
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const khakiPrimary = "#D4B483";
  const khakiDark = "#B5985C";
  const navyDark = "#0f172a";
  const navyLight = "#1e293b";

  const handleLogin = async () => {
    if (!officerId.trim() || !password.trim()) {
      setError("Please enter both Officer ID and Password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        officerId,
        password,
        callbackUrl: "/",
        redirect: true,
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-gray-900 to-gray-800">
      {/* LEFT SECTION (Desktop only) */}
      <div className="hidden md:flex flex-col justify-center px-16 text-white">
        <div className="max-w-xl">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4 mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-khakiPrimary/20 to-khakiDark/20 blur-sm rounded-full"></div>
              <Image
                src="/jhpolice.png"
                alt="Jharkhand Police Logo"
                width={64} // Matches your h-16 (16 * 4px)
                height={64} // Matches your w-16
                priority // Ensures it loads immediately as it's above the fold
                className="relative z-10 drop-shadow-lg"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold leading-tight">
                Digital e-Malkhana System
              </h1>
              <p className="text-lg mt-2" style={{ color: khakiPrimary }}>
                Secure Evidence & Property Management Platform
              </p>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4 mt-8">
            {[
              {  text: "Case registration & tracking" },
              {  text: "Property seizure management" },
              {  text: "Chain of custody logs" },
              {  text: "QR based evidence tracking" },
              {  text: "Secure disposal records" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 group">
                
                <span className="text-gray-200 text-sm">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-400 mt-1">Access</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-400 mt-1">Secure</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">A+</div>
                <div className="text-sm text-gray-400 mt-1">Audit</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              Government of India • Police Department
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION (Login Card) */}
      <div className="flex items-center justify-center px-4 md:px-6 py-8 md:py-0">
        <div className="bg-white/10 backdrop-blur-sm w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* Login Card Header */}
          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              {/* Mobile Logo */}
              <div className="md:hidden mb-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-khakiPrimary/20 to-khakiDark/20 blur-sm rounded-full"></div>
                    <img
                      src="/jhpolice.png"
                      alt="Police Logo"
                      className="h-14 w-14 relative z-10 drop-shadow-lg mx-auto"
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mt-3">
                  e-Malkhana
                </h2>
                <p className="text-gray-300 text-sm">Jharkhand Police</p>
              </div>

              {/* Desktop Logo */}
              <div className="hidden md:block">
                <h2 className="text-2xl font-bold text-white">Officer Login</h2>
                <p className="text-gray-300 text-sm mt-2">
                  Enter your credentials to access the system
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border-l-4 border-red-500 rounded">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <div className="space-y-6">
              {/* Officer ID Field */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Officer ID
                </label>
                <div className="relative">
                  <input
                    placeholder="Enter your Officer ID"
                    className="w-full px-4 py-3.5 pl-11 rounded-xl border border-white/20 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:border-khakiPrimary focus:ring-1 focus:ring-khakiPrimary transition-colors"
                    value={officerId}
                    onChange={(e) => {
                      setOfficerId(e.target.value);
                      setError("");
                    }}
                    onKeyPress={handleKeyPress}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3.5 pl-11 rounded-xl border border-white/20 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:border-khakiPrimary focus:ring-1 focus:ring-khakiPrimary transition-colors"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    onKeyPress={handleKeyPress}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                style={{
                  background: `linear-gradient(135deg, ${khakiDark} 0%, ${khakiPrimary} 100%)`,
                  color: navyDark,
                }}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                <div className="flex items-center justify-center gap-2 relative z-10">
                  {loading ? (
                    <>
                      <div
                        className="animate-spin rounded-full h-5 w-5 border-b-2"
                        style={{ borderColor: navyDark }}
                      ></div>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Login to Dashboard</span>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Security Note */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>
                  Secure login with end-to-end encryption. All actions are
                  logged.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} e-Malkhana • Jharkhand Police
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Version 2.1.0 • For official use only
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
