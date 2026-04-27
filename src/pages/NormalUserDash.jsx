import { useState } from "react";
import {
  LogOut,
  Camera,
  Paperclip,
  MapPin,
  Building,
  Clock,
  User,
  FileText,
  Users,
} from "lucide-react";
import Logout from "../components/Logout";
import api from "../config/axios";

const NormalUserDash = () => {
  const [activeTab, setActiveTab] = useState("submit");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [accusedUserObjectsList, setaccusedUserObjectsList] = useState([]);

  const [formData, setFormData] = useState({
    category: "",

    locationScope: "",
    building: "",
    floor: "",
    room: "",
    nearestBuilding: "",

    incidentDate: "",
    incidentTime: "",

    accusedIds: [],
    description: "",
    witnesses: "",
    evidence: null,
    declaration: false,
  });

  const convertEmptyStringsToNull = (data) => {
    const transformed = {};

    for (const key in data) {
      const value = data[key];

      if (value === "") {
        transformed[key] = null;
      } else if (Array.isArray(value)) {
        transformed[key] = value.length === 0 ? null : value;
      } else {
        transformed[key] = value;
      }
    }

    return transformed;
  };

  // Search for accused persons (dummy API)
  const searchUsers = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    try {
      // TODO: Replace with actual API endpoint
      // const response = await api.get(`/users/search?q=${query}`);
      // setSearchResults(response.data);

      const response = await api.get(`/users/find?query=${query}`);
      setSearchResults(response.data);

      // Dummy data for now - replace with actual API call
      // const dummyUsers = [
      //   { id: 1, name: "Juan Dela Cruz", role: "Student", department: "CCS" },
      //   {
      //     id: 2,
      //     name: "Maria Santos",
      //     role: "Faculty",
      //     department: "Engineering",
      //   },
      //   { id: 3, name: "Pedro Reyes", role: "Student", department: "Business" },
      //   { id: 4, name: "Ana Lim", role: "Staff", department: "Registrar" },
      //   { id: 5, name: "Jose Ramirez", role: "Faculty", department: "CCS" },
      //   { id: 6, name: "Lisa Chen", role: "Student", department: "Nursing" },
      // ].filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle input change for search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debounce search
    const timeoutId = setTimeout(() => {
      searchUsers(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Add selected user to accusedIds
  const addAccused = (user) => {
    if (!formData.accusedIds.includes(user.id)) {
      setFormData((prev) => ({
        ...prev,
        accusedIds: [...prev.accusedIds, user.id],
      }));

      setaccusedUserObjectsList((prev) => [...prev, user]);
    }
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  // Remove accused person
  const removeAccused = (userId) => {
    setFormData((prev) => ({
      ...prev,
      accusedIds: prev.accusedIds.filter((id) => id !== userId),
    }));

    setaccusedUserObjectsList((prev) =>
      prev.filter((user) => user.id !== userId),
    );
  };

  // Get user details by ID (for display)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, evidence: file }));
    }
  };

  //Error handling soon
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = convertEmptyStringsToNull(formData);

    try {
      const response = await api.post("/complaints/create", cleanedData);
    } catch (e) {
      console.error(e);
      console.log(e);
    }
  };

  const buildings = [
    { value: "main", label: "Main Building" },
    { value: "anex", label: "Annex Building" },
    { value: "gym", label: "Gymnasium" },
    { value: "lib", label: "Library" },
    { value: "ccs", label: "CCS Building" },
  ];

  const floors = [
    { value: "1", label: "1st Floor" },
    { value: "2", label: "2nd Floor" },
    { value: "3", label: "3rd Floor" },
    { value: "4", label: "4th Floor" },
    { value: "5", label: "5th Floor" },
  ];

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
                  Welcome, Juan Dela Cruz! 👋
                </h1>
                <p className="text-amber-400 text-lg mt-2">
                  Faculty | College of Computer Studies
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

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8 lg:p-12">
            {activeTab === "submit" && (
              <>
                {/* Report Category Section */}
                <div className="mb-10">
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-3">
                    <FileText size={24} className="text-[#4A1D1D]" />
                    Report Category <span className="text-red-500">*</span>
                  </h2>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    <optgroup label="Student Behavior">
                      <option value="harassment">Harassment</option>
                      <option value="substance-abuse">Substance Abuse</option>
                    </optgroup>
                    <optgroup label="Property">
                      <option value="vandalism">Vandalism</option>
                      <option value="theft">Theft</option>
                    </optgroup>
                  </select>
                </div>

                {/* Location Details Section */}
                <div className="mb-10">
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-3">
                    <MapPin size={24} className="text-[#4A1D1D]" />
                    Location Details <span className="text-red-500">*</span>
                  </h2>

                  <div className="mb-5">
                    <label className="block text-base font-medium text-gray-700 mb-3">
                      Where did it happen?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="locationScope"
                      value={formData.locationScope}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select location type</option>
                      <option value="inside">Inside a building</option>
                      <option value="outside">Outside</option>
                    </select>
                  </div>

                  {/* Conditional: Inside a building */}
                  {formData.locationScope === "inside" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">
                          Building <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="building"
                          value={formData.building}
                          onChange={handleChange}
                          className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select building</option>
                          {buildings.map((b) => (
                            <option key={b.value} value={b.value}>
                              {b.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">
                          Floor <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="floor"
                          value={formData.floor}
                          onChange={handleChange}
                          className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select floor</option>
                          {floors.map((f) => (
                            <option key={f.value} value={f.value}>
                              {f.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">
                          Room <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="room"
                          value={formData.room}
                          onChange={handleChange}
                          placeholder="Enter room number"
                          className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Conditional: Outside */}
                  {formData.locationScope === "outside" && (
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-3">
                        Nearest Building <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="nearestBuilding"
                        value={formData.nearestBuilding}
                        onChange={handleChange}
                        className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select nearest building</option>
                        {buildings.map((b) => (
                          <option key={b.value} value={b.value}>
                            {b.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Date & Time Section */}
                <div className="mb-10">
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-3">
                    <Clock size={24} className="text-[#4A1D1D]" />
                    Date & Time <span className="text-red-500">*</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-3">
                        Date of Incident <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="incidentDate"
                        value={formData.incidentDate}
                        onChange={handleChange}
                        className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-3">
                        Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        name="incidentTime"
                        value={formData.incidentTime}
                        onChange={handleChange}
                        className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Incident Details Section */}
                <div className="mb-10">
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-3">
                    <User size={24} className="text-[#4A1D1D]" />
                    Incident Details
                  </h2>

                  <div className="space-y-6">
                    {/* Accused Persons Search */}
                    <div className="relative">
                      <label className="block text-base font-medium text-gray-700 mb-3">
                        Accused Persons{" "}
                        <span className="text-gray-500">(Optional)</span>
                      </label>

                      {/* Search Input */}
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onFocus={() =>
                            searchQuery.length >= 2 && setShowDropdown(true)
                          }
                          placeholder="Search by name (min 2 characters)..."
                          className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                        {isSearching && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="animate-spin h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full"></div>
                          </div>
                        )}
                      </div>

                      {/* Dropdown Results */}
                      {showDropdown && searchResults.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {searchResults.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => addAccused(user)}
                              className="w-full px-4 py-3 text-left hover:bg-amber-50 flex items-center justify-between transition-colors"
                            >
                              <div>
                                <span className="font-medium text-gray-800">
                                  {user.fullName}
                                </span>
                                <span className="text-sm text-gray-500 ml-2">
                                  • {user.role}
                                </span>
                              </div>
                              <span className="text-sm text-gray-400">
                                {user.department}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* No Results Message */}
                      {showDropdown &&
                        searchQuery.length >= 2 &&
                        searchResults.length === 0 &&
                        !isSearching && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                            No users found matching "{searchQuery}"
                          </div>
                        )}
                    </div>

                    {/* Selected Accused Persons */}
                    {formData.accusedIds.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-base font-medium text-gray-700 mb-3">
                          Selected Accused Persons:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {accusedUserObjectsList.map((user) => {
                            return user ? (
                              <div
                                key={user.id}
                                className="flex items-center gap-2 px-4 py-2 bg-amber-100 border border-amber-300 rounded-full"
                              >
                                <span className="font-medium text-gray-800">
                                  {user.fullName}
                                </span>
                                <span className="text-sm text-gray-500">
                                  ({user.role})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeAccused(user.id)}
                                  className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  ×
                                </button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-3">
                        Description of Incident{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Please provide details about the incident including: what happened, when it occurred, who was involved, and any other relevant information."
                        rows={6}
                        className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-3">
                        Witnesses{" "}
                        <span className="text-gray-500">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="witnesses"
                        value={formData.witnesses}
                        onChange={handleChange}
                        placeholder="Names separated by commas"
                        className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Evidence Submission Section */}
                <div className="mb-10">
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-3">
                    <Camera size={24} className="text-[#4A1D1D]" />
                    Photo or Video Evidence
                  </h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-amber-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="evidence"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="evidence" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <Camera className="text-gray-400" size={32} />
                        </div>
                        <div>
                          <p className="text-gray-700 text-lg font-medium">
                            {formData.evidence
                              ? formData.evidence.name
                              : "Click to upload photo or video"}
                          </p>
                          <p className="text-gray-500 text-base mt-2">
                            PNG, JPG, MP4, or MOV (max 10MB)
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Declaration Checkbox */}
                <div className="mb-8">
                  <label className="flex items-start gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      name="declaration"
                      checked={formData.declaration}
                      onChange={handleChange}
                      className="mt-1 w-6 h-6 text-[#4A1D1D] border-gray-300 rounded focus:ring-amber-500"
                      required
                    />
                    <span className="text-gray-700 text-lg">
                      I declare that the information provided above is true and
                      accurate to the best of my knowledge. I understand that
                      submitting false information may result in disciplinary
                      action.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!formData.declaration}
                  className="w-full py-5 text-xl bg-[#7D5A50] hover:bg-[#6B4A40] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-3"
                >
                  <FileText size={24} />
                  Review & Submit Complaint
                </button>
              </>
            )}

            {activeTab === "facility" && (
              <div className="text-center py-16">
                <Building size={64} className="mx-auto text-gray-400 mb-6" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                  Facility Report
                </h3>
                <p className="text-gray-500 text-lg">
                  Facility reporting form coming soon.
                </p>
              </div>
            )}

            {activeTab === "track" && (
              <div className="text-center py-16">
                <FileText size={64} className="mx-auto text-gray-400 mb-6" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                  Track Report
                </h3>
                <p className="text-gray-500 text-lg">
                  Track your submitted reports here.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default NormalUserDash;
