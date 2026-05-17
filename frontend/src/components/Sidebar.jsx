import { motion } from "framer-motion";
import { LayoutDashboard, FileText, Sparkles, Archive } from "lucide-react"; // ← Archive added
import "./Sidebar.css";

const navItems = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "archived", label: "Archived", icon: Archive },
];

const Sidebar = ({ currentView, onViewChange }) => {
  return (
    <aside className="w-56 h-full flex flex-col shrink-0 relative overflow-hidden sidebar-root">
      {/* Subtle background mesh */}
      <div className="absolute inset-0 bg-[#08080f] border-r border-white/[0.05]" />
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-violet-600/[0.04] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-violet-900/[0.06] to-transparent pointer-events-none" />

      <div className="relative flex flex-col h-full p-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2.5 py-3.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="text-[17px] font-bold bg-gradient-to-r from-white/90 to-white/50 bg-clip-text text-transparent tracking-tight">
            Peblo
          </span>
        </div>

        {/* Section label */}
        <p className="text-[9px] font-semibold text-white/20 uppercase tracking-[0.12em] px-3 mb-2">
          Workspace
        </p>

        {/* Nav items */}
        <nav className="flex-1 space-y-0.5">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = currentView === id;
            return (
              <motion.button
                key={id}
                onClick={() => onViewChange(id)}
                whileTap={{ scale: 0.98 }}
                className={`sidebar-nav-item w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative ${
                  isActive
                    ? "text-white"
                    : "text-white/35 hover:text-white/70 hover:bg-white/[0.04]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-violet-500/[0.12] border border-violet-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                  />
                )}
                <Icon
                  size={15}
                  className={`relative z-10 transition-colors ${
                    isActive ? "text-violet-400" : ""
                  }`}
                />
                <span className="relative z-10">{label}</span>
                {isActive && (
                  <div className="ml-auto relative z-10 w-1.5 h-1.5 rounded-full bg-violet-400" />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom branding */}
        <div className="px-3 pt-4 border-t border-white/[0.05]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] text-white/20">AI-powered workspace</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
