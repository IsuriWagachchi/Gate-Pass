import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const ViewPatrolRequest = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [request, setRequest] = useState(location.state?.request || null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!location.state?.request) {
      const fetchRequest = async () => {
        try {
          const token = localStorage.getItem('token'); 
          const response = await axios.get(`http://localhost:5000/api/patrol-leader/${id}`, {
            headers: {
              Authorization: `Bearer ${token}` 
            }
          });
          setRequest(response.data);
        } catch (error) {
          console.error("Error fetching request details:", error);
        }
      };
      fetchRequest();
    }
  }, [id, location.state]);

  if (!request) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="container mx-auto p-6 font-sans flex justify-center">
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-xl"
            >
              <FaTimes className="text-2xl" />
            </button>
            <img 
              src={selectedImage} 
              alt="Enlarged" 
              className="max-w-[80vw] max-h-[80vh]"
            />
          </div>
        </div>
      )}

      <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-3xl mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 text-blue-700 font-bold text-lg">
          <h2>Patrol Request Details</h2>
          <button onClick={() => navigate(-1)} className="text-blue-500 hover:underline">← Back</button>
        </div>

        {/* Request Information */}
        <div className="mb-6 p-3 rounded-lg shadow-md border border-gray-300">
          <div className="bg-[#2A6BAC] text-white px-4 py-2 rounded-t-md font-bold">
            Request Information
          </div>
          <div className="p-3 bg-white rounded-b-md border border-gray-300 grid grid-cols-2 gap-2">
            <p className="font-medium">Status: <span className="font-normal capitalize">{request.status}</span></p>
            <p className="font-medium">Reference No: <span className="font-normal">{request._id.slice(-6).toUpperCase()}</span></p>
            <p className="font-medium">From Location: <span className="font-normal">{request.outLocation}</span></p>
            <p className="font-medium">To Location: <span className="font-normal">{request.inLocation}</span></p>
            <p className="font-medium">Created At: <span className="font-normal">{new Date(request.createdAt).toLocaleString()}</span></p>
            <p className="font-medium">Last Updated: <span className="font-normal">{new Date(request.updatedAt).toLocaleString()}</span></p>
            <p className="font-medium">Approved By: <span className="font-normal">{request.executiveOfficer}</span></p>
          </div>
        </div>

        {/* Items List */}
        <div className="mb-6">
          <div className="bg-[#2A6BAC] text-white px-4 py-2 rounded-t-md font-bold">
            Items ({request.items.length})
          </div>
          
          {request.items.map((item, index) => (
            <div key={index} className="p-3 rounded-lg shadow-md border border-gray-300 mb-4">
              <div className="bg-gray-100 px-4 py-2 rounded-t-md font-bold text-gray-700">
                Item {index + 1}
              </div>
              <div className="p-3 bg-white rounded-b-md border border-gray-300">
                <div className="flex justify-between items-start space-x-4">
                  {/* Left Section */}
                  <div className="flex-1">
                    <p className="text-lg font-medium mb-1">Item Name: <span className="font-normal">{item.itemName}</span></p>
                    {item.serialNo && <p className="text-lg font-medium mb-1">Serial No: <span className="font-normal">{item.serialNo}</span></p>}
                    {item.category && <p className="text-lg font-medium mb-1">Category: <span className="font-normal">{item.category}</span></p>}
                    <p className="text-lg font-medium mb-1">Quantity: <span className="font-normal">{item.quantity}</span></p>
                    {item.description && <p className="text-lg font-medium mb-1">Description: <span className="font-normal">{item.description}</span></p>}
                    <p className="text-lg font-medium mb-1">By Hand: <span className="font-normal">{request.byHand ? "Yes" : "No"}</span></p>
                    {request.vehicleNumber && (
                      <p className="text-lg font-medium mb-1">
                        Vehicle Number: <span className="font-normal">{request.vehicleNumber}</span>
                      </p>
                    )}
                    {item.returnable && <p className="text-lg font-medium">Returnable: <span className="font-normal">{item.returnable}</span></p>}
                  </div>

                  {/* Right Section (Images) */}
                  {item.images && item.images.length > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="flex flex-wrap gap-2">
                        {item.images.map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={image}
                            alt={`Item ${index + 1}`}
                            className="w-24 h-24 object-cover rounded border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setSelectedImage(image)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Receiver details */}
        <div className="mb-6 p-3 rounded-lg shadow-md border border-gray-300">
          <div className="bg-[#2A6BAC] text-white px-4 py-2 rounded-t-md font-bold">
            Receiver Details
          </div>
          <div className="p-3 bg-white rounded-b-md border border-gray-300 grid grid-cols-2 gap-2">
            <p className="font-medium">Receiver Name: <span className="font-normal">{request.receiverName || 'N/A'}</span></p>
            <p className="font-medium">Receiver Contact: <span className="font-normal">{request.receiverContact || "N/A"}</span></p>
            <p className="font-medium">Receiver Group: <span className="font-normal">{request.receiverGroup || "N/A"}</span></p>
            <p className="font-medium">Service No: <span className="font-normal">{request.receiverServiceNumber || "N/A"}</span></p>
          </div>
        </div>

        {/* Additional Notes */}
        {request.additionalNotes && (
          <div className="p-3 rounded-lg shadow-md border border-gray-300">
            <div className="bg-[#2A6BAC] text-white px-4 py-2 rounded-t-md font-bold">
              Additional Notes
            </div>
            <div className="p-3 bg-white rounded-b-md border border-gray-300">
              <p className="whitespace-pre-line">{request.additionalNotes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPatrolRequest;