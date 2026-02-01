"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const defaultQuestions = [
    "What is the punishment for theft under BNS (India)?",
    "Standard format of an FIR for property theft",
    "Guidelines for digital evidence preservation",
    "Protocol for disposing hazardous material from Malkhana",
  ];

  const handleAskAI = async (query: string = prompt) => {
    const finalQuery = query || prompt;
    if (!finalQuery.trim()) return;

    setLoading(true);
    setReply("");
    if (!prompt) setPrompt(query); // Sync input box if a chip was clicked

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalQuery }),
      });

      const data = await res.json();
      if (data.success) {
        setReply(data.reply);
      } else {
        setReply("Error: " + (data.error || "Failed to get response"));
      }
    } catch (err) {
      setReply("Connection failed. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(18);
    doc.text("e-Malkhana AI Assistant Guidance", margin, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, 28);
    doc.line(margin, 32, pageWidth - margin, 32);

    // Query
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Officer Query:", margin, 42);
    doc.setTextColor(0);
    const splitPrompt = doc.splitTextToSize(prompt, pageWidth - margin * 2);
    doc.text(splitPrompt, margin, 48);

    // AI Response
    const responseStart = 48 + splitPrompt.length * 7;
    doc.setTextColor(100);
    doc.text("Legal Guidance / Response:", margin, responseStart);
    doc.setTextColor(0);
    const splitReply = doc.splitTextToSize(reply, pageWidth - margin * 2);
    doc.text(splitReply, margin, responseStart + 8);

    doc.save(`AI_Guidance_${Date.now()}.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          AI Intelligence Bureau
        </h1>
        <p className="text-slate-500 mt-2">
          Secure legal guidance and procedural assistance for Jharkhand Police
          Officers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input & Suggestions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
              Official Inquiry
            </label>
            <textarea
              className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#D4B483] focus:border-transparent outline-none transition-all min-h-[150px] text-slate-700 bg-slate-50"
              placeholder="Explain the situation or ask for specific legal sections..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-slate-400 italic">
                For official use only. All queries are logged.
              </p>
              <button
                onClick={() => handleAskAI()}
                disabled={loading || !prompt}
                className="bg-[#1e293b] text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-900 transition-all shadow-md disabled:opacity-40"
              >
                {loading ? "Processing..." : "Search Database"}
              </button>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest">
              Frequent Queries
            </h3>
            <div className="flex flex-wrap gap-2">
              {defaultQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskAI(q)}
                  className="px-4 py-2 rounded-full border border-slate-200 bg-white text-sm text-slate-600 hover:border-[#D4B483] hover:text-[#B5985C] transition-all text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Output */}
        <div className="lg:col-span-1">
          {reply ? (
            <div className="bg-[#fcfaf7] rounded-xl border border-[#D4B483]/30 shadow-lg flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
              <div className="p-6 flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-[#B5985C] uppercase tracking-tighter bg-[#D4B483]/10 px-2 py-1 rounded">
                    Response
                  </span>
                  <button
                    onClick={downloadPDF}
                    className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors font-bold"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    PDF
                  </button>
                </div>
                <div className="prose prose-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {reply}
                </div>
              </div>
              <div className="p-4 bg-[#D4B483]/5 border-t border-[#D4B483]/20 rounded-b-xl">
                <p className="text-[10px] text-slate-400 text-center">
                  This response is AI-generated for guidance and should be
                  verified with official legal gazettes.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center p-8 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm font-medium">
                  Guidance will appear here after search.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
