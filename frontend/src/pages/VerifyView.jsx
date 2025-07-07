import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import laptopImage from '../assets/laptop.jpg';
import companylogo from "../assets/companylogo.png";
import { jsPDF } from "jspdf";

const VerifyView = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [verify, setStatus] = useState(location.state?.verify || "Pending");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/verify/${id}`);
        setRequest(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching request details:", error);
        setError(error.response?.data?.message || "Failed to load request details");
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/verify/${id}/verify`, { 
        verify: newStatus,
        comment: comment
      });
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const downloadPdf = async () => {
    if (!request) return;

    const doc = new jsPDF();
    
    // Add logo to the PDF
    try {
      // Convert logo image to base64
      const response = await fetch(companylogo);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      reader.onloadend = function() {
        const logoDataUrl = reader.result;
        
        // Set font styles
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        // Add logo (width: 50, height: auto maintains aspect ratio)
        doc.addImage(logoDataUrl, 'PNG', 80, 10, 50, 20);

        // Add title below logo
        doc.setFontSize(18);
        doc.text("ITEM VERIFICATION DETAILS", 105, 40, { align: "center" });

        // Add request information section
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Request Information", 14, 50);
        doc.setFont("helvetica", "normal");
        
        // Request information details
        doc.text(`Requested by: ${request.sender_name || "N/A"}`, 14, 60);
        doc.text(`Service No: ${request.service_no || "N/A"}`, 105, 60);
        doc.text(`From Location: ${request.outLocation || "N/A"}`, 14, 70);
        doc.text(`To Location: ${request.inLocation || "N/A"}`, 105, 70);
        doc.text(`Approved By: ${request.executiveOfficer || "N/A"}`, 14, 80);
        doc.text(`Verification Status: ${verify || "N/A"}`, 105, 80);

        // Add items section
        doc.setFont("helvetica", "bold");
        doc.text(`Items (${request.items?.length || 0})`, 14, 95);
        doc.setFont("helvetica", "normal");

        let yPosition = 105;
        
        // Add each item
        request.items?.forEach((item, index) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }

          // Item header
          doc.setFont("helvetica", "bold");
          doc.text(`Item #${index + 1}`, 14, yPosition);
          doc.text(`Ref: ${item.serialNo || "N/A"}`, 180, yPosition, { align: "right" });
          yPosition += 5;

          // Item details
          doc.setFont("helvetica", "normal");
          doc.text(`Name: ${item.itemName || "N/A"}`, 14, yPosition);
          doc.text(`Category: ${item.category || "N/A"}`, 105, yPosition);
          yPosition += 7;

          doc.text(`Quantity: ${item.quantity || "N/A"}`, 14, yPosition);
          doc.text(`Returnable: ${item.returnable || "N/A"}`, 105, yPosition);
          yPosition += 7;

          doc.text(`Description: ${item.description || "N/A"}`, 14, yPosition);
          doc.text(`By Hand: ${request.byHand || "N/A"}`, 105, yPosition);
          yPosition += 7;

          doc.text(`Vehicle Number: ${request.vehicleNumber || "N/A"}`, 14, yPosition);
          yPosition += 10;
        });

        // Add receiver details section
        doc.setFont("helvetica", "bold");
        doc.text("Receiver Details", 14, yPosition);
        yPosition += 7;
        
        doc.setFont("helvetica", "normal");
        doc.text(`Receiver Name: ${request.receiverName || "N/A"}`, 14, yPosition);
        doc.text(`Receiver Contact: ${request.receiverContact || "N/A"}`, 105, yPosition);
        yPosition += 7;

        doc.text(`Receiver Group: ${request.receiverGroup || "N/A"}`, 14, yPosition);
        doc.text(`Service No: ${request.receiverServiceNumber || "N/A"}`, 105, yPosition);
        yPosition += 7;

        // Add verification details if not pending
        if (verify !== "Pending") {
          doc.setFont("helvetica", "bold");
          doc.text("Verification Details", 14, yPosition);
          yPosition += 7;
          
          doc.setFont("helvetica", "normal");
          doc.text(`Status: ${verify}`, 14, yPosition);
          doc.text(`Comment: ${comment || "N/A"}`, 14, yPosition + 7);
          yPosition += 14;
        }

        // Add creation date
        doc.text(`Created At: ${request.createdAt ? new Date(request.createdAt).toLocaleString() : "N/A"}`, 14, yPosition);

        // Save the PDF
        doc.save(`item-verification-${id}.pdf`);
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback PDF without logo if there's an error
      generatePdfWithoutLogo(doc);
    }
  };

  // Fallback PDF generation without logo
  const generatePdfWithoutLogo = (doc) => {
    // Set font styles
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    // Add title
    doc.setFontSize(18);
    doc.text("ITEM VERIFICATION DETAILS", 105, 15, { align: "center" });

    // Rest of the PDF content (same as before)
    // Add request information section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Request Information", 14, 25);
    doc.setFont("helvetica", "normal");
    
    // Request information details
    doc.text(`Requested by: ${request.sender_name || "N/A"}`, 14, 35);
    doc.text(`Service No: ${request.service_no || "N/A"}`, 105, 35);
    doc.text(`From Location: ${request.outLocation || "N/A"}`, 14, 45);
    doc.text(`To Location: ${request.inLocation || "N/A"}`, 105, 45);
    doc.text(`Approved By: ${request.executiveOfficer || "N/A"}`, 14, 55);
    doc.text(`Verification Status: ${verify || "N/A"}`, 105, 55);

    // Save the PDF
    doc.save(`item-verification-${id}.pdf`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 font-sans flex justify-center">
        <div className="bg-white border-2 border-green-500 p-6 rounded-lg shadow-lg w-full max-w-3xl mt-6">
          <p className="text-center">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 font-sans flex justify-center">
        <div className="bg-white border-2 border-green-500 p-6 rounded-lg shadow-lg w-full max-w-3xl mt-6">
          <p className="text-red-500 text-center">{error}</p>
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => navigate(-1)} 
              className="text-green-500 hover:underline"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto p-6 font-sans flex justify-center">
        <div className="bg-white border-2 border-green-500 p-6 rounded-lg shadow-lg w-full max-w-3xl mt-6">
          <p className="text-center">No request data found.</p>
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => navigate(-1)} 
              className="text-green-500 hover:underline"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 font-sans flex justify-center">
      <div className="bg-white border-2 border-green-500 p-6 rounded-lg shadow-lg w-full max-w-3xl mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 text-green-700 font-bold text-lg">
          <h2>Verification View ➝ <span className="text-[#CC5500]">{verify}</span></h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={downloadPdf}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Download PDF
            </button>
            <button onClick={() => navigate(-1)} className="text-green-500 hover:underline">← Back</button>
          </div>
        </div>

        {/* Request Information */}
        <div className="mb-6 p-3 rounded-lg shadow-md border border-gray-300">
          <div className="bg-green-600 text-white px-4 py-2 rounded-t-md font-bold">
            Request Information
          </div>
          <div className="p-3 bg-white rounded-b-md border border-gray-300 grid grid-cols-2 gap-2">
            <p className="font-medium">Requested by: <span className="font-normal">{request.sender_name}</span></p>
            <p className="font-medium">Service No: <span className="font-normal">{request.service_no}</span></p>
            <p className="font-medium">From Location: <span className="font-normal">{request.outLocation}</span></p>
            <p className="font-medium">To Location: <span className="font-normal">{request.inLocation}</span></p>
            <p className="font-medium">Approved By: <span className="font-normal">{request.executiveOfficer}</span></p>
            <p className="font-medium">Verification Status: 
              <span className={`inline-block px-2 rounded ml-1 ${
                verify === "Verified" ? "bg-green-100 text-green-800" :
                verify === "Rejected" ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {verify}
              </span>
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="mb-6">
          <div className="bg-green-600 text-white px-4 py-2 rounded-t-md font-bold">
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
                    <p className="text-lg font-medium mb-1">Serial No: <span className="font-normal">{item.serialNo}</span></p>
                    <p className="text-lg font-medium mb-1">Category: <span className="font-normal">{item.category}</span></p>
                    <p className="text-lg font-medium mb-1">Quantity: <span className="font-normal">{item.quantity}</span></p>
                    <p className="text-lg font-medium mb-1">Description: <span className="font-normal">{item.description}</span></p>
                    <p className="text-lg font-medium mb-1">By Hand: <span className="font-normal">{request.byHand}</span></p>
                    <p className="text-lg font-medium mb-1">
                      Vehicle Number: <span className="font-normal">
                        {request.vehicleNumber ? request.vehicleNumber : "N/A"}
                      </span>
                    </p>
                    <p className="text-lg font-medium">Returnable: <span className="font-normal">{item.returnable}</span></p>
                  </div>

                  {/* Right Section (Image + Button) */}
                  <div className="flex flex-col items-center">
                    <img 
                      src={item.image || laptopImage} 
                      alt="Item" 
                      className="w-24 h-24 object-cover border rounded-lg shadow-md" 
                    />
                    {item.image && (
                      <button 
                        className="bg-green-600 text-white px-4 py-1 mt-2 rounded-lg shadow-md hover:bg-green-700"
                        onClick={() => window.open(item.image, '_blank')}
                      >
                        View Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Receiver details */}
        <div className="mb-6 p-3 rounded-lg shadow-md border border-gray-300">
          <div className="bg-green-600 text-white px-4 py-2 rounded-t-md font-bold">
            Receiver Details
          </div>
          <div className="p-3 bg-white rounded-b-md border border-gray-300 grid grid-cols-2 gap-2">
            <p className="font-medium">Receiver Name: <span className="font-normal">{request.receiverName ? request.receiverName[0].toUpperCase() + request.receiverName.slice(1) : 'N/A'}</span></p>
            <p className="font-medium">Receiver Contact: <span className="font-normal">{request.receiverContact ? request.receiverContact: "N/A"}</span></p>
            <p className="font-medium">Receiver Group: <span className="font-normal">{request.receiverGroup ? request.receiverGroup : "N/A"}</span></p>
            <p className="font-medium">Service No: <span className="font-normal">{request.receiverServiceNumber ? request.receiverServiceNumber : "N/A"}</span></p>
          </div>
        </div>

        {/* Action Buttons */}
        {verify === "Pending" && (
          <div className="p-3 rounded-lg shadow-md border border-gray-300">
            <label className="block font-bold mb-2 text-green-700">Comment</label>
            <textarea 
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
              placeholder="Enter Comment Here"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-4 space-x-2">
              <button 
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors" 
                onClick={() => handleUpdateStatus("Verified")}
              >
                Verify
              </button>
              <button 
                className="bg-red-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-800 transition-colors" 
                onClick={() => handleUpdateStatus("Rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        )}

        {/* Verification Details (if not pending) */}
        {verify !== "Pending" && (
          <div className="p-3 rounded-lg shadow-md border border-gray-300">
            <div className="bg-green-600 text-white px-4 py-2 rounded-t-md font-bold">
              Verification Details
            </div>
            <div className="p-3 bg-white rounded-b-md border border-gray-300">
              <p className="font-medium">Status: 
                <span className={`inline-block px-2 rounded ml-1 ${
                  verify === "Verified" ? "bg-green-100 text-green-800" :
                  verify === "Rejected" ? "bg-red-100 text-red-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {verify}
                </span>
              </p>
              <p className="font-medium mt-2">Comment:</p>
              <p className="border border-gray-200 p-2 rounded bg-gray-50">{comment || "No comment provided"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyView;