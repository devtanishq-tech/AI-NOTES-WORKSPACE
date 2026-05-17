import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Tag,
  Clock,
  User,
  Lock,
  CheckSquare,
  ArrowUpRight,
} from "lucide-react";
import api from "../services/api";

const SharedNote = () => {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        // GET /shared/:shareId → note directly (userId populated with { name })
        const res = await api.get(`/shared/${shareId}`);
        setNote(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "This note is not available");
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [shareId]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#06060f] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-violet-500 animate-spin" />
      </div>
    );
  }

  // ── Error / Not found ──
  if (error) {
    return (
      <div className="min-h-screen bg-[#06060f] flex flex-col items-center justify-center gap-5 p-4">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
          <Lock size={24} className="text-white/25" />
        </div>
        <div className="text-center">
          <h2 className="text-white/70 font-semibold mb-1">Note unavailable</h2>
          <p className="text-white/35 text-sm">{error}</p>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors"
        >
          Open Peblo <ArrowUpRight size={14} />
        </Link>
      </div>
    );
  }

  // ── Note view ──
  return (
    <div className="min-h-screen bg-[#06060f] py-16 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto relative">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <Link to="/login" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="font-bold text-base bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Peblo
            </span>
          </Link>
          <span className="text-[11px] text-white/25 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full">
            Shared Note · Read only
          </span>
        </motion.div>

        {/* Note card */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 md:p-10 shadow-2xl space-y-7"
        >
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2">
            {note.category && note.category !== "General" && (
              <span className="text-[11px] text-white/35 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-lg">
                {note.category}
              </span>
            )}
            {note.tags?.map((tag) => (
              <span
                key={tag}
                className="text-[11px] bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-lg font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <div className="space-y-2.5">
            <h1 className="text-3xl font-bold text-white leading-tight tracking-tight">
              {note.title || "Untitled Note"}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/30">
              <span className="flex items-center gap-1.5">
                <User size={11} />
                {note.userId?.name ?? "Anonymous"}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={11} />
                {new Date(note.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.05]" />

          {/* Content */}
          {note.content ? (
            <div className="text-[15px] text-white/65 leading-relaxed whitespace-pre-wrap">
              {note.content}
            </div>
          ) : (
            <p className="text-white/25 italic text-sm">No content</p>
          )}

          {/* AI Insights */}
          {note.aiGenerated &&
            (note.summary || note.actionItems?.length > 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="border-t border-cyan-500/15 pt-7 space-y-5"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-cyan-400" />
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    AI Insights
                  </span>
                </div>

                {note.summary && (
                  <div className="bg-cyan-500/[0.05] border border-cyan-500/15 rounded-2xl p-5">
                    <p className="text-[11px] text-cyan-400/50 uppercase tracking-widest mb-2.5">
                      Summary
                    </p>
                    <p className="text-sm text-cyan-200/70 leading-relaxed">
                      {note.summary}
                    </p>
                  </div>
                )}

                {note.actionItems?.length > 0 && (
                  <div>
                    <p className="text-[11px] text-white/25 uppercase tracking-widest mb-3">
                      Action Items
                    </p>
                    <div className="space-y-2.5">
                      {note.actionItems.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.07 }}
                          className="flex items-start gap-3 text-sm text-white/55"
                        >
                          <CheckSquare
                            size={14}
                            className="text-violet-400 shrink-0 mt-0.5"
                          />
                          {item}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
        </motion.article>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-center mt-10"
        >
          <p className="text-white/20 text-xs mb-3">
            Created with Peblo — AI-powered note workspace
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            Try Peblo for free <ArrowUpRight size={13} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default SharedNote;
