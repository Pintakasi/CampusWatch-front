import { useState } from "react";
import { Camera, MapPin, Clock, User, FileText } from "lucide-react";
import api from "../config/axios";

const ComplaintReportForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [accusedUserObjectsList, setAccusedUserObjectsList] = useState([]);
  const [formData, setFormData] = useState({
    category: "",

    locationScope: "",
    building: "",
    floor: "",
    room: "",
    specificLocation: "",
    zone: "",

    incidentDate: "",
    incidentTime: "",

    accusedIds: [],
    accusedDescription: "",
    description: "",
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

  const searchUsers = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    try {
      const response = await api.get(`/users?query=${query}`);
      setSearchResults(response.data);
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

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Debounce search
    const timeoutId = setTimeout(() => {
      searchUsers(query);
    }, 300);

    setSearchTimeout(timeoutId);
  };

  // Store timeout ID for cleanup
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [knowsAccused, setKnowsAccused] = useState(null); // null | true | false

  // Add selected user to accusedIds
  const addAccused = (user) => {
    if (!formData.accusedIds.includes(user.id)) {
      setFormData((prev) => ({
        ...prev,
        accusedIds: [...prev.accusedIds, user.id],
      }));

      setAccusedUserObjectsList((prev) => [...prev, user]);
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

    setAccusedUserObjectsList((prev) =>
      prev.filter((user) => user.id !== userId),
    );
  };

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
    setIsSubmitting(true);
    setSubmitStatus(null);

    const cleanedData = convertEmptyStringsToNull(formData);

    try {
      const submitData = new FormData();

      submitData.append(
        "data",
        new Blob([JSON.stringify(cleanedData)], {
          type: "application/json",
        }),
      );

      if (formData.evidence) {
        submitData.append("evidence", formData.evidence);
      }

      await api.post("/complaints/create", submitData);

      // Success feedback
      setSubmitStatus("success");

      // Reset form
      setFormData({
        category: "",
        locationScope: "",
        building: "",
        floor: "",
        room: "",
        nearestBuilding: "",
        incidentDate: "",
        incidentTime: "",
        accusedIds: [],
        accusedDescription: "",
        description: "",
        evidence: null,
        declaration: false,
      });
      setKnowsAccused(null);
      setAccusedUserObjectsList([]);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
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

  const zones = [
    { value: "parking", label: "Parking Area" },
    { value: "quad", label: "Main Quadrangle" },
    { value: "garden", label: "Garden/Grounds" },
    { value: "courtyard", label: "Courtyard" },
    { value: "sports", label: "Sports Field" },
    { value: "gate", label: "Gate/Entrance" },
  ];

  return (
    <form onSubmit={handleSubmit} className="p-8 lg:p-12">
      {/* Report Category Section */}
      <div className="mb-10">
        <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-3">
          <FileText size={24} className="text-[#4A1D1D]" />
          Report Category <span className="text-red-500">*</span>
        </h2>
        <div className="relative">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white pr-12"
            required
          >
            <option value="">Select a category</option>
            <optgroup label="Student Behavior">
              <option value="HARASSMENT">Harassment</option>
              <option value="BULLYING">Bullying</option>
            </optgroup>
            <optgroup label="Property">
              <option value="VANDALISM">Vandalism</option>
              <option value="THEFT">Theft</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Location Details Section */}
      <div className="mb-10">
        <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-3">
          <MapPin size={24} className="text-[#4A1D1D]" />
          Location Details <span className="text-red-500">*</span>
        </h2>

        <div className="mb-5">
          <label className="block text-base font-medium text-gray-700 mb-3">
            Where did it happen? <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="locationScope"
              value={formData.locationScope}
              onChange={handleChange}
              className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white pr-12"
              required
            >
              <option value="">Select location type</option>
              <option value="INSIDE">Inside a building</option>
              <option value="OUTSIDE">Outside</option>
            </select>
          </div>
        </div>

        {/* Conditional: Inside a building */}
        {formData.locationScope === "INSIDE" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Building <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="building"
                  value={formData.building}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white pr-12"
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
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Floor <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white pr-12"
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
              />
            </div>
          </div>
        )}

        {/* Conditional: Outside */}
        {formData.locationScope === "OUTSIDE" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Area/Zone <span className="text-red-500">*</span>
              </label>
              <select
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              >
                <option value="">Select area/zone</option>
                {zones.map((zone) => (
                  <option key={zone.value} value={zone.value}>
                    {zone.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Specific Location
              </label>
              <input
                type="text"
                name="specificLocation"
                value={formData.specificLocation}
                onChange={handleChange}
                placeholder="e.g., Near the north entrance"
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
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
          {/* Do you know the accused person's name? */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              Do you know the reported person&apos;s name?
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setKnowsAccused(true)}
                className={`px-6 py-3 text-lg border rounded-lg transition-colors ${
                  knowsAccused === true
                    ? "bg-amber-100 border-amber-500 text-amber-800"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setKnowsAccused(false)}
                className={`px-6 py-3 text-lg border rounded-lg transition-colors ${
                  knowsAccused === false
                    ? "bg-amber-100 border-amber-500 text-amber-800"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* If knowsAccused is true, show search */}
          {knowsAccused === true && (
            <div className="relative">
              <label className="block text-base font-medium text-gray-700 mb-3">
                Reported person&apos;s name{" "}
                <span className="text-red-500">*</span>
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
          )}

          {/* Selected Accused Persons */}
          {knowsAccused === true && formData.accusedIds.length > 0 && (
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

          {/* If knowsAccused is false, show description textbox */}
          {knowsAccused === false && (
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Describe the reported person{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="accusedDescription"
                value={formData.accusedDescription}
                onChange={handleChange}
                placeholder="Please provide a description of the accused person(s) such as: physical appearance, clothing, distinguishing features, or any other identifying information."
                rows={4}
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              />
            </div>
          )}

          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              Description of Incident
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please provide details about the incident including: what happened, when it occurred, who was involved, and any other relevant information."
              rows={6}
              className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
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
            I declare that the information provided above is true and accurate
            to the best of my knowledge. I understand that submitting false
            information may result in disciplinary action.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!formData.declaration || isSubmitting}
        className="w-full py-5 text-xl bg-[#7D5A50] hover:bg-[#6B4A40] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full"></div>
            Submitting...
          </>
        ) : (
          <>
            <FileText size={24} />
            Review & Submit Complaint
          </>
        )}
      </button>

      {/* Status Message */}
      {submitStatus === "success" && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg">
          <p className="text-green-700 font-medium text-center">
            ✓ Complaint submitted successfully! You can track it in the "Track
            Report" tab.
          </p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg">
          <p className="text-red-800 font-medium text-center">
            ✗ Failed to submit complaint. Please try again later.
          </p>
        </div>
      )}
    </form>
  );
};

export default ComplaintReportForm;
