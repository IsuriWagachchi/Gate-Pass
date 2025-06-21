import axios from "axios";
import { useEffect, useState } from "react";
import { downloadPDF } from "../utils/requestPdfGenerator.js";

const AdminRequestHistory = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequestHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/requests/all", {
          headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching request history:", error);
      }
    };

    fetchRequestHistory();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">Request History</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-blue-100">
            <tr>
              <th className="border px-4 py-2">Request ID</th>
              <th className="border px-4 py-2">Sender</th>
              <th className="border px-4 py-2">Out Location</th>
              <th className="border px-4 py-2">In Location</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td className="border px-4 py-2">{req._id}</td>
                <td className="border px-4 py-2">{req.sender_name}</td>
                <td className="border px-4 py-2">{req.outLocation}</td>
                <td className="border px-4 py-2">{req.inLocation}</td>
                <td className="border px-4 py-2">
                  {new Date(req.createdAt).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => downloadPDF(req)}
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRequestHistory;