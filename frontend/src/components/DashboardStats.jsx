import { motion } from "framer-motion";
import { FileText, Zap, Sparkles, Tag, Clock, ArrowRight } from "lucide-react";
import useAuth from "../hooks/useAuth";

const StatCard = ({ icon: Icon, label, value, colorClass, bgClass, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -3, scale: 1.01 }}
    className="bg-white/[0.03] backdrop-blur border border-white/[0.07] rounded-2xl hover:border-white/[0.12] transition-all duration-200 group"
    style={{ padding: "20px 20px 18px" }}
  >
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${bgClass}`}
    >
      <Icon size={17} className={colorClass} />
    </div>
    <p className="text-2xl font-bold text-white tracking-tight tabular-nums mb-1">
      {value ?? "—"}
    </p>
    <p className="text-xs text-white/35 font-medium">{label}</p>
  </motion.div>
);

const DashboardStats = ({ stats, onViewNotes }) => {
  const { user } = useAuth();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-7 max-w-5xl">
      {/* ── Hero banner ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.10] via-purple-500/[0.05] to-transparent"
        style={{ padding: "28px 32px 28px" }}
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 w-52 h-52 bg-cyan-500/6 rounded-full blur-2xl" />
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

        <div className="relative">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            {greeting}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-white/40 text-sm mb-6">
            You've updated{" "}
            <span className="text-violet-400 font-semibold">
              {stats?.weeklyActivity ?? 0} note
              {stats?.weeklyActivity !== 1 ? "s" : ""}
            </span>{" "}
            this week
          </p>

          {/* Pills — enough padding so icons don't clip */}
          <div className="flex flex-wrap items-center gap-3">
            {stats?.mostUsedTag && (
              <div
                className="flex items-center gap-2 bg-white/[0.07] border border-white/[0.12] rounded-xl"
                style={{ padding: "7px 14px 7px 12px" }}
              >
                <Tag size={12} className="text-violet-400 shrink-0" />
                <span className="text-xs text-white/50">Most used:</span>
                <span className="text-xs font-semibold text-violet-400">
                  #{stats.mostUsedTag}
                </span>
              </div>
            )}
            {stats?.aiUsage > 0 && (
              <div
                className="flex items-center gap-2 bg-cyan-500/[0.09] border border-cyan-500/25 rounded-xl"
                style={{ padding: "7px 14px 7px 12px" }}
              >
                <Sparkles size={12} className="text-cyan-400 shrink-0" />
                <span className="text-xs text-cyan-300/70">
                  <span className="font-semibold text-cyan-400">
                    {stats.aiUsage}
                  </span>{" "}
                  AI {stats.aiUsage === 1 ? "summary" : "summaries"} generated
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Stat cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={FileText}
          label="Total Notes"
          value={stats?.totalNotes ?? 0}
          colorClass="text-violet-400"
          bgClass="bg-violet-500/15"
          delay={0.08}
        />
        <StatCard
          icon={Zap}
          label="This Week"
          value={stats?.weeklyActivity ?? 0}
          colorClass="text-blue-400"
          bgClass="bg-blue-500/15"
          delay={0.13}
        />
        <StatCard
          icon={Sparkles}
          label="AI Summaries"
          value={stats?.aiUsage ?? 0}
          colorClass="text-cyan-400"
          bgClass="bg-cyan-500/15"
          delay={0.18}
        />
        <StatCard
          icon={Tag}
          label="Top Tag"
          value={stats?.mostUsedTag ? `#${stats.mostUsedTag}` : "—"}
          colorClass="text-pink-400"
          bgClass="bg-pink-500/15"
          delay={0.23}
        />
      </div>

      {/* ── Recent Notes ─────────────────────────────────────── */}
      {stats?.recentNotes?.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">
              Recent Notes
            </h2>
            <button
              onClick={onViewNotes}
              className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
            >
              View all
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-2">
            {stats.recentNotes.map((note, i) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.32 + i * 0.055 }}
                onClick={onViewNotes}
                className="flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-violet-500/20 rounded-xl cursor-pointer transition-all group"
                style={{ padding: "11px 16px" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Clock size={12} className="text-white/20 shrink-0" />
                  <span className="text-sm text-white/55 group-hover:text-white/80 transition-colors truncate">
                    {note.title || "Untitled Note"}
                  </span>
                  {note.aiGenerated && (
                    <span className="flex items-center gap-1 text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full shrink-0 font-medium">
                      <Sparkles size={8} />
                      AI
                    </span>
                  )}
                </div>
                <span className="text-xs text-white/25 shrink-0 ml-4">
                  {new Date(note.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Empty state ──────────────────────────────────────── */}
      {(!stats || stats.totalNotes === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center py-16"
        >
          <p className="text-5xl mb-4">✨</p>
          <p className="text-white/30 text-sm mb-1 font-medium">No notes yet</p>
          <p className="text-white/20 text-xs mb-5">
            Create your first note and use AI to generate insights
          </p>
          <button
            onClick={onViewNotes}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-500/15 border border-violet-500/25 text-violet-400 rounded-xl text-sm font-medium hover:bg-violet-500/25 transition-all"
          >
            <FileText size={14} />
            Create a note
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardStats;
