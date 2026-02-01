"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import QRPreview from "@/components/property/QRPreview";

type Property = {
  category: string;
  belongsTo: string;
  nature: string;
  quantity: string;
  location: string;
  description: string;
  imageBase64?: string;
  qrCode?: string;
};

export default function CaseForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const khakiPrimary = "#D4B483";
  const khakiDark = "#B5985C";
  const navyDark = "#0f172a";
  const navyLight = "#1e293b";

  const [caseData, setCaseData] = useState({
    policeStation: "",
    crimeNumber: "",
    year: new Date().getFullYear().toString(),
    firDate: "",
    seizureDate: "",
    actLaw: "",
    sections: "",
    investigatingOfficerId: ""
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [currentProperty, setCurrentProperty] = useState<Property>({
    category: "",
    belongsTo: "ACCUSED",
    nature: "",
    quantity: "",
    location: "",
    description: ""
  });

  // Auto-fill officerId from session
  useEffect(() => {
    if (session?.user?.officerId) {
      setCaseData((prev) => ({
        ...prev,
        investigatingOfficerId: session.user.officerId
      }));
    }
  }, [session]);

  const next = () => {
    setFormErrors([]);
    setStep((s) => s + 1);
  };

  const prev = () => {
    setFormErrors([]);
    setStep((s) => s - 1);
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors(["File size should be less than 5MB"]);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setFormErrors(["Please select an image file"]);
      return;
    }

    setSelectedFile(file);
    
    try {
      const base64 = await toBase64(file);
      setCurrentProperty({
        ...currentProperty,
        imageBase64: base64
      });
    } catch (error) {
      setFormErrors(["Failed to process image"]);
    }
  };

  // Clear selected image
  const clearImage = () => {
    setSelectedFile(null);
    setCurrentProperty({
      ...currentProperty,
      imageBase64: undefined
    });
  };

  // ================= CREATE CASE =================
  const createCase = async () => {
    setLoading(true);
    setFormErrors([]);

    const errors: string[] = [];
    if (!caseData.crimeNumber) errors.push("Crime number is required");
    if (!caseData.policeStation) errors.push("Police station is required");
    if (!caseData.year) errors.push("Year is required");
    if (!caseData.firDate) errors.push("FIR date is required");

    if (errors.length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policeStation: caseData.policeStation,
          crimeNumber: caseData.crimeNumber,
          year: Number(caseData.year),
          firDate: caseData.firDate,
          seizureDate: caseData.seizureDate || undefined,
          actLaw: caseData.actLaw || undefined,
          sections: caseData.sections
            .split(",")
            .map((s) => s.trim())
            .filter(s => s.length > 0)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setFormErrors([data.error || "Failed to create case"]);
        return;
      }

      setCaseId(data._id);
      next();
    } catch (error) {
      setFormErrors(["Network error. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD PROPERTY =================
  const addProperty = async () => {
    setLoading(true);
    setFormErrors([]);

    if (!caseId) {
      setFormErrors(["Create case first"]);
      setLoading(false);
      return;
    }

    const errors: string[] = [];
    if (!currentProperty.category) errors.push("Category is required");
    if (!currentProperty.location) errors.push("Location is required");

    if (errors.length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentProperty,
          caseId
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setFormErrors([data.error || "Failed to add property"]);
        return;
      }

      setProperties((prev) => [...prev, data]);

      // Reset property form
      setCurrentProperty({
        category: "",
        belongsTo: "ACCUSED",
        nature: "",
        quantity: "",
        location: "",
        description: ""
      });
      setSelectedFile(null);
    } catch (error) {
      setFormErrors(["Network error. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  // ================= FILE TO BASE64 =================
  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Step progress indicator
  const steps = [
    { number: 1, label: "Case Details" },
    { number: 2, label: "Add Properties" },
    { number: 3, label: "Confirmation" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: navyDark }}>
              New Case Registration
            </h1>
          </div>
          <p className="text-gray-600">Register a new case and add seized properties</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, index) => (
              <div key={s.number} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  {/* Connector line */}
                  {index > 0 && (
                    <div className={`h-0.5 flex-1 ${step >= s.number ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                  
                  {/* Step circle */}
                  <div className={`
                    w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
                    border-2 font-medium text-sm md:text-base relative z-10
                    ${step > s.number ? 'bg-green-500 border-green-500 text-white' :
                      step === s.number ? `border-${s.number === step ? 'green-500' : 'gray-300'} bg-white text-green-600` :
                      'border-gray-300 bg-white text-gray-400'}
                  `}>
                    {step > s.number ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      s.number
                    )}
                  </div>
                  
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 ${step > s.number ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                </div>
                <span className={`mt-2 text-xs md:text-sm font-medium ${step >= s.number ? 'text-gray-700' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Error Messages */}
          {formErrors.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  {formErrors.map((error, index) => (
                    <p key={index} className="text-red-700 text-sm">{error}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 1: Case Details ================= */}
          {step === 1 && (
            <div className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: navyDark }}>
                Case Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Officer ID (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investigating Officer ID
                  </label>
                  <div className="relative">
                    <input
                      value={caseData.investigatingOfficerId}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Police Station */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Police Station *
                  </label>
                  <input
                    placeholder="Enter police station name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors"
                    // style={{ focusRingColor: khakiPrimary }}
                    value={caseData.policeStation}
                    onChange={(e) => setCaseData({ ...caseData, policeStation: e.target.value })}
                  />
                </div>

                {/* Crime Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crime Number *
                  </label>
                  <input
                    placeholder="Enter crime number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors"
                    // style={{ focusRingColor: khakiPrimary }}
                    value={caseData.crimeNumber}
                    onChange={(e) => setCaseData({ ...caseData, crimeNumber: e.target.value })}
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    placeholder="YYYY"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors"
                    // style={{ focusRingColor: khakiPrimary }}
                    value={caseData.year}
                    onChange={(e) => setCaseData({ ...caseData, year: e.target.value })}
                  />
                </div>

                {/* FIR Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FIR Date *
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors"
                    // style={{ focusRingColor: khakiPrimary }}
                    value={caseData.firDate}
                    onChange={(e) => setCaseData({ ...caseData, firDate: e.target.value })}
                  />
                </div>

                {/* Seizure Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seizure Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors"
                    // style={{ focusRingColor: khakiPrimary }}
                    value={caseData.seizureDate}
                    onChange={(e) => setCaseData({ ...caseData, seizureDate: e.target.value })}
                  />
                </div>

                {/* Act/Law */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Act / Law
                  </label>
                  <input
                    placeholder="Enter relevant act or law"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors"
                    // style={{ focusRingColor: khakiPrimary }}
                    value={caseData.actLaw}
                    onChange={(e) => setCaseData({ ...caseData, actLaw: e.target.value })}
                  />
                </div>

                {/* Sections */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sections (comma separated)
                  </label>
                  <input
                    placeholder="e.g., 302, 34, 120B"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors"
                    // style={{ focusRingColor: khakiPrimary }}
                    value={caseData.sections}
                    onChange={(e) => setCaseData({ ...caseData, sections: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={createCase}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, ${khakiDark} 0%, ${khakiPrimary} 100%)`,
                    color: navyDark
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <div className="flex items-center gap-2 relative z-10">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: navyDark }}></div>
                        <span>Creating Case...</span>
                      </>
                    ) : (
                      <>
                        <span>Save & Continue</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: Add Properties ================= */}
          {step === 2 && (
            <div className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: navyDark }}>
                Add Seized Properties
              </h2>
              <p className="text-gray-600 mb-8">Case ID: <span className="font-medium">{caseId}</span></p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    placeholder="e.g., Weapon, Document, Electronics"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors"
                    // style={{ focusRingColor: khakiPrimary }}
                    value={currentProperty.category}
                    onChange={(e) => setCurrentProperty({ ...currentProperty, category: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Belongs To
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors appearance-none"
                    // style={{ focusRingColor: khakiPrimary }}
                    value={currentProperty.belongsTo}
                    onChange={(e) => setCurrentProperty({ ...currentProperty, belongsTo: e.target.value })}
                  >
                    <option value="ACCUSED">Accused</option>
                    <option value="COMPLAINANT">Complainant</option>
                    <option value="UNKNOWN">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nature
                  </label>
                  <input
                    placeholder="e.g., Firearm, Passport, Mobile Phone"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors"
                    // style={{ focusRingColor: khakiPrimary }}
                    value={currentProperty.nature}
                    onChange={(e) => setCurrentProperty({ ...currentProperty, nature: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    placeholder="e.g., 1, 5 pieces, 2 kg"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors"
                    // style={{ focusRingColor: khakiPrimary }}
                    value={currentProperty.quantity}
                    onChange={(e) => setCurrentProperty({ ...currentProperty, quantity: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (Rack/Locker) *
                  </label>
                  <input
                    placeholder="e.g., Rack A-12, Locker B-5"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors"
                    // style={{ focusRingColor: khakiPrimary }}
                    value={currentProperty.location}
                    onChange={(e) => setCurrentProperty({ ...currentProperty, location: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Detailed description of the property"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors resize-none"
                    // style={{ focusRingColor: khakiPrimary }}
                    value={currentProperty.description}
                    onChange={(e) => setCurrentProperty({ ...currentProperty, description: e.target.value })}
                  />
                </div>

                {/* Image Upload Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Image (Optional)
                  </label>
                  
                  {selectedFile ? (
                    // Image Preview
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Selected Image</span>
                        <button
                          onClick={clearImage}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          type="button"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Property preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {(selectedFile.size / 1024).toFixed(2)} KB • {selectedFile.type}
                          </p>
                          <div className="mt-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="hidden"
                              id="replace-image"
                            />
                            <label
                              htmlFor="replace-image"
                              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              Replace Image
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // File Upload Area
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="property-image"
                      />
                      <label htmlFor="property-image" className="cursor-pointer block">
                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600">Click to upload property image</p>
                        <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <button
                  onClick={prev}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Case Details
                </button>

                <div className="flex gap-4">
                  <button
                    onClick={addProperty}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Property</span>
                      </>
                    )}
                  </button>

                  {properties.length > 0 && (
                    <button
                      onClick={next}
                      className="px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg relative overflow-hidden group"
                      style={{
                        background: `linear-gradient(135deg, ${khakiDark} 0%, ${khakiPrimary} 100%)`,
                        color: navyDark
                      }}
                    >
                      <div className="flex items-center gap-2 relative z-10">
                        <span>Finish & Generate QR Codes</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Added Properties List with Image Previews */}
              {properties.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Added Properties ({properties.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {properties.map((prop, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex gap-4">
                          {/* Property Image Preview */}
                          {prop.imageBase64 && (
                            <div className="flex-shrink-0">
                              <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-300">
                                <img
                                  src={prop.imageBase64}
                                  alt="Property"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-800">{prop.category}</h4>
                                <p className="text-sm text-gray-600">{prop.nature}</p>
                              </div>
                              <span className="text-xs font-medium px-2 py-1 bg-gray-200 text-gray-700 rounded">
                                {prop.belongsTo}
                              </span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                              <p className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Location: {prop.location}
                              </p>
                              <p className="flex items-center gap-1 mt-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Quantity: {prop.quantity}
                              </p>
                              {prop.description && (
                                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                  {prop.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3: Confirmation ================= */}
          {step === 3 && (
            <div className="p-6 md:p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: navyDark }}>
                  Case Registered Successfully!
                </h2>
                <p className="text-gray-600">QR codes have been generated for all properties</p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Generated QR Codes</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {properties.map((p, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.category}</p>
                        <p className="text-xs text-gray-500">{p.location}</p>
                      </div>
                      {p.imageBase64 && (
                        <div className="w-full h-20 mb-2 rounded-lg overflow-hidden">
                          <img
                            src={p.imageBase64}
                            alt="Property"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <QRPreview qrCode={p.qrCode!} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print QR Codes
                </button>

                <button
                  onClick={() => router.push("/cases")}
                  className="px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, ${khakiDark} 0%, ${khakiPrimary} 100%)`,
                    color: navyDark
                  }}
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <span>View All Cases</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}