import { useState } from "react";
import { Camera, MapPin, FileText, AlertTriangle } from "lucide-react";
import api from "../config/axios";

const FacilityReportForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    locationScope: "",
    building: "",
    floor: "",
    room: "",
    zone: "",
    specificLocation: "",
    description: "",
    severity: "",
    isHazardous: null,
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

      // Dummy API endpoint - replace with actual endpoint when available
      await api.post("/facilities/create", submitData);

      setSubmitStatus("success");
      setFormData({
        category: "",
        locationScope: "",
        building: "",
        floor: "",
        room: "",
        zone: "",
        specificLocation: "",
        incidentDate: "",
        incidentTime: "",
        description: "",
        severity: "",
        isHazardous: null,
        evidence: null,
        declaration: false,
      });
    } catch (error) {
      console.error("Error submitting facility report:", error);
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

  const categories = [
    { value: "F_BROKEN", label: "Broken Infrastructure" },
    { value: "F_ELECTRICAL", label: "Electrical Issue" },
    { value: "F_PLUMBING", label: "Plumbing Issue" },
    { value: "F_HVAC", label: "HVAC/AC Issue" },
    { value: "F_LIGHTING", label: "Lighting Issue" },
    { value: "F_FURNITURE", label: "Furniture Damage" },
    { value: "F_PAVEMENT", label: "Pavement/Road Damage" },
    { value: "F_SECURITY", label: "Security Feature Issue" },
    { value: "F_OTHER", label: "Other" },
  ];

  const severities = [
    { value: "low", label: "Minor" },
    { value: "medium", label: "Moderate " },
    { value: "high", label: "Severe" }
  ];

  return (
    <form onSubmit={handleSubmit} className="p-8 lg:p-12">
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
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
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
            Where did it happen? <span className="text-red-500">*</span>
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
              />
            </div>
          </div>
        )}

        {/* Conditional: Outside */}
        {formData.locationScope === "outside" && (
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

      {/* Incident Details Section */}
      <div className="mb-10">
        <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-3">
          <FileText size={24} className="text-[#4A1D1D]" />
          Incident Details
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              Description of Issue <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please provide details about the facility issue including: what is damaged, how it happened, when you noticed it, and any other relevant information."
              rows={6}
              className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              Severity <span className="text-red-500">*</span>
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            >
              <option value="">Select severity level</option>
              {severities.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Hazard Flag */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              Is this hazardous? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isHazardous: true }))
                }
                className={`px-6 py-3 text-lg border rounded-lg transition-colors ${
                  formData.isHazardous === true
                    ? "bg-red-100 border-red-500 text-red-800"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Yes, it's hazardous
                </span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isHazardous: false }))
                }
                className={`px-6 py-3 text-lg border rounded-lg transition-colors ${
                  formData.isHazardous === false
                    ? "bg-green-100 border-green-500 text-green-800"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                No, not hazardous
              </button>
            </div>
            {formData.isHazardous === true && (
              <p className="mt-2 text-sm text-red-600">
                ⚠️ Please contact facility management immediately for urgent
                issues.
              </p>
            )}
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
            id="facilityEvidence"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="facilityEvidence" className="cursor-pointer">
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
            Review & Submit Facility Report
          </>
        )}
      </button>

      {/* Status Message */}
      {submitStatus === "success" && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg">
          <p className="text-green-700 font-medium text-center">
            ✓ Facility report submitted successfully! You can track it in the
            "Track Report" tab.
          </p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg">
          <p className="text-red-700 font-medium text-center">
            ✗ Failed to submit facility report. Please try again later.
          </p>
        </div>
      )}
    </form>
  );
};

export default FacilityReportForm;
