import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import laptopImage from "../assets/laptop.jpg";
import companylogo from "../assets/companylogo.png";
import { jsPDF } from "jspdf";

// Added this format function - ONLY CHANGE
const formatReferenceNumber = (id, createdAt) => {
  if (!id) return 'XXXXXX-XXXX';
  const date = createdAt ? new Date(createdAt) : new Date();
  const dateStr = [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0')
  ].join('');
  const uniquePart = id.slice(-4).toUpperCase();
  return `${dateStr}-${uniquePart}`;
};

const DispatchView = () => {
  const [request, setRequest] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // State for approval form
  const [dispatchStatusOut, setDispatchStatusOut] = useState("");
  const [approverNameOut, setApproverNameOut] = useState("");
  const [serviceNoOut, setServiceNoOut] = useState("");
  const [commentOut, setCommentOut] = useState("");
  const [employeeTypeOut, setEmployeeTypeOut] = useState("SLT");
  const [nonSltNameOut, setNonSltNameOut] = useState("");
  const [nicNumberOut, setNicNumberOut] = useState("");
  const [companyNameOut, setCompanyNameOut] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/dispatch/getDispatchById/${id}`
      );
      const requestData = response.data;
      setRequest(requestData);
      setDispatchStatusOut(requestData.dispatchStatusOut || "Pending");
      setError(null);
    } catch (error) {
      console.error("Error fetching request details:", error);
      setError(error.response?.data?.message || "Failed to load request details");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    if (!request) return;

    const doc = new jsPDF();
    
    try {
      const response = await fetch(companylogo);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      reader.onloadend = function() {
        const logoDataUrl = reader.result;
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        doc.addImage(logoDataUrl, 'PNG', 80, 10, 50, 20);

        doc.setFontSize(18);
        doc.text("DISPATCH DETAILS", 105, 40, { align: "center" });

        // Changed this line for reference number format
        doc.text(`Reference: ${formatReferenceNumber(request._id, request.createdAt)}`, 105, 50, { align: "center" });

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Request Information", 14, 65);
        doc.setFont("helvetica", "normal");
        
        doc.text(`Status: ${request.dispatchStatusOut || "Pending"}`, 14, 75);
        doc.text(`Requested by: ${request.sender_name || "N/A"}`, 14, 85);
        doc.text(`Service No: ${request.service_no || "N/A"}`, 105, 85);
        doc.text(`Designation: ${request.designation || "N/A"}`, 14, 95);
        doc.text(`Contact: ${request.contact_number || "N/A"}`, 105, 95);
        doc.text(`Out Location: ${request.outLocation || "N/A"}`, 14, 105);
        doc.text(`In Location: ${request.inLocation || "N/A"}`, 105, 105);
        doc.text(`By Hand: ${request.byHand || "No"}`, 14, 115);
        doc.text(`Vehicle No: ${request.vehicleNumber || "N/A"}`, 105, 115);
        doc.text(`Approved By: ${request.executiveOfficer || "N/A"}`, 14, 125);

        if (request.dispatchStatusOut && request.dispatchStatusOut !== "Pending") {
          doc.setFont("helvetica", "bold");
          doc.text("Dispatch Approval Details", 14, 140);
          doc.setFont("helvetica", "normal");
          
          doc.text(`Status: ${request.dispatchStatusOut}`, 14, 150);
          doc.text(`Processed By: ${request.approverNameOut || request.nonSltNameOut || "N/A"}`, 14, 160);
          doc.text(`Employee Type: ${request.employeeTypeOut || "N/A"}`, 105, 160);
          
          if (request.employeeTypeOut === "SLT") {
            doc.text(`Service No: ${request.serviceNoOut || "N/A"}`, 14, 170);
          } else if (request.employeeTypeOut === "Non-SLT") {
            doc.text(`NIC No: ${request.nicNumberOut || "N/A"}`, 14, 170);
            doc.text(`Company: ${request.companyNameOut || "N/A"}`, 105, 170);
          }
          
          doc.text(`Comment: ${request.commentOut || "N/A"}`, 14, 180);
        }

        doc.setFont("helvetica", "bold");
        doc.text(`Items (${request.items?.length || 0})`, 14, 195);
        doc.setFont("helvetica", "normal");

        let yPosition = 205;
        
        request.items?.forEach((item, index) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFont("helvetica", "bold");
          doc.text(`Item #${index + 1}`, 14, yPosition);
          doc.text(`Ref: ${item.serialNo || "N/A"}`, 180, yPosition, { align: "right" });
          yPosition += 5;

          doc.setFont("helvetica", "normal");
          doc.text(`Name: ${item.itemName || "N/A"}`, 14, yPosition);
          doc.text(`Category: ${item.category || "N/A"}`, 105, yPosition);
          yPosition += 7;

          doc.text(`Quantity: ${item.quantity || "N/A"}`, 14, yPosition);
          doc.text(`Returnable: ${item.returnable || "N/A"}`, 105, yPosition);
          yPosition += 7;

          doc.text(`Description: ${item.description || "N/A"}`, 14, yPosition);
          yPosition += 10;
        });

        doc.setFont("helvetica", "bold");
        doc.text("Receiver Details", 14, yPosition);
        yPosition += 7;
        
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${request.receiverName || "N/A"}`, 14, yPosition);
        doc.text(`Contact: ${request.receiverContact || "N/A"}`, 105, yPosition);
        yPosition += 7;

        doc.text(`Service No: ${request.receiverServiceNumber || "N/A"}`, 14, yPosition);
        doc.text(`Group: ${request.receiverGroup || "N/A"}`, 105, yPosition);
        yPosition += 7;

        doc.text(`Created At: ${request.createdAt ? new Date(request.createdAt).toLocaleString() : "N/A"}`, 14, yPosition);

        doc.save(`dispatch-details-${id}.pdf`);
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      generatePdfWithoutLogo(doc);
    }
  };

  const generatePdfWithoutLogo = (doc) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(18);
    doc.text("DISPATCH DETAILS", 105, 15, { align: "center" });

    // Changed this line for reference number format
    doc.text(`Reference: ${formatReferenceNumber(request._id, request.createdAt)}`, 105, 25, { align: "center" });

    doc.save(`dispatch-details-${id}.pdf`);
  };

  const handleUpdateStatus = async (newStatus) => {
    if (newStatus === "Rejected" && !commentOut.trim()) {
      alert("Comment is required for rejection!");
      return;
    }

    try {
      const payload = {
        dispatchStatusOut: newStatus,
        employeeTypeOut,
        commentOut,
      };
    
      if (employeeTypeOut === "SLT") {
        payload.approverNameOut = approverNameOut;
        payload.serviceNoOut = serviceNoOut;
        if (!approverNameOut.trim() || !serviceNoOut.trim()) {
          alert("Name and Service Number are required!");
          return;
        }
      } else if (employeeTypeOut === "Non-SLT") {
        payload.nonSltNameOut = nonSltNameOut;
        payload.nicNumberOut = nicNumberOut;
        payload.companyNameOut = companyNameOut;
        if (!nonSltNameOut.trim() || !nicNumberOut.trim() || !companyNameOut.trim()) {
          alert("Name, NIC Number and Company name are required!");
          return;
        }
      }
    
      await axios.put(`http://localhost:5000/api/dispatch/updateApprovalOut/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    
      setDispatchStatusOut(newStatus);
      alert(`Request ${newStatus} successfully!`);
      fetchRequestDetails();
    } catch (error) {
      console.error(`Error updating status:`, error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    }    
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 font-sans flex justify-center">
        <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-5xl mt-6">
          <p className="text-center">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 font-sans flex justify-center">
        <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-5xl mt-6">
          <p className="text-red-500 text-center">{error}</p>
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => navigate(-1)} 
              className="text-blue-500 hover:underline"
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
        <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-5xl mt-6">
          <p className="text-center">No request data found.</p>
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => navigate(-1)} 
              className="text-blue-500 hover:underline"
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
      <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-5xl mt-6">
        <div className="flex justify-between items-center mb-4 text-blue-700 font-bold text-lg">
          <h2>
            Dispatch Out Location Details ➝{" "}
            <span
              className={`${
                dispatchStatusOut === "Approved"
                  ? "text-green-600"
                  : dispatchStatusOut === "Pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {dispatchStatusOut}
            </span>
          </h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={downloadPdf}
              className="bg-[#2A6BAC] text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Download PDF
            </button>
            <button
              onClick={() => navigate(-1)}
              className="text-blue-500 hover:underline"
            >
              ← Back
            </button>
          </div>
        </div>

        <div className="p-3 rounded-lg shadow-md border border-gray-300">
          <div className="bg-[#2A6BAC] text-white px-4 py-2 rounded-t-md flex justify-between font-bold">
            <span>Dispatch Details</span>
            {/* Changed this line for reference number format */}
            <span>Ref. No: {formatReferenceNumber(request._id, request.createdAt)}</span>
          </div>

          <div className="p-3 bg-white rounded-b-md border border-gray-300">
            <div className="lg:flex flex-col lg:flex-row justify-between items-start space-y-6 lg:space-y-0 lg:space-x-6">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3 mt-4">
                  Sender Details
                </h4>
                <p className="text-lg font-medium mb-1">
                  Name:{" "}
                  <span className="font-normal">{request.sender_name}</span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Designation:{" "}
                  <span className="font-normal">{request.designation}</span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Service Number:{" "}
                  <span className="font-normal">{request.service_no}</span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Contact Number:{" "}
                  <span className="font-normal">{request.contact_number}</span>
                </p>

                <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 my-4 mt-8">
                  Request Details
                </h4>
                <p className="text-lg font-medium mb-1">
                  Out Location:{" "}
                  <span className="font-normal">{request.outLocation}</span>
                </p>
                <p className="text-lg font-medium mb-1">
                  In Location:{" "}
                  <span className="font-normal">{request.inLocation}</span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Approved By:{" "}
                  <span className="font-normal">
                    {request.executiveOfficer}
                  </span>
                </p>
                <p className="text-lg font-medium mb-1">
                  By Hand:{" "}
                  <span className="font-normal">{request.byHand || "No"}</span>
                </p>
                {request.vehicleNumber && (
                  <p className="text-lg font-medium mb-1">
                    Vehicle Number:{" "}
                    <span className="font-normal">{request.vehicleNumber}</span>
                  </p>
                )}
                <br />
                {request.dispatchStatusOut !== "Pending" && (
                  <>
                    <p className="text-lg font-medium mb-1">
                      Dispatch Out Location Status:{" "}
                      <span
                        className={`px-3 py-2 rounded ${
                          request.dispatchStatusOut === "Approved"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {request.dispatchStatusOut}
                      </span>
                    </p>
                    <p className="text-lg font-medium mb-1">
                      Employee Type:{" "}
                      <span className="font-normal">
                        {request.employeeTypeOut}
                      </span>
                    </p>
                    <p className="text-lg font-medium mb-1">
                      Processed By:{" "}
                      <span className="font-normal">
                        {request.approverNameOut || request.nonSltNameOut}
                      </span>
                    </p>
                    {request.employeeTypeOut === "SLT" && (
                      <>
                        <p className="text-lg font-medium mb-1">
                          Service No:{" "}
                          <span className="font-normal">{request.serviceNoOut}</span>
                        </p>
                      </>
                    )}
                    {request.employeeTypeOut === "Non-SLT" && (
                      <>
                        <p className="text-lg font-medium mb-1">
                          NIC Number:{" "}
                          <span className="font-normal">{request.nicNumberOut}</span>
                        </p>
                        <p className="text-lg font-medium mb-1">
                          Company Name:{" "}
                          <span className="font-normal">{request.companyNameOut}</span>
                        </p>
                      </>
                    )}
                    {request.commentOut && (
                      <p className="text-lg font-medium mb-1">
                        Comment:{" "}
                        <span className="font-normal">
                          {request.commentOut || "N/A"}
                        </span>
                      </p>
                    )}
                  </>
                )}

                <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mt-8 mb-3">
                  Receiver Details
                </h4>
                <p className="text-lg font-medium mb-1">
                  Name:{" "}
                  <span className="font-normal">
                    {request.receiverName
                      ? request.receiverName[0].toUpperCase() +
                        request.receiverName.slice(1)
                      : "N/A"}
                  </span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Contact Number:{" "}
                  <span className="font-normal">
                    {request.receiverContact || "N/A"}
                  </span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Service Number:{" "}
                  <span className="font-normal">
                    {request.receiverServiceNumber || "N/A"}
                  </span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Receiver Group:{" "}
                  <span className="font-normal">
                    {request.receiverGroup || "N/A"}
                  </span>
                </p>
              </div>

              <div className="flex-1">
                {request.items && request.items.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3 mt-4">
                      Item Details
                    </h4>
                    <div className="space-y-3">
                      {request.items.map((item, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition"
                        >
                          <p>
                            <span className="text-lg font-medium">Name:</span> {item.itemName}
                          </p>
                          <p>
                            <span className="text-lg font-medium">Serial No:</span> {item.serialNo}
                          </p>
                          <p>
                            <span className="text-lg font-medium">Category:</span> {item.category}
                          </p>
                          <p>
                            <span className="text-lg font-medium">Quantity:</span> {item.quantity}
                          </p>
                          <p>
                            <span className="text-lg font-medium">Returnable:</span> {item.returnable}
                          </p>
                          <p>
                            <span className="text-lg font-medium">Description:</span>{" "}
                            {item.description || "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-start mt-6">
                  <div className="flex flex-col items-center">
                    <img
                      src={laptopImage}
                      alt="Item"
                      className="w-24 h-24 object-cover border rounded-lg shadow-md"
                    />
                    <button className="bg-[#2A6BAC] text-white px-4 py-1 mt-2 rounded-lg shadow-md">
                      View Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {dispatchStatusOut === "Pending" && (
            <>
              <label className="block font-bold mb-2 text-blue-700 mt-5">
                Employee Type
              </label>
              <div className="flex gap-6 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="employeeType"
                    value="SLT"
                    checked={employeeTypeOut === "SLT"}
                    onChange={() => setEmployeeTypeOut("SLT")}
                    className="mr-2"
                  />
                  SLT Employee
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="employeeType"
                    value="Non-SLT"
                    checked={employeeTypeOut === "Non-SLT"}
                    onChange={() => setEmployeeTypeOut("Non-SLT")}
                    className="mr-2"
                  />
                  Non-SLT Employee
                </label>
              </div>

              {employeeTypeOut === "SLT" && (
                <>
                  <label className="block font-bold mb-2 text-blue-700">
                    Processed By
                  </label>
                  <input
                    type="text"
                    value={approverNameOut}
                    onChange={(e) => setApproverNameOut(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                    placeholder="Enter Name"
                    required
                  />

                  <label className="block font-bold mb-2 text-blue-700 mt-3">
                    Service Number
                  </label>
                  <input
                    type="text"
                    value={serviceNoOut}
                    onChange={(e) => setServiceNoOut(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                    placeholder="Enter Service Number"
                    required
                  />
                </>
              )}

              {employeeTypeOut === "Non-SLT" && (
                <>
                  <label className="block font-bold mb-2 text-blue-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={nonSltNameOut}
                    onChange={(e) => setNonSltNameOut(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                    placeholder="Enter Full Name"
                    required
                  />

                  <label className="block font-bold mb-2 text-blue-700 mt-3">
                    NIC Number
                  </label>
                  <input
                    type="text"
                    value={nicNumberOut}
                    onChange={(e) => setNicNumberOut(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                    placeholder="Enter NIC Number"
                    required
                  />

                  <label className="block font-bold mb-2 text-blue-700 mt-3">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyNameOut}
                    onChange={(e) => setCompanyNameOut(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                    placeholder="Enter Company Name"
                    required
                  />
                </>
              )}

              <label className="block font-bold mb-2 text-blue-700 mt-3">
                Comment
              </label>
              <textarea
                value={commentOut}
                onChange={(e) => setCommentOut(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Enter Comment Here"
              ></textarea>

              <div className="flex justify-between mt-4">
                <div className="flex space-x-2">
                  <button
                    className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md"
                    onClick={() => handleUpdateStatus("Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-700 text-white px-8 py-2 rounded-lg shadow-md"
                    onClick={() => handleUpdateStatus("Rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DispatchView;