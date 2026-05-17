import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import "./auth.css"; // same as auth.css — rename the file to Signup.css

const perks = [
  "AI summaries & action items",
  "Smart tag organisation",
  "Public note sharing",
  "Autosave as you type",
  "Dashboard analytics",
];

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await signup(form.name.trim(), form.email, form.password);
      navigate("/dashboard");
      toast.success(`Welcome to Peblo, ${form.name.split(" ")[0]}! 🎉`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: "name",
      label: "Full Name",
      type: "text",
      icon: User,
      placeholder: "Your name",
      autoComplete: "name",
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      icon: Mail,
      placeholder: "you@example.com",
      autoComplete: "email",
    },
  ];

  return (
    <div className="auth-page auth-bg">
      {/* ── LEFT: Brand Panel ── */}
      <div className="brand-panel hidden md:flex flex-col justify-between w-[52%] p-12 relative z-10">
        <div className="brand-grid" />

        {/* Orbs */}
        <div
          className="orb"
          style={{
            width: 300,
            height: 300,
            top: "-15%",
            right: "-5%",
            background: "rgba(109,40,217,0.15)",
            animationDuration: "14s",
          }}
        />
        <div
          className="orb"
          style={{
            width: 220,
            height: 220,
            bottom: "5%",
            left: "-8%",
            background: "rgba(6,182,212,0.10)",
            animationDuration: "10s",
            animationDelay: "2s",
          }}
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="logo-glow w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                boxShadow: "0 4px 20px rgba(109,40,217,0.45)",
              }}
            >
              <Sparkles size={18} className="text-white" />
            </div>
            <span
              className="text-2xl font-bold tracking-tight"
              style={{
                background: "linear-gradient(90deg, #c4b5fd, #67e8f9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Peblo
            </span>
          </div>
          <p className="text-white/35 text-sm pl-1">
            Your AI-powered note workspace
          </p>
        </motion.div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55 }}
          >
            <h2 className="text-4xl font-bold text-white leading-tight tracking-tight mb-3">
              Your ideas
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #a78bfa, #38bdf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                deserve better.
              </span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed max-w-xs">
              Join Peblo and turn scattered thoughts into clear, AI-enhanced
              knowledge — in seconds.
            </p>
          </motion.div>

          {/* Perks list */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-3"
          >
            <p className="text-[11px] text-white/30 uppercase tracking-widest font-semibold mb-4">
              Everything included, free
            </p>
            {perks.map((perk, i) => (
              <motion.div
                key={perk}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.38 + i * 0.08, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2
                  size={16}
                  style={{ color: "#a78bfa", flexShrink: 0 }}
                />
                <span className="text-sm text-white/55">{perk}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="relative z-10"
        >
          <div
            className="grid grid-cols-3 gap-3 rounded-2xl p-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {[
              { value: "AI", label: "Powered" },
              { value: "∞", label: "Notes" },
              { value: "1-click", label: "Summaries" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg font-bold" style={{ color: "#c4b5fd" }}>
                  {stat.value}
                </p>
                <p className="text-[11px] text-white/30 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div className="form-panel flex-1 flex items-center justify-center px-8 py-12 relative z-10">
        {/* Mobile logo */}
        <div className="md:hidden absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
          >
            <Sparkles size={15} className="text-white" />
          </div>
          <span
            className="text-xl font-bold"
            style={{
              background: "linear-gradient(90deg, #c4b5fd, #67e8f9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Peblo
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[380px]"
        >
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">
              Create your account
            </h1>
            <p className="text-white/35 text-sm">
              Free forever. No credit card needed.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(
              ({ key, label, type, icon: Icon, placeholder, autoComplete }) => (
                <div key={key} className="space-y-1.5">
                  <label
                    className="block text-[11px] font-semibold uppercase tracking-widest"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {label}
                  </label>
                  <div className="relative">
                    <Icon
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    />
                    <input
                      type={type}
                      required
                      autoComplete={autoComplete}
                      value={form[key]}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [key]: e.target.value }))
                      }
                      placeholder={placeholder}
                      className="auth-input"
                    />
                  </div>
                </div>
              ),
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <label
                className="block text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="Min. 6 characters"
                  className="auth-input"
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                  onMouseEnter={(e) =>
                    (e.target.style.color = "rgba(255,255,255,0.6)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.color = "rgba(255,255,255,0.25)")
                  }
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Password strength hint */}
            {form.password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2"
              >
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background:
                          form.password.length >= i * 3
                            ? i <= 1
                              ? "#f87171"
                              : i <= 2
                                ? "#fb923c"
                                : i <= 3
                                  ? "#facc15"
                                  : "#4ade80"
                            : "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-white/30">
                  {form.password.length < 4
                    ? "Too short"
                    : form.password.length < 7
                      ? "Weak"
                      : form.password.length < 10
                        ? "Good"
                        : "Strong"}
                </span>
              </motion.div>
            )}

            <button type="submit" disabled={loading} className="auth-btn mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Get started →"
              )}
            </button>
          </form>

          <div className="auth-divider" />

          <p
            className="text-center text-[13px]"
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold transition-colors"
              style={{ color: "#a78bfa" }}
              onMouseEnter={(e) => (e.target.style.color = "#c4b5fd")}
              onMouseLeave={(e) => (e.target.style.color = "#a78bfa")}
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
