import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";
import { Phone, Shield, Flame, AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });

      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("firstName", response.data.firstName);
      localStorage.setItem("department", response.data.department);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#1a0a0a_0%,#3d0a0a_50%,#1a1a0a_100%)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 md:p-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          {/* Logo Placeholder */}
          <img
            src="/src/assets/IIT-LOGO.png"
            alt="Logo"
            className="w-24 h-24 mx-auto mb-4 object-contain"
          />

          <h1 className="text-2xl md:text-3xl font-bold text-[#4a0404] mb-2">
            CampusWatch
          </h1>
          <p className="text-gray-500 text-sm">
            Your One-Stop Hub for Campus Reports
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ID Number / Email */}
          <div>
            <label className="block text-sm font-bold text-[#4a0404] mb-2">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@msuiit.edu.ph"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a0404] focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-[#4a0404] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a0404] focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#4a0404] text-white font-semibold rounded-xl hover:brightness-110 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : " Login"}
          </button>
        </form>

        {/* Emergency Hotlines Box */}
        <div className="mt-8 p-4 bg-red-50 border-l-4 border-[#4a0404] rounded-r-lg">
          <h3 className="text-red-700 font-bold flex items-center gap-2 mb-3">
            <AlertCircle size={18} />
            Emergency Hotlines
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3 text-gray-700">
              <Shield size={16} className="text-[#4a0404]" />
              <span className="font-medium">Campus Security:</span>
              <span className="text-gray-500">0906-111-321</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Flame size={16} className="text-[#4a0404]" />
              <span className="font-medium">Police dept:</span>
              <span className="text-gray-500">0935-366-0489</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone size={16} className="text-[#4a0404]" />
              <span className="font-medium">Fire dept:</span>
              <span className="text-gray-500">0907-123-1555</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
