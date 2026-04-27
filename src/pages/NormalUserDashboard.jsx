import { useState } from "react";
import LogoutButton from "../components/LogoutButton";
import api from "../config/axios";
import NormalUserNav from "../components/NormalUserNav";

const NormalUserDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    description:"",
    priorityLevel:"",
    locationScope: "",

    nearestBuilding: "",
    outsideArea:"",
    building: "",
    floor: "",
    room: "",
    
    happenedAt:"",
    knowsAccused: "",
    accusedNames: [],
    accusedDesciption: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // API call here

  };

  return (
    <>
    <NormalUserNav/>
    <div className="min-h-screen bg-white p-8">
      {!showForm ? (
        <>
          <h1 className="text-3xl font-bold text-[#800000] mb-8">
            Normal User Dashboard
          </h1>

          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#800000] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#600000] transition-colors"
            >
              Submit Report
            </button>
            <button className="bg-[#800000] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#600000] transition-colors">
              Track Report
            </button>
          </div>

          <div className="mt-8">
            <LogoutButton />
          </div>
        </>
      ) : (
        <div className="border-2 border-[#800000] rounded-lg p-6 max-w-2xl mx-auto mt-10">
          <h2 className="text-xl font-bold text-[#800000] mb-6">
            Report Complaint Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category */}
            <div>
              <label className="block font-medium mb-1">
                Category of Incident
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="">Select Category</option>
                <optgroup label="Student Behavior">
                  <option value="bullying">Bullying</option>
                  <option value="harassment">Harassment</option>
                  <option value="cheating">Cheating</option>
                  <option value="substance_use">Substance Use</option>
                  <option value="disruption">
                    Disruption of Learning Environment
                  </option>
                </optgroup>
                <optgroup label="Property">
                  <option value="vandalism">Vandalism</option>
                  <option value="theft">Theft</option>
                </optgroup>
                <optgroup label="Staff/Faculty Behavior">
                  <option value="misconduct">Misconduct</option>
                  <option value="neglect_duties">Neglect of Duties</option>
                </optgroup>
              </select>
            </div>

            {/* Location Type */}
            <div>
              <label className="block font-medium mb-1">
                Where did it happen?
              </label>
              <select
                name="locationType"
                value={formData.locationType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="" disabled select hidden>
                  Select Location
                </option>
                <option value="inside">Inside a building</option>
                <option value="outside">Outside</option>
              </select>
            </div>

            {/* Inside Building Fields */}
            {formData.locationType === "inside" && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Building</label>
                  <select
                    name="building"
                    value={formData.building}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select Building</option>
                    <option value="buildingA">Building A</option>
                    <option value="buildingB">Building B</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">Floor</label>
                  <select
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select Floor</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">Room</label>
                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Room number"
                  />
                </div>
              </div>
            )}

            {/* Outside Fields */}
            {formData.locationType === "outside" && (
              <div>
                <label className="block font-medium mb-1">
                  Nearest Building
                </label>
                <select
                  name="nearestBuilding"
                  value={formData.nearestBuilding}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select Building</option>
                  <option value="buildingA">Building A</option>
                  <option value="buildingB">Building B</option>
                </select>
              </div>
            )}

            {/* Date & Time */}
            <div>
              <label className="block font-medium mb-1">
                Date and Time of Incident
              </label>
              <input
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-1">
                Description of Incident
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 h-24"
                placeholder="Describe what happened..."
                required
              />
            </div>

            {/* Knows Accused */}
            <div>
              <label className="block font-medium mb-1">
                Do you know the accused name(s)?
              </label>
              <select
                name="knowsAccused"
                value={formData.knowsAccused}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="" disabled select hidden>
                  Select
                </option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Accused Names (if Yes) */}
            {formData.knowsAccused === "yes" && (
              <div>
                <label className="block font-medium mb-1">
                  Accused Name(s)
                </label>
                <input
                  type="text"
                  name="accusedNames"
                  value={formData.accusedNames}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter accused name(s)"
                />
              </div>
            )}

            {/* Accused Appearance (if No) */}
            {formData.knowsAccused === "no" && (
              <div>
                <label className="block font-medium mb-1">
                  Describe the Accused Appearance (Optional)
                </label>
                <textarea
                  name="accusedAppearance"
                  value={formData.accusedAppearance}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                  placeholder="e.g., height, clothing, distinguishing features..."
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="bg-[#800000] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#600000] transition-colors"
              >
                Submit Complaint
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="ml-4 bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
    </>
  );
};

export default NormalUserDashboard;
