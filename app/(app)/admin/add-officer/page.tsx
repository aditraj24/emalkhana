"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddOfficerPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    officerId: "",
    password: "",
    policeStation: "",
    role: "OFFICER",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  const khakiPrimary = "#D4B483";
  const khakiDark = "#B5985C";
  const navyDark = "#0f172a";
  const navyLight = "#1e293b";
  const khakiLight = "#E6D5B8";
  const submit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/user/add-officer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessageType("error");
        setMessage(data.error || "Failed to add officer");
        return;
      }

      setMessageType("success");
      setMessage("✅ Officer added successfully");

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      setMessageType("error");
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div
            className="px-6 py-8 text-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${navyLight} 0%, ${navyDark} 100%)`,
            }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-khakiPrimary/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-khakiDark/10 to-transparent rounded-full translate-y-16 -translate-x-16"></div>

            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border-4 border-white/20 bg-white/10 backdrop-blur-sm">
                <svg
                  className="w-8 h-8"
                  style={{ color: khakiLight }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Add New Officer
              </h1>
              <p className="text-gray-300 text-sm">
                Register a new officer to the e-Malkhana system
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8">
            <div className="space-y-5">
              {/* Officer Name */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  placeholder="Enter officer's full name"
                  className="
                    w-full px-4 py-3 rounded-xl border border-gray-300 
                    focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all duration-200
                    placeholder-gray-400
                    focus:border-transparent
                    hover:border-gray-400
                  "
                  style={{
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                    // focusRingColor: khakiPrimary,
                  }}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Officer ID */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Officer ID
                </label>
                <input
                  placeholder="Enter unique officer ID"
                  className="
                    w-full px-4 py-3 rounded-xl border border-gray-300 
                    focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all duration-200
                    placeholder-gray-400
                    focus:border-transparent
                    hover:border-gray-400
                  "
                  style={{
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  }}
                  value={form.officerId}
                  onChange={(e) =>
                    setForm({ ...form, officerId: e.target.value })
                  }
                />
              </div>

              {/* Password */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Set secure password"
                  className="
                    w-full px-4 py-3 rounded-xl border border-gray-300 
                    focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all duration-200
                    placeholder-gray-400
                    focus:border-transparent
                    hover:border-gray-400
                  "
                  style={{
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  }}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              {/* Police Station */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Police Station
                </label>
                <input
                  placeholder="Enter police station name"
                  className="
                    w-full px-4 py-3 rounded-xl border border-gray-300 
                    focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all duration-200
                    placeholder-gray-400
                    focus:border-transparent
                    hover:border-gray-400
                  "
                  style={{
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  }}
                  value={form.policeStation}
                  onChange={(e) =>
                    setForm({ ...form, policeStation: e.target.value })
                  }
                />
              </div>

              {/* Role */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="relative">
                  <select
                    className="
                      w-full px-4 py-3 rounded-xl border border-gray-300 
                      focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all duration-200
                      appearance-none cursor-pointer
                      focus:border-transparent
                      hover:border-gray-400
                    "
                    style={{
                      background:
                        "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                    }}
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="OFFICER">Officer</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {form.role === "ADMIN"
                    ? "Administrators have full system access and can manage other officers."
                    : "Officers have standard access to case and property management."}
                </p>
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`
                  p-4 rounded-xl border text-sm font-medium transition-all duration-300
                  ${
                    messageType === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }
                `}
                >
                  <div className="flex items-center gap-2">
                    {messageType === "success" ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {message}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={submit}
                disabled={loading}
                className="
                  w-full mt-2 py-3.5 rounded-xl
                  text-base font-semibold tracking-wide
                  transition-all duration-300
                  group overflow-hidden relative
                  disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-md hover:shadow-lg
                "
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
                      <span>Adding Officer...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 transition-transform group-hover:scale-110 duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span>Add Officer</span>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Form Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                All fields are required. Officer will receive credentials
                immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-left">
              <p className="text-sm font-medium text-blue-800">Security Note</p>
              <p className="text-xs text-blue-600 mt-1">
                Officer credentials are encrypted and stored securely. Ensure
                strong passwords and share credentials through secure channels
                only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
