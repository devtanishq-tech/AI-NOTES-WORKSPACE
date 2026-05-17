import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, RotateCcw } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import DashboardStats from "../components/DashboardStats";
import NoteCard from "../components/NoteCard";
import NoteEditor from "../components/NoteEditor";
import SearchBar from "../components/SearchBar";
import api from "../services/api";
import toast from "react-hot-toast";
import "./Dashboard.css";

// ── Skeleton card ────────────────────────────────────────────
const NoteCardSkeleton = ({ delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay }}
    className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4 space-y-3 overflow-hidden"
  >
    <div className="skeleton-line h-4 w-3/4 rounded-lg" />
    <div className="skeleton-line h-3 w-full rounded-lg" />
    <div className="skeleton-line h-3 w-2/3 rounded-lg" />
    <div className="flex gap-2 pt-1">
      <div className="skeleton-line h-4 w-12 rounded-md" />
      <div className="skeleton-line h-4 w-10 rounded-md" />
    </div>
    <div className="flex justify-between pt-2 border-t border-white/[0.04]">
      <div className="skeleton-line h-3 w-16 rounded" />
      <div className="skeleton-line h-3 w-8 rounded" />
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [view, setView] = useState("overview");
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [stats, setStats] = useState(null);
  const [notesLoading, setNotesLoading] = useState(true);

  const [editingNote, setEditingNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const [aiLoadingIds, setAiLoadingIds] = useState(new Set());

  // ── NEW: Archived notes state ──────────────────────────────
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [archivedLoading, setArchivedLoading] = useState(false);

  // ── Data fetching ──────────────────────────────────────────

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.data.stats);
    } catch {
      /* non-critical */
    }
  }, []);

  const fetchNotes = useCallback(async () => {
    setNotesLoading(true);
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
      setFilteredNotes(res.data);
    } catch {
      toast.error("Failed to load notes");
    } finally {
      setNotesLoading(false);
    }
  }, []);

  // ── NEW: Fetch archived notes ──────────────────────────────
  const fetchArchived = useCallback(async () => {
    setArchivedLoading(true);
    try {
      const res = await api.get("/notes/archived");
      setArchivedNotes(res.data);
    } catch {
      toast.error("Failed to load archived notes");
    } finally {
      setArchivedLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchNotes();
  }, [fetchStats, fetchNotes]);

  // ── NEW: Fetch archived when view switches to "archived" ───
  useEffect(() => {
    if (view === "archived") fetchArchived();
  }, [view, fetchArchived]);

  const allTags = [...new Set(notes.flatMap((n) => n.tags ?? []))];

  // ── Search ─────────────────────────────────────────────────

  const handleSearch = async ({ query, tag }) => {
    if (!query && !tag) {
      setFilteredNotes(notes);
      return;
    }
    try {
      const params = { query: query ?? "" };
      if (tag) params.tag = tag;
      const res = await api.get("/notes/search", { params });
      setFilteredNotes(res.data);
    } catch {
      toast.error("Search failed");
    }
  };

  // ── List updater ───────────────────────────────────────────

  const updateNoteInList = useCallback((updated) => {
    const updater = (prev) => {
      const idx = prev.findIndex((n) => n._id === updated._id);
      if (idx === -1) return [updated, ...prev];
      const copy = [...prev];
      copy[idx] = updated;
      return copy;
    };
    setNotes(updater);
    setFilteredNotes(updater);
  }, []);

  // ── Editor ─────────────────────────────────────────────────

  const openEditor = (note = null) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setTimeout(() => setEditingNote(null), 300);
  };

  const handleSave = useCallback(
    (savedNote) => {
      updateNoteInList(savedNote);
      fetchStats();
    },
    [updateNoteInList, fetchStats],
  );

  const handleAIGenerated = useCallback(
    (updatedNote) => {
      updateNoteInList(updatedNote);
      fetchStats();
    },
    [updateNoteInList, fetchStats],
  );

  // ── Card actions ───────────────────────────────────────────

  const handleGenerateAIFromCard = async (note) => {
    setAiLoadingIds((prev) => new Set([...prev, note._id]));
    try {
      const res = await api.post(`/notes/${note._id}/generate-summary`);
      updateNoteInList(res.data.note);
      fetchStats();
      toast.success("AI insights ready!");
      if (editingNote?._id === note._id) {
        setEditingNote(res.data.note);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "AI generation failed");
    } finally {
      setAiLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(note._id);
        return next;
      });
    }
  };

  const handleShare = async (note) => {
    try {
      const res = await api.patch(`/notes/${note._id}/share`);
      const fullUrl = `${window.location.origin}${res.data.shareLink}`;
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Share link copied!");
    } catch {
      toast.error("Failed to generate share link");
    }
  };

  const handleArchive = async (note) => {
    try {
      await api.patch(`/notes/${note._id}/archive`, { isArchived: true });
      const remover = (prev) => prev.filter((n) => n._id !== note._id);
      setNotes(remover);
      setFilteredNotes(remover);
      if (editingNote?._id === note._id) closeEditor();
      toast.success("Note archived");
      fetchStats();
    } catch {
      toast.error("Failed to archive note");
    }
  };

  const handleDelete = async (note) => {
    if (!window.confirm("Delete this note permanently?")) return;
    try {
      await api.delete(`/notes/${note._id}`);
      const remover = (prev) => prev.filter((n) => n._id !== note._id);
      setNotes(remover);
      setFilteredNotes(remover);
      if (editingNote?._id === note._id) closeEditor();
      toast.success("Note deleted");
      fetchStats();
    } catch {
      toast.error("Failed to delete note");
    }
  };

  // ── NEW: Unarchive handler ─────────────────────────────────
  const handleUnarchive = async (note) => {
    try {
      await api.patch(`/notes/${note._id}/unarchive`);
      // Remove from archived list immediately
      setArchivedNotes((prev) => prev.filter((n) => n._id !== note._id));
      toast.success("Note restored to Notes!");
      // Refresh active notes list + stats so the note reappears
      fetchNotes();
      fetchStats();
    } catch {
      toast.error("Failed to restore note");
    }
  };

  return (
    <MainLayout currentView={view} onViewChange={setView}>
      <div className="flex h-full">
        {/* Content area */}
        <div className="flex-1 overflow-auto min-w-0">
          <div className="p-5 md:p-6 h-full">
            <AnimatePresence mode="wait">
              {/* ── Dashboard overview ── */}
              {view === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <DashboardStats
                    stats={stats}
                    onViewNotes={() => setView("notes")}
                  />
                </motion.div>
              )}

              {/* ── Notes view ── */}
              {view === "notes" && (
                <motion.div
                  key="notes"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-4"
                >
                  {/* Toolbar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-white/85 tracking-tight">
                        All Notes
                      </h2>
                      <p className="text-[11px] text-white/25 mt-0.5">
                        {filteredNotes.length}{" "}
                        {filteredNotes.length !== 1 ? "notes" : "note"}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => openEditor(null)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-[12px] font-semibold transition-colors shadow-lg shadow-violet-500/20"
                    >
                      <Plus size={13} />
                      New Note
                    </motion.button>
                  </div>

                  {/* Search + tags */}
                  <SearchBar onSearch={handleSearch} tags={allTags} />

                  {/* AI tip banner */}
                  {notes.length > 0 && !notes.some((n) => n.aiGenerated) && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 bg-cyan-500/[0.04] border border-cyan-500/[0.12] rounded-xl px-4 py-2.5"
                    >
                      <Sparkles
                        size={12}
                        className="text-cyan-400/60 shrink-0"
                      />
                      <p className="text-[11px] text-white/30">
                        Open a note and click{" "}
                        <span className="text-cyan-400/70 font-semibold">
                          AI Insights
                        </span>{" "}
                        to generate a summary and action items automatically
                      </p>
                    </motion.div>
                  )}

                  {/* Grid — skeleton while loading */}
                  {notesLoading ? (
                    <div
                      className={`grid gap-3 ${
                        showEditor
                          ? "grid-cols-1 lg:grid-cols-2"
                          : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                      }`}
                    >
                      {Array.from({ length: 6 }).map((_, i) => (
                        <NoteCardSkeleton key={i} delay={i * 0.05} />
                      ))}
                    </div>
                  ) : filteredNotes.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-20 text-center"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
                        <span className="text-2xl">📝</span>
                      </div>
                      <p className="text-white/30 text-sm mb-1 font-medium">
                        No notes found
                      </p>
                      <p className="text-white/18 text-xs mb-5">
                        Create a note and let AI help you organize your thoughts
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => openEditor(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-500/[0.12] border border-violet-500/20 text-violet-400/80 rounded-xl text-sm font-medium hover:bg-violet-500/20 transition-all"
                      >
                        <Plus size={13} />
                        Create a note
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      layout
                      className={`grid gap-3 ${
                        showEditor
                          ? "grid-cols-1 lg:grid-cols-2"
                          : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                      }`}
                    >
                      <AnimatePresence>
                        {filteredNotes.map((note) => (
                          <NoteCard
                            key={note._id}
                            note={note}
                            onEdit={() => openEditor(note)}
                            onGenerateAI={() => handleGenerateAIFromCard(note)}
                            onShare={() => handleShare(note)}
                            onArchive={() => handleArchive(note)}
                            onDelete={() => handleDelete(note)}
                            aiLoading={aiLoadingIds.has(note._id)}
                            isActive={editingNote?._id === note._id}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ── NEW: Archived view ── */}
              {view === "archived" && (
                <motion.div
                  key="archived"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-4"
                >
                  {/* Toolbar */}
                  <div>
                    <h2 className="text-base font-semibold text-white/85 tracking-tight">
                      Archived Notes
                    </h2>
                    <p className="text-[11px] text-white/25 mt-0.5">
                      {archivedNotes.length}{" "}
                      {archivedNotes.length !== 1 ? "notes" : "note"} archived
                    </p>
                  </div>

                  {/* Skeleton while loading */}
                  {archivedLoading ? (
                    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <NoteCardSkeleton key={i} delay={i * 0.05} />
                      ))}
                    </div>
                  ) : archivedNotes.length === 0 ? (
                    /* Empty state */
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-20 text-center"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
                        <span className="text-2xl">📦</span>
                      </div>
                      <p className="text-white/30 text-sm font-medium mb-1">
                        No archived notes
                      </p>
                      <p className="text-white/18 text-xs">
                        Notes you archive will appear here
                      </p>
                    </motion.div>
                  ) : (
                    /* Archived notes grid */
                    <motion.div
                      layout
                      className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    >
                      <AnimatePresence>
                        {archivedNotes.map((note, i) => (
                          <motion.div
                            key={note._id}
                            layout
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.22, delay: i * 0.04 }}
                            className="relative rounded-2xl border border-white/[0.08] bg-white/[0.025] overflow-hidden group"
                            style={{ opacity: 0.78 }}
                          >
                            {/* Amber top accent */}
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

                            {/* Generous padding keeps all content away from rounded corners */}
                            <div style={{ padding: "16px 18px 14px" }}>
                              {/* Title + badge — badge uses px-2 so text never clips */}
                              <div className="flex items-start gap-3 mb-3">
                                <h3
                                  className="font-semibold text-white/82 text-[13.5px] leading-snug tracking-tight flex-1"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {note.title || "Untitled Note"}
                                </h3>
                                <span
                                  className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-amber-400/65 bg-amber-400/[0.09] border border-amber-400/18 rounded-lg"
                                  style={{
                                    padding: "3px 8px",
                                    marginTop: "1px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  Archived
                                </span>
                              </div>

                              {/* Content preview */}
                              {note.content && (
                                <p
                                  className="text-[12px] text-white/32 leading-relaxed mb-3"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {note.content}
                                </p>
                              )}

                              {/* Tags */}
                              {note.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {note.tags.slice(0, 3).map((tag) => (
                                    <span
                                      key={tag}
                                      className="text-[10px] bg-white/[0.04] text-white/30 border border-white/[0.08] rounded-md font-medium"
                                      style={{ padding: "2px 8px" }}
                                    >
                                      #{tag.replace(/^#+/, "")}
                                    </span>
                                  ))}
                                  {note.tags.length > 3 && (
                                    <span className="text-[10px] text-white/20 self-center">
                                      +{note.tags.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Footer */}
                              <div
                                className="flex items-center justify-between border-t border-white/[0.05]"
                                style={{ paddingTop: "10px" }}
                              >
                                <span className="text-[11px] text-white/22 flex items-center gap-1.5 min-w-0 overflow-hidden">
                                  <span className="shrink-0">
                                    {new Date(
                                      note.updatedAt,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                  {note.category &&
                                    note.category !== "General" && (
                                      <>
                                        <span className="opacity-40 shrink-0">
                                          ·
                                        </span>
                                        <span className="truncate">
                                          {note.category}
                                        </span>
                                      </>
                                    )}
                                </span>

                                <motion.button
                                  whileHover={{ scale: 1.04 }}
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => handleUnarchive(note)}
                                  className="flex items-center gap-1.5 text-[11px] text-violet-400 hover:text-violet-300 font-semibold rounded-lg hover:bg-violet-500/10 transition-all shrink-0 ml-3"
                                  style={{ padding: "5px 10px" }}
                                >
                                  <RotateCcw size={11} />
                                  Restore
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Editor side panel */}
        <AnimatePresence>
          {showEditor && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "43%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0 border-l border-white/[0.05] overflow-hidden"
              style={{ minWidth: 0 }}
            >
              <NoteEditor
                key={editingNote?._id ?? "new-note"}
                note={editingNote}
                onClose={closeEditor}
                onSave={handleSave}
                onAIGenerated={handleAIGenerated}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
