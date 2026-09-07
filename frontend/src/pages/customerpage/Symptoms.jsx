import React, { useState, useRef, useEffect } from "react";




function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const SYMPTOMS = [
  "Cramps",
  "Fatigue",
  "Headache",
  "Bloating",
  "Back Pain",
  "Nausea",
  "Acne",
  "Insomnia",
];

const SEVERITY = [
  { key: "mild", label: "Mild", fill: "#E8A2BC" },
  { key: "moderate", label: "Moderate", fill: "#C23566" },
  { key: "severe", label: "Severe", fill: "#6B2B4A" },
];

const PAIN_WORDS = [
  "None",
  "Barely there",
  "Barely there",
  "Manageable",
  "Manageable",
  "Noticeable",
  "Noticeable",
  "Uncomfortable",
  "Uncomfortable",
  "Intense",
  "Severe",
];

export default function Symptoms() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [severity, setSeverity] = useState("");
  const [pain, setPain] = useState(0);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', text }
  const [symptomsOpen, setSymptomsOpen] = useState(false);
  const symptomsRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (symptomsRef.current && !symptomsRef.current.contains(e.target)) {
        setSymptomsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const showToast = (type, text) => {
    setToast({ type, text });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3200);
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    if (!date) {
      showToast("error", "Pick a date first.");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const decoded = token ? decodeJwt(token) : null;

      const payload = {
        date,
        symptoms: selectedSymptoms,
        severity,
        pain_score: pain,
        notes,
        user_id: decoded?.id,
      };

      const res = await fetch("http://localhost:8000/api/symptom/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Request failed");
      }

      showToast("success", "Symptoms saved successfully!");
      setSelectedSymptoms([]);
      setSeverity("");
      setPain(0);
      setDate("");
      setNotes("");
    } catch (error) {
      console.error(error);
      showToast("error", error?.message || "Failed to save symptoms. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-4 sm:p-8"
      style={{
        background:
          "radial-gradient(circle at 15% 10%, #FBE1EA 0%, #FDF2F5 45%, #F7ECEF 100%)",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');
        .serif-display { font-family: 'Fraunces', Georgia, serif; }
        .toast-enter { animation: toastIn 0.28s ease-out; }
        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        input[type="range"].pain-slider {
          -webkit-appearance: none;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(90deg, #F3C6D6 0%, #C23566 100%);
        }
        input[type="range"].pain-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #C23566;
          box-shadow: 0 2px 6px rgba(194, 53, 102, 0.4);
          cursor: pointer;
          margin-top: -4px;
        }
        input[type="range"].pain-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #C23566;
          box-shadow: 0 2px 6px rgba(194, 53, 102, 0.4);
          cursor: pointer;
        }
      `}</style>

      <div className="w-full max-w-5xl relative">
        {toast && (
          <div
            className={`toast-enter fixed sm:absolute top-4 left-1/2 -translate-x-1/2 z-20 px-5 py-3 rounded-2xl shadow-lg text-sm font-medium ${
              toast.type === "success"
                ? "bg-[#2F6B4F] text-white"
                : "bg-[#B23A48] text-white"
            }`}
          >
            {toast.text}
          </div>
        )}

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold tracking-wide text-[#C23566] mb-1.5">
            Daily check-in
          </p>
          <h1 className="serif-display text-3xl sm:text-4xl font-medium text-[#4A1E33] leading-tight">
            How is your body today?
          </h1>
          <p className="text-[#8C6E7A] text-sm sm:text-base mt-2">
            A minute of noticing adds up to a clearer picture over time.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[28px] shadow-[0_20px_50px_-15px_rgba(194,53,102,0.25)] border border-[#F6DCE3] p-5 sm:p-8 space-y-7">
          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-[#4A1E33] mb-2">
              Date
            </label>
            <input
              type="date"
              className="w-full p-3.5 rounded-2xl border border-[#F2D9E1] bg-[#FFFBFC] focus:ring-2 focus:ring-[#E88BAA] focus:border-[#C23566] outline-none transition text-sm sm:text-base text-[#4A1E33]"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Symptoms */}
          <div ref={symptomsRef} className="relative">
            <h2 className="text-sm font-semibold text-[#4A1E33] mb-2">
              Symptoms
            </h2>

            <button
              type="button"
              onClick={() => setSymptomsOpen((o) => !o)}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl border bg-[#FFFBFC] text-sm sm:text-base transition-colors duration-150 ${
                symptomsOpen
                  ? "border-[#C23566] ring-2 ring-[#E88BAA]"
                  : "border-[#F2D9E1] hover:border-[#E88BAA]"
              }`}
            >
              <span className={selectedSymptoms.length ? "text-[#4A1E33]" : "text-[#C6A9B5]"}>
                {selectedSymptoms.length
                  ? `${selectedSymptoms.length} symptom${selectedSymptoms.length > 1 ? "s" : ""} selected`
                  : "Select symptoms"}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className={`text-[#C23566] transition-transform duration-150 ${symptomsOpen ? "rotate-180" : ""}`}
              >
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {selectedSymptoms.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {selectedSymptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="flex items-center gap-1 pl-3 pr-2 py-1 rounded-full bg-[#FBE1EA] text-[#8C2C52] text-xs font-medium"
                  >
                    {symptom}
                    <button
                      type="button"
                      onClick={() => toggleSymptom(symptom)}
                      className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#F3B9CE] transition-colors"
                      aria-label={`Remove ${symptom}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {symptomsOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-[#F2D9E1] rounded-2xl shadow-[0_16px_40px_-12px_rgba(194,53,102,0.3)] py-2 max-h-64 overflow-y-auto">
                {SYMPTOMS.map((symptom) => {
                  const active = selectedSymptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => toggleSymptom(symptom)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-[#FDF2F5] transition-colors"
                    >
                      <span
                        className={`w-4.5 h-4.5 flex items-center justify-center rounded-md border transition-colors ${
                          active
                            ? "bg-[#C23566] border-[#C23566]"
                            : "border-[#D9B6C3]"
                        }`}
                        style={{ width: 18, height: 18 }}
                      >
                        {active && (
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l2.5 2.5L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className={active ? "text-[#4A1E33] font-medium" : "text-[#6B4756]"}>
                        {symptom}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Severity */}
          <div>
            <h2 className="text-sm font-semibold text-[#4A1E33] mb-3">
              Severity
            </h2>
            <div className="grid grid-cols-3 gap-2.5">
              {SEVERITY.map(({ key, label, fill }) => {
                const active = severity === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSeverity(key)}
                    className={`relative py-3 rounded-2xl text-sm font-semibold text-white transition-all duration-150 ${
                      active ? "scale-[1.03]" : "opacity-80 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: fill,
                      boxShadow: active
                        ? `0 8px 20px -6px ${fill}99, 0 0 0 3px #FBE1EA, 0 0 0 5px ${fill}`
                        : "none",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pain Score */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#4A1E33]">
                Pain score
              </h2>
              <span className="text-sm  font-semibold text-[#C23566]">
                {pain}/10 · {PAIN_WORDS[pain]}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={pain}
              onChange={(e) => setPain(Number(e.target.value))}
              className="pain-slider w-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[#B4899B] mt-2">
              <span>No pain</span>
              <span>Worst pain</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h2 className="text-sm font-semibold text-[#4A1E33] mb-2">
              Notes
            </h2>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write anything about how you feel today..."
              className="w-full p-3.5 rounded-2xl border border-[#F2D9E1] bg-[#FFFBFC] focus:ring-2 focus:ring-[#E88BAA] focus:border-[#C23566] outline-none resize-none text-sm sm:text-base text-[#4A1E33] placeholder:text-[#C6A9B5]"
            />
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 rounded-2xl text-white font-semibold text-sm sm:text-base transition-transform duration-150 active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100"
            style={{
              background: "linear-gradient(135deg, #C23566 0%, #6B2B4A 100%)",
              boxShadow: "0 12px 30px -10px rgba(194, 53, 102, 0.55)",
            }}
          >
            {submitting ? "Saving..." : "Save entry"}
          </button>
        </div>
      </div>
    </div>
  );
}