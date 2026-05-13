import { useState } from "react";
import Logout from "../components/Logout";
import FacilityReportForm from "../components/FacilityReportForm";
import TrackReport from "../components/TrackReport";
import ComplaintReportForm from "../components/ComplaintReportForm";

const NormalUserDash = () => {
  const [activeTab, setActiveTab] = useState("submit");

  // Reusable tab class logic to keep code clean
  const getTabClass = (tabName) => 
    `flex-1 py-2.5 px-4 text-center text-sm font-medium transition-colors ${
      activeTab === tabName
        ? "bg-amber-500 text-black border-b-2 border-amber-600"
        : "bg-transparent text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#1a0a0a_0%,#3d0a0a_50%,#1a1a0a_100%)] py-8 px-4">
      {/* Main Container - max-w-4xl is tighter than 6xl */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          
          {/* Header Section - Reduced padding and font sizes */}
          <div className="bg-[#4A1D1D] p-6 lg:p-7">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white">
                  Welcome, {localStorage.getItem("firstName")} 👋
                </h1>
                <p className="text-amber-400 text-sm mt-1">
                  {localStorage.getItem("role")} | {localStorage.getItem("department")}
                </p>
              </div>
              <div className="scale-90"> {/* Slight scale down for the logout button */}
                <Logout variant="inline" />
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Reduced vertical padding */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("submit")}
              className={getTabClass("submit")}
            >
              Submit Complaint
            </button>
            <button
              onClick={() => setActiveTab("facility")}
              className={getTabClass("facility")}
            >
              Facility Report
            </button>
            <button
              onClick={() => setActiveTab("track")}
              className={getTabClass("track")}
            >
              Track Report
            </button>
          </div>

          {/* Content Area - Ensure child components don't have massive internal padding */}
          <div className="p-4 lg:p-6">
            {activeTab === "submit" && <ComplaintReportForm />}
            {activeTab === "facility" && <FacilityReportForm />}
            {activeTab === "track" && <TrackReport />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NormalUserDash;