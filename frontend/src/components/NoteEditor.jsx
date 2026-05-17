import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Tag,
  Folder,
  Sparkles,
  Check,
  Loader2,
  Zap,
  Wand2,
  ChevronDown,
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";
import AILoader from "./AILoader";

const CATEGORIES = [
  "General",
  "Work",
  "Personal",
  "Learning",
  "Ideas",
  "Health",
  "Study",
];

const NoteEditor = ({ note, onClose, onSave, onAIGenerated }) => {
  const [localNote, setLocalNote] = useState(note || null);

  const [form, setForm] = useState({
    title: note?.title || "",
    content: note?.content || "",
    tags: note?.tags || [],
    category: note?.category || "General",
  });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(
    note?.aiGenerated
      ? {
          summary: note.summary,
          actionItems: note.actionItems,
          suggestedTitle: note.suggestedTitle,
        }
      : null,
  );

  const isNew = !localNote?._id;

  const autosave = useCallback(
    async (data) => {
      if (!localNote?._id) return;
      setSaving(true);
      setSaved(false);
      try {
        const res = await api.patch(`/notes/${localNote._id}`, data);
        onSave?.(res.data);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch {
        // Silent autosave failure
      } finally {
        setSaving(false);
      }
    },
    [localNote?._id],
  );

  useEffect(() => {
    if (isNew) return;
    const timer = setTimeout(() => autosave(form), 800);
    return () => clearTimeout(timer);
  }, [form, autosave, isNew]);

  const handleCreate = async () => {
    if (!form.content.trim() && !form.title.trim()) {
      toast.error("Add a title or some content first");
      return;
    }
    try {
      const res = await api.post("/notes", form);
      const created = res.data.note;
      setLocalNote(created);
      onSave?.(created);
      toast.success("Note created!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create note");
    }
  };

  const addTag = () => {
    const tag = tagInput
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/^#+/, "");
    if (tag && !form.tags.includes(tag) && form.tags.length < 8) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
    }
    setTagInput("");
  };

  const removeTag = (tag) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));

  const handleGenerateAI = async () => {
    if (!localNote?._id) {
      toast.error("Save the note first, then generate AI insights");
      return;
    }
    setAiLoading(true);
    try {
      const res = await api.post(`/notes/${localNote._id}/generate-summary`);
      const updated = res.data.note;
      setLocalNote(updated);
      setAiResult({
        summary: updated.summary,
        actionItems: updated.actionItems,
        suggestedTitle: updated.suggestedTitle,
      });
      onAIGenerated?.(updated);
      toast.success("AI insights ready!");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  const wordCount = form.content.trim()
    ? form.content.trim().split(/\s+/).length
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full editor-root"
    >
      {/* Top bar */}
      <div className="editor-topbar flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05] shrink-0">
        {/* Save status */}
        <div className="flex items-center gap-2 min-w-0 h-6">
          <AnimatePresence mode="wait">
            {saving && (
              <motion.span
                key="saving"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-[11px] text-white/25"
              >
                <Loader2 size={10} className="animate-spin" />
                Saving
              </motion.span>
            )}
            {saved && !saving && (
              <motion.span
                key="saved"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-[11px] text-emerald-500/60"
              >
                <Check size={10} />
                Saved
              </motion.span>
            )}
            {isNew && !saving && !saved && (
              <motion.span
                key="draft"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] text-white/20 italic"
              >
                Unsaved draft
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Insights button */}
          {!isNew && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateAI}
              disabled={aiLoading}
              className="editor-ai-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-50"
            >
              {aiLoading ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Wand2 size={11} />
              )}
              {aiLoading ? "Generating..." : "AI Insights"}
            </motion.button>
          )}

          {/* Create button */}
          {isNew && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreate}
              className="px-3.5 py-1.5 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-[11px] font-semibold transition-colors shadow-lg shadow-violet-500/20"
            >
              Create Note
            </motion.button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/[0.06] transition-all"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Editor body */}
      <div className="flex-1 overflow-auto editor-body">
        <div className="px-5 pt-5 pb-8 space-y-4">
          {/* Title */}
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Untitled note..."
            className="w-full bg-transparent text-[20px] font-semibold text-white/90 placeholder-white/12 focus:outline-none tracking-tight"
          />

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 pb-1">
            {/* Category */}
            <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-1.5 hover:border-white/[0.10] transition-colors cursor-pointer">
              <Folder size={11} className="text-white/25" />
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="bg-transparent text-[11px] text-white/40 focus:outline-none cursor-pointer hover:text-white/70 transition-colors pr-1"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#0a0a16] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag size={11} className="text-white/20" />
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-violet-500/[0.08] text-violet-400/70 border border-violet-500/15 px-2 py-0.5 rounded-md text-[10px] font-medium"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-white/70 transition-colors ml-0.5"
                  >
                    <X size={8} />
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="add tag..."
                  className="bg-transparent text-[10px] text-white/35 placeholder-white/15 focus:outline-none w-14"
                />
                {tagInput.trim() && (
                  <button onClick={addTag}>
                    <Plus size={10} className="text-violet-400" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.04]" />

          {/* Content textarea */}
          <textarea
            value={form.content}
            onChange={(e) =>
              setForm((f) => ({ ...f, content: e.target.value }))
            }
            placeholder="Start writing your thoughts, ideas, or plans..."
            className="w-full min-h-48 bg-transparent text-[13.5px] text-white/60 placeholder-white/12 focus:outline-none resize-none leading-[1.8]"
          />

          {/* Word count */}
          {wordCount > 0 && (
            <p className="text-[10px] text-white/15 text-right">
              {wordCount} words
            </p>
          )}

          {/* AI hint — new notes only */}
          {isNew && (
            <div className="flex items-start gap-2.5 bg-white/[0.02] border border-white/[0.05] rounded-xl px-3.5 py-2.5">
              <Zap size={11} className="text-cyan-400/40 shrink-0 mt-0.5" />
              <p className="text-[11px] text-white/20 leading-relaxed">
                Save the note first, then use{" "}
                <span className="text-cyan-400/55 font-medium">
                  AI Insights
                </span>{" "}
                to generate a summary and action items
              </p>
            </div>
          )}

          {/* AI Loader */}
          <AnimatePresence>
            {aiLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <AILoader />
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Results */}
          <AnimatePresence>
            {aiResult && !aiLoading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4 border-t border-white/[0.06] pt-5"
              >
                {/* Section header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <Sparkles size={10} className="text-cyan-400" />
                    </div>
                    <span className="text-[10px] font-semibold text-cyan-400/80 uppercase tracking-[0.1em]">
                      AI Insights
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleGenerateAI}
                    disabled={aiLoading}
                    className="flex items-center gap-1 text-[10px] text-white/25 hover:text-cyan-400/70 transition-colors px-2 py-1 rounded-lg hover:bg-cyan-500/[0.06]"
                  >
                    <Wand2 size={9} />
                    Regenerate
                  </motion.button>
                </div>

                {/* Suggested title */}
                {aiResult.suggestedTitle && (
                  <div className="space-y-1.5">
                    <p className="text-[9px] text-white/20 uppercase tracking-[0.12em] font-semibold">
                      Suggested Title
                    </p>
                    <div className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 group hover:border-white/[0.10] transition-colors">
                      <p className="text-[13px] text-white/60">
                        {aiResult.suggestedTitle}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            title: aiResult.suggestedTitle,
                          }))
                        }
                        className="text-[10px] text-violet-400/60 hover:text-violet-400 font-semibold ml-3 shrink-0 transition-colors"
                      >
                        Use
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Summary */}
                {aiResult.summary && (
                  <div className="space-y-1.5">
                    <p className="text-[9px] text-white/20 uppercase tracking-[0.12em] font-semibold">
                      Summary
                    </p>
                    <div className="ai-summary-block rounded-xl px-3.5 py-3">
                      <p className="text-[13px] text-cyan-200/55 leading-relaxed">
                        {aiResult.summary}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action items */}
                {aiResult.actionItems?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[9px] text-white/20 uppercase tracking-[0.12em] font-semibold">
                      Action Items
                    </p>
                    <div className="space-y-1.5">
                      {aiResult.actionItems.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.065 }}
                          className="flex items-start gap-2.5 bg-white/[0.02] border border-white/[0.04] rounded-xl px-3 py-2.5 hover:border-white/[0.08] transition-colors"
                        >
                          <span className="text-violet-400/60 shrink-0 mt-0.5 text-[10px]">
                            ◆
                          </span>
                          <p className="text-[13px] text-white/50 leading-snug">
                            {item}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default NoteEditor;
