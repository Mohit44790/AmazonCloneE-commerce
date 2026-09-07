import React, { useState } from "react";


const API_BASE = "http://localhost:8000/api/moods";

const MOOD_OPTIONS = ["Happy", "Sad", "Anxious", "Calm", "Angry", "Tired", "Excited"];

const RATING_FIELDS = [
  { label: "Energy Level", name: "energy_level", icon: "⚡" },
  { label: "Libido", name: "libido", icon: "🔥" },
  { label: "Sleep Quality", name: "sleep_quality", icon: "🌙" },
  { label: "Stress Level", name: "stress_level", icon: "😌" },
];

// ⭐ Star Rating
const StarRating = ({ value, onChange, size = "text-2xl" }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className={`flex gap-1 ${size} cursor-pointer`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <span
            key={star}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform duration-100 hover:scale-110"
            style={{ color: filled ? "#E0A840" : "#E9DEE2" }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

const MiniStars = ({ value }) => (
  <span style={{ color: "#E0A840", letterSpacing: "1px" }}>
    {"★".repeat(value)}
    <span style={{ color: "#E9DEE2" }}>{"★".repeat(Math.max(0, 5 - value))}</span>
  </span>
);

const Moods = () => {
  const [formData, setFormData] = useState({
    date: "",
    moods: [],
    energy_level: 3,
    libido: 3,
    sleep_hours: 7,
    sleep_quality: 3,
    stress_level: 3,
    notes: "",
  });

  const [moodList, setMoodList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, text) => {
    setToast({ type, text });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3200);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleMoodToggle = (mood) => {
    setFormData((prev) => ({
      ...prev,
      moods: prev.moods.includes(mood)
        ? prev.moods.filter((m) => m !== mood)
        : [...prev.moods, mood],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date) {
      showToast("error", "Pick a date first.");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Request failed");
      showToast("success", "Mood logged successfully!");
    } catch (error) {
      console.error("Error logging mood:", error);
      showToast("error", "Failed to log mood.");
    } finally {
      setSaving(false);
    }
  };

  const fetchMoods = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/get`, {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      setMoodList(data.mood || data || []);
      setHasFetched(true);
    } catch (error) {
      console.error("Error fetching moods:", error);
      showToast("error", "Couldn't load your mood history.");
    } finally {
      setFetching(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen p-4 sm:p-8"
      style={{
        background: "radial-gradient(circle at 15% 10%, #FBE1EA 0%, #FDF2F5 45%, #F7ECEF 100%)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
      `}</style>

      <div className="w-full max-w-6xl mx-auto relative">
        {toast && (
          <div
            className={`toast-enter fixed sm:absolute top-4 left-1/2 -translate-x-1/2 z-20 px-5 py-3 rounded-2xl shadow-lg text-sm font-medium ${
              toast.type === "success" ? "bg-[#2F6B4F] text-white" : "bg-[#B23A48] text-white"
            }`}
          >
            {toast.text}
          </div>
        )}

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold tracking-wide text-[#C23566] mb-1.5">Daily check-in</p>
          <h1 className="serif-display text-3xl sm:text-4xl font-medium text-[#4A1E33] leading-tight">
            Log your mood
          </h1>
          <p className="text-[#8C6E7A] text-sm sm:text-base mt-2">
            A few taps now, a clearer pattern later.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[28px] shadow-[0_20px_50px_-15px_rgba(194,53,102,0.25)] border border-[#F6DCE3] p-5 sm:p-8 space-y-7"
        >
          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-[#4A1E33] mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3.5 rounded-2xl border border-[#F2D9E1] bg-[#FFFBFC] focus:ring-2 focus:ring-[#E88BAA] focus:border-[#C23566] outline-none transition text-sm sm:text-base text-[#4A1E33]"
            />
          </div>

          {/* Moods */}
          <div>
            <h2 className="text-sm font-semibold text-[#4A1E33] mb-3">How are you feeling?</h2>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((mood) => {
                const active = formData.moods.includes(mood);
                return (
                  <button
                    type="button"
                    key={mood}
                    onClick={() => handleMoodToggle(mood)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors duration-150 ${
                      active
                        ? "bg-[#C23566] text-white border-[#C23566]"
                        : "bg-[#FFFBFC] text-[#6B4756] border-[#F2D9E1] hover:border-[#E88BAA]"
                    }`}
                  >
                    {mood}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Star Ratings */}
          <div className="rounded-2xl border border-[#F2D9E1] bg-[#FFFBFC] divide-y divide-[#F5E2E8]">
            {RATING_FIELDS.map((item) => (
              <div key={item.name} className="flex items-center justify-between px-4 py-3.5">
                <span className="flex items-center gap-2 text-sm font-medium text-[#4A1E33]">
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </span>
                <StarRating
                  value={formData[item.name]}
                  onChange={(val) => setFormData((prev) => ({ ...prev, [item.name]: val }))}
                />
              </div>
            ))}
          </div>

          {/* Sleep hours */}
          <div>
            <label className="block text-sm font-semibold text-[#4A1E33] mb-2">Sleep hours</label>
            <div className="relative">
              <input
                type="number"
                name="sleep_hours"
                min="0"
                max="24"
                step="0.5"
                value={formData.sleep_hours}
                onChange={handleChange}
                className="w-full p-3.5 pr-14 rounded-2xl border border-[#F2D9E1] bg-[#FFFBFC] focus:ring-2 focus:ring-[#E88BAA] focus:border-[#C23566] outline-none transition text-sm sm:text-base text-[#4A1E33]"
                placeholder="Sleep hours"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#B4899B] font-medium">
                hrs
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h2 className="text-sm font-semibold text-[#4A1E33] mb-2">Notes</h2>
            <textarea
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Anything on your mind today..."
              className="w-full p-3.5 rounded-2xl border border-[#F2D9E1] bg-[#FFFBFC] focus:ring-2 focus:ring-[#E88BAA] focus:border-[#C23566] outline-none resize-none text-sm sm:text-base text-[#4A1E33] placeholder:text-[#C6A9B5]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-2xl text-white font-semibold text-sm sm:text-base transition-transform duration-150 active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100"
            style={{
              background: "linear-gradient(135deg, #C23566 0%, #6B2B4A 100%)",
              boxShadow: "0 12px 30px -10px rgba(194, 53, 102, 0.55)",
            }}
          >
            {saving ? "Saving..." : "Save entry"}
          </button>
        </form>

        {/* Fetch */}
        <div className="flex items-center justify-between mt-8 mb-4">
          <h2 className="serif-display text-xl sm:text-2xl text-[#4A1E33]">Your history</h2>
          <button
            onClick={fetchMoods}
            disabled={fetching}
            className="px-4 py-2.5 rounded-full border border-[#E8C2D1] text-[#8C2C52] text-sm font-semibold bg-white hover:bg-[#FDF2F5] transition-colors disabled:opacity-60"
          >
            {fetching ? "Loading..." : "Fetch moods"}
          </button>
        </div>

        {/* Display */}
        {hasFetched && moodList.length === 0 && (
          <div className="text-center text-sm text-[#B4899B] bg-white/60 border border-[#F2D9E1] rounded-2xl py-10">
            No entries yet — your saved moods will show up here.
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 pb-4">
          {moodList.map((item) => (
            <div
              key={item._id}
              className="bg-white p-5 rounded-2xl shadow-[0_10px_30px_-15px_rgba(194,53,102,0.25)] border border-[#F6DCE3]"
            >
              <h3 className="font-semibold text-[#4A1E33] text-sm mb-2">📅 {item.date}</h3>

              <div className="flex gap-1.5 flex-wrap mb-3">
                {item.moods?.map((m, i) => (
                  <span
                    key={i}
                    className="bg-[#FBE1EA] text-[#8C2C52] px-2.5 py-1 rounded-full text-xs font-medium"
                  >
                    {m}
                  </span>
                ))}
              </div>

              <div className="text-sm text-[#6B4756] space-y-1.5">
                <p className="flex items-center justify-between">
                  <span>⚡ Energy</span> <MiniStars value={item.energy_level} />
                </p>
                <p className="flex items-center justify-between">
                  <span>😌 Stress</span> <MiniStars value={item.stress_level} />
                </p>
                <p className="flex items-center justify-between">
                  <span>🔥 Libido</span> <MiniStars value={item.libido} />
                </p>
                <p className="flex items-center justify-between">
                  <span>😴 Sleep</span> <span className="font-medium text-[#4A1E33]">{item.sleep_hours} hrs</span>
                </p>
              </div>

              {item.notes && (
                <p className="text-[#8C6E7A] text-sm mt-3 italic border-t border-[#F5E2E8] pt-3">
                  "{item.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Moods;