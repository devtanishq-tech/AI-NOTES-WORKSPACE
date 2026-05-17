import "./NoteCard.css";
import { motion } from "framer-motion";
import {
  Edit3,
  Sparkles,
  Share2,
  Archive,
  Trash2,
  Clock,
  Loader2,
  Zap,
} from "lucide-react";

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const ActionBtn = ({
  icon: Icon,
  onClick,
  title,
  disabled,
  className = "",
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    disabled={disabled}
    title={title}
    className={`note-action-btn ${className}`}
  >
    {/* Slightly larger icon — 14px instead of 12px */}
    <Icon size={14} />
  </button>
);

const NoteCard = ({
  note,
  onEdit,
  onGenerateAI,
  onShare,
  onArchive,
  onDelete,
  aiLoading,
  isActive,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      transition={{ duration: 0.22 }}
      onClick={onEdit}
      className={`note-card ${isActive ? "note-card--active" : ""} ${note.aiGenerated ? "note-card--ai" : ""} group relative cursor-pointer border`}
    >
      {/* Top accent line */}
      <div className="note-card-accent-line" />

      <div style={{ padding: "14px 14px 12px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <h3 className="note-card-title" style={{ flex: 1 }}>
            {note.title || "Untitled Note"}
          </h3>
          {note.aiGenerated && (
            <span className="note-ai-badge" style={{ marginTop: "1px" }}>
              <Sparkles size={8} />
              AI
            </span>
          )}
        </div>

        {/* Content preview */}
        {note.content && <p className="note-card-preview">{note.content}</p>}

        {/* AI Summary */}
        {note.summary && (
          <div className="note-summary">
            <p
              style={{
                fontSize: "11px",
                color: "rgba(6,182,212,0.55)",
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {note.summary}
            </p>
          </div>
        )}

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="note-card-tags">
            {note.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="note-tag">
                #{tag.replace(/^#+/, "")}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span
                style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.2)",
                  alignSelf: "center",
                }}
              >
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="note-card-footer">
          {/* Meta */}
          <div className="note-meta">
            <Clock size={10} style={{ flexShrink: 0 }} />
            <span>{timeAgo(note.updatedAt)}</span>
            {note.category && note.category !== "General" && (
              <>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>{note.category}</span>
              </>
            )}
          </div>

          {/* Actions */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "2px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* AI button — always visible */}
            <button
              className="note-ai-btn"
              onClick={(e) => {
                e.stopPropagation();
                onGenerateAI?.();
              }}
              disabled={aiLoading}
              title="Generate AI insights"
              style={{
                color: note.aiGenerated
                  ? "rgba(6,182,212,0.6)"
                  : "rgba(255,255,255,0.28)",
                background: "transparent",
              }}
            >
              {aiLoading ? (
                <Loader2
                  size={14}
                  style={{
                    animation: "spin 1s linear infinite",
                    color: "rgba(6,182,212,0.8)",
                  }}
                />
              ) : (
                <Zap size={14} />
              )}
            </button>

            {/* Secondary actions — fade in on hover, always reachable */}
            <div className="note-actions-group">
              <ActionBtn
                icon={Edit3}
                onClick={onEdit}
                title="Edit note"
                className="edit"
              />
              <ActionBtn
                icon={Share2}
                onClick={onShare}
                title="Share note"
                className="share"
              />
              <ActionBtn
                icon={Archive}
                onClick={onArchive}
                title="Archive"
                className="archive"
              />
              <ActionBtn
                icon={Trash2}
                onClick={onDelete}
                title="Delete"
                className="delete"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;
