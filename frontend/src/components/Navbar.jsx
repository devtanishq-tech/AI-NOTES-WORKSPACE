import "./Navbar.css";
import { motion } from "framer-motion";
import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      toast.success("See you soon!");
    } catch {
      toast.error("Logout failed");
    }
  };

  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="navbar-root">
      {/* Mobile menu trigger */}
      <button
        onClick={onMenuClick}
        className="navbar-menu-btn md:hidden"
        title="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Desktop spacer */}
      <div className="hidden md:block" />

      <div className="navbar-controls">
        {/* User pill */}
        <div className="navbar-user-pill">
          <div className="navbar-avatar">
            <span className="navbar-avatar-text">{initials}</span>
          </div>
          <span className="navbar-username hidden sm:block">
            {user?.name?.split(" ")[0]}
          </span>
        </div>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          onClick={handleLogout}
          title="Logout"
          className="navbar-logout-btn"
        >
          <LogOut size={16} />
        </motion.button>
      </div>
    </header>
  );
};

export default Navbar;
