import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Brain,
  Share2,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import "./auth.css"; // same as auth.css — rename the file to Login.css

const features = [
  {
    icon: Brain,
    color: "#a78bfa",
    bg: "rgba(139,92,246,0.15)",
    title: "AI-Powered Summaries",
    desc: "Let AI distill your notes into crisp summaries and action items instantly.",
  },
  {
    icon: Zap,
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.12)",
    title: "Smart Action Items",
    desc: "Automatically extract next steps from any note with one click.",
  },
  {
    icon: Share2,
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    title: "Share Anywhere",
    desc: "Generate a public link and share any note with anyone in seconds.",
  },
];

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-bg">
      {/* ── LEFT: Brand Panel ── */}
      <div className="brand-panel hidden md:flex flex-col justify-between w-[52%] p-12 relative z-10">
        <div className="brand-grid" />

        {/* Decorative orbs */}
        <div
          className="orb"
          style={{
            width: 280,
            height: 280,
            top: "-10%",
            left: "-10%",
            background: "rgba(109,40,217,0.18)",
            animationDuration: "12s",
          }}
        />
        <div
          className="orb"
          style={{
            width: 200,
            height: 200,
            bottom: "10%",
            right: "5%",
            background: "rgba(6,182,212,0.12)",
            animationDuration: "9s",
            animationDelay: "3s",
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

        {/* Headline + features */}
        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55 }}
          >
            <h2 className="text-4xl font-bold text-white leading-tight tracking-tight mb-3">
              Think clearly.
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #a78bfa, #38bdf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Write faster.
              </span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed max-w-xs">
              Peblo turns your notes into structured knowledge — with AI that
              actually understands what you wrote.
            </p>
          </motion.div>

          <div className="space-y-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28 + i * 0.1, duration: 0.45 }}
                className="feature-item"
              >
                <div className="feature-icon" style={{ background: f.bg }}>
                  <f.icon size={16} style={{ color: f.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/80 mb-0.5">
                    {f.title}
                  </p>
                  <p className="text-xs text-white/35 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="relative z-10"
        >
          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-sm text-white/40 leading-relaxed italic">
              "Finally a notes app that helps me think, not just store."
            </p>
            <p className="text-xs text-white/25 mt-2">— a happy Peblo user</p>
          </div>
        </motion.div>
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div className="form-panel flex-1 flex items-center justify-center px-8 py-12 relative z-10">
        {/* Mobile logo (hidden on desktop) */}
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
              Welcome back
            </h1>
            <p className="text-white/35 text-sm">
              Sign in to continue to Peblo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                className="block text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                  className="auth-input"
                />
              </div>
            </div>

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
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="••••••••"
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

            {/* Submit */}
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
                  Signing in...
                </span>
              ) : (
                "Sign in →"
              )}
            </button>
          </form>

          <div className="auth-divider" />

          <p
            className="text-center text-[13px]"
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold transition-colors"
              style={{ color: "#a78bfa" }}
              onMouseEnter={(e) => (e.target.style.color = "#c4b5fd")}
              onMouseLeave={(e) => (e.target.style.color = "#a78bfa")}
            >
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
