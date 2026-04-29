import { useState } from "react";
import Logout from "../components/Logout";
import FacilityReportForm from "../components/FacilityReportForm";
import TrackReport from "../components/TrackReport";
import ComplaintReportForm from "../components/ComplaintReportForm";

const NormalUserDash = () => {
  const [activeTab, setActiveTab] = useState("submit");

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#1a0a0a_0%,#3d0a0a_50%,#1a1a0a_100%)] py-12 px-4 lg:px-8">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#4A1D1D] p-8 lg:p-10">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  Welcome, {localStorage.getItem("firstName")} 👋
                </h1>
                <p className="text-amber-400 text-lg mt-2">
                  {localStorage.getItem("role")} | {localStorage.getItem("department")}
                </p>
              </div>
              <Logout variant="inline" />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("submit")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "submit"
                  ? "bg-amber-500 text-black border-b-2 border-amber-600"
                  : "bg-transparent text-gray-600 hover:bg-gray-50"
              }`}
            >
              Submit Complaint
            </button>
            <button
              onClick={() => setActiveTab("facility")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "facility"
                  ? "bg-amber-500 text-black border-b-2 border-amber-600"
                  : "bg-transparent text-gray-600 hover:bg-gray-50"
              }`}
            >
              Facility Report
            </button>
            <button
              onClick={() => setActiveTab("track")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "track"
                  ? "bg-amber-500 text-black border-b-2 border-amber-600"
                  : "bg-transparent text-gray-600 hover:bg-gray-50"
              }`}
            >
              Track Report
            </button>
          </div>

          {activeTab === "submit" && <ComplaintReportForm />}
          {activeTab === "facility" && <FacilityReportForm />}
          {activeTab === "track" && <TrackReport />}
        </div>
      </div>
    </div>
  );
};

export default NormalUserDash;
