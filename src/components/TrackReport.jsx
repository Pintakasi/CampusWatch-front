import { useState, useEffect } from "react";
import api from "../config/axios";

function TrackReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null); // Track which menu is open

  useEffect(() => {
    api
      .get("/complaints")
      .then((response) => {
        const fetchedReports = response.data.map((item) => ({
          id: item.reportTicketId,
          referenceNo: item.reportTicketId,
          category: { main: item.category, sub: "" },
          status: item.status,
          dateFiled: item.createdAt,
          description: "",
          timeFiled: "",
          location: "",
          accusedPersons: null,
          accusedDescription: "",
          evidence: [],
        }));
        setReports(fetchedReports);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
        setLoading(false);
      });
  }, []);

  const handleRowClick = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleMenuClick = (e, reportId) => {
    e.stopPropagation();
    setMenuOpen(menuOpen === reportId ? null : reportId);
  };

  const handleDeleteClick = (report) => {
    setReportToDelete(report);
    setShowConfirm(true);
    setMenuOpen(null);
  };

  const confirmDelete = () => {
    // Placeholder for delete API
    // deleteReport(reportToDelete.id).then(() => { ... });
    setReports(reports.filter((r) => r.id !== reportToDelete.id));
    setShowConfirm(false);
    setReportToDelete(null);
    // Show success feedback, e.g., toast
    alert("Report deleted successfully");
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setReportToDelete(null);
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading reports...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-semibold text-gray-700 mb-3">
          No reports found
        </h3>
        <p className="text-gray-500 text-lg">
          You haven't submitted any reports yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-8">

      <div className="max-w-6xl mx-auto">
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="border-b border-red-800">
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Reference No.
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Category
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => handleRowClick(report)}
                >
                  <td className="py-4 px-6 text-sm text-gray-700">
                    {report.referenceNo}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {report.category.main}
                      </div>
                      <div className="text-gray-500">{report.category.sub}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    {report.status === "Reviewed" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Reviewed
                      </span>
                    ) : (
                      <span className="text-gray-700">{report.status}</span>
                    )}

                       {report.status === "Pending" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-200 text-orange-800">
                        Reviewed
                      </span>
                    ) : (
                      <span className="text-gray-700">{report.status}</span>
                    )}

                     {report.status === "Resolved" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                        Reviewed
                      </span>
                    ) : (
                      <span className="text-gray-700">{report.status}</span>
                    )}
                   
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">
                    {report.dateFiled}
                  </td>
                  <td className="py-4 px-6 text-sm text-right relative">
                    <button
                      className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                      onClick={(e) => handleMenuClick(e, report.id)}
                      aria-label="More actions"
                    >
                      ⋮
                    </button>
                    {menuOpen === report.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
                          onClick={() => handleDeleteClick(report)}
                        >
                          Delete Report
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Report Details</h3>
            <p>
              <strong>Category:</strong> {selectedReport.category.main}{" "}
              {selectedReport.category.sub &&
                `(${selectedReport.category.sub})`}
            </p>
            <p>
              <strong>Description:</strong> {selectedReport.description}
            </p>
            <p>
              <strong>Date Filed:</strong> {selectedReport.dateFiled} at{" "}
              {selectedReport.timeFiled}
            </p>
            <p>
              <strong>Location:</strong> {selectedReport.location}
            </p>
            <p>
              <strong>Accused Persons:</strong>{" "}
              {selectedReport.accusedPersons
                ? selectedReport.accusedPersons.join(", ")
                : selectedReport.accusedDescription}
            </p>
            <p>
              <strong>Evidence:</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedReport.evidence.map((item, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 bg-gray-200 flex items-center justify-center"
                >
                  {item.includes(".jpg") || item.includes(".png") ? (
                    <img
                      src={item}
                      alt="Evidence"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={item}
                      controls
                      className="w-full h-full"
                    ></video>
                  )}
                </div>
              ))}
            </div>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && reportToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this report?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={confirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackReport;
