import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import api from "../config/axios";

const Logout = ({ variant = "inline" }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      localStorage.removeItem("department");
      localStorage.removeItem("firstName");
      navigate("/login");
    }
  };

  // Inline style (as used in NormalUserDash header)
  if (variant === "inline") {
    return (
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
      >
        <LogOut size={18} />
        <span className="text-sm">Logout</span>
      </button>
    );
  }

  // Standalone button style (similar to original LogoutButton)
  return (
    <button
      onClick={handleLogout}
      className="bg-[#b35959] text-white px-4 py-2 rounded hover:bg-[#994d4d] transition-colors"
    >
      <LogOut size={18} className="inline mr-2" />
      Logout
    </button>
  );
};

export default Logout;
