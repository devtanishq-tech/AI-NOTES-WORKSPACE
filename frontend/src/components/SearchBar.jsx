import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Hash } from "lucide-react";

const SearchBar = ({ onSearch, tags = [] }) => {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch({ query, tag: selectedTag });
    }, 380);
    return () => clearTimeout(timer);
  }, [query, selectedTag]);

  const clearAll = () => {
    setQuery("");
    setSelectedTag("");
  };

  const hasFilter = query || selectedTag;

  return (
    <div className="space-y-2.5">
      {/* Search input */}
      <div className="relative">
        <Search
          size={13}
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
            focused ? "text-violet-400/60" : "text-white/20"
          }`}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search by title or content..."
          className={`search-input w-full rounded-xl pl-9 pr-9 py-2.5 text-[13px] text-white/70 placeholder-white/18 focus:outline-none transition-all duration-200 ${
            focused
              ? "border-violet-500/30 bg-white/[0.05]"
              : "border-white/[0.07] bg-white/[0.025]"
          } border`}
        />
        <AnimatePresence>
          {hasFilter && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={clearAll}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
            >
              <X size={12} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Tag chips */}
      <AnimatePresence>
        {tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-wrap gap-1.5"
          >
            {tags.map((tag, i) => {
              const isSelected = selectedTag === tag;
              const cleanTag = tag.replace(/^#+/, "");
              return (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedTag(isSelected ? "" : tag)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-150 ${
                    isSelected
                      ? "bg-violet-500 text-white shadow-md shadow-violet-500/20 border border-violet-400/20"
                      : "bg-white/[0.03] text-white/35 border border-white/[0.07] hover:text-white/60 hover:border-violet-500/20 hover:bg-violet-500/[0.05]"
                  }`}
                >
                  <Hash
                    size={9}
                    className={isSelected ? "opacity-80" : "opacity-50"}
                  />
                  {cleanTag}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
