import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ItemListModal from "./ItemListViewModal";
import { jsPDF } from "jspdf";
import companylogo from "../assets/companylogo.png";
import { FaFilePdf } from "react-icons/fa";

const ViewReceiver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [request, setRequest] = useState(null);

  const fetchRequest = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/requests/${id}`);
      setRequest(response.data);
    } catch (err) {
      console.error("Failed to fetch request:", err);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
        doc.text("REQUEST DETAILS", 105, 40, { align: "center" });

        doc.setFontSize(14);
        doc.setTextColor(42, 107, 172);
        doc.text(`Ref. No: ${formatReferenceNumber(request._id, request.createdAt)}`, 105, 50, { align: "center" });

        doc.setFontSize(12);
        let statusColor;
        if (request.dispatchStatusIn === 'Approved') {
          statusColor = [0, 128, 0];
        } else if (request.dispatchStatusIn === 'Rejected') {
          statusColor = [255, 0, 0];
        } else {
          statusColor = [255, 165, 0];
        }
        doc.setTextColor(...statusColor);
        doc.text(`Status: ${request.dispatchStatusIn}`, 105, 58, { align: "center" });

        doc.setTextColor(0, 0, 0);
        doc.text(`Date: ${formatDate(request.createdAt)}`, 14, 70);

        // Sender Information
        doc.setFont("helvetica", "bold");
        doc.text("Sender Information", 14, 85);
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${request.sender_name}`, 14, 95);
        doc.text(`Designation: ${request.designation}`, 14, 105);
        doc.text(`Service No: ${request.service_no}`, 14, 115);
        doc.text(`Contact No: ${request.contact_number}`, 14, 125);

        // Item List
        let yPosition = 140;
        doc.setFont("helvetica", "bold");
        doc.text("Item List", 14, yPosition);
        yPosition += 10;

        request.items?.forEach((item, index) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          doc.setFont("helvetica", "normal");
          doc.text(`${index + 1}. ${item.itemName} (Qty: ${item.quantity || 1})`, 20, yPosition);
          yPosition += 7;
        });

        // Returned Items
        if (request.returnedItems?.length > 0) {
          yPosition += 7;
          doc.setFont("helvetica", "bold");
          doc.text("Returned Items", 14, yPosition);
          yPosition += 10;

          request.returnedItems.forEach((returnedItem, index) => {
            if (yPosition > 250) {
              doc.addPage();
              yPosition = 20;
            }
            doc.setFont("helvetica", "normal");
            doc.text(`${index + 1}. ${returnedItem.item.itemName} (Qty: ${returnedItem.returnQuantity || 1})`, 20, yPosition);
            yPosition += 7;
          });
        }

        // Logistics
        yPosition += 7;
        doc.setFont("helvetica", "bold");
        doc.text("Logistics", 14, yPosition);
        yPosition += 10;
        doc.setFont("helvetica", "normal");
        doc.text(`Out Location: ${request.outLocation}`, 14, yPosition);
        doc.text(`In Location: ${request.inLocation}`, 105, yPosition);
        yPosition += 7;
        doc.text(`Executive Officer: ${request.executiveOfficer}`, 14, yPosition);
        doc.text(`Vehicle Number: ${request.vehicleNumber || "N/A"}`, 105, yPosition);
        yPosition += 7;

        // Receiver Details
        yPosition += 7;
        doc.setFont("helvetica", "bold");
        doc.text("Receiver Details", 14, yPosition);
        yPosition += 10;
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${request.receiverName}`, 14, yPosition);
        doc.text(`Contact: ${request.receiverContact}`, 105, yPosition);
        yPosition += 7;
        doc.text(`Group: ${request.receiverGroup}`, 14, yPosition);
        doc.text(`Service No: ${request.receiverServiceNumber}`, 105, yPosition);
        yPosition += 7;

        // Approver Out
        yPosition += 7;
        doc.setFont("helvetica", "bold");
        doc.text("Approved by (Out Location)", 14, yPosition);
        yPosition += 10;
        doc.setFont("helvetica", "normal");
        doc.text(`Employee Type: ${request.employeeTypeOut}`, 14, yPosition);
        doc.text(`Approver Name: ${request.approverNameOut}`, 105, yPosition);
        yPosition += 7;
        doc.text(`Service No: ${request.serviceNoOut}`, 14, yPosition);
        if (request.commentOut) {
          yPosition += 7;
          doc.text(`Comment: ${request.commentOut}`, 14, yPosition);
        }

        // Approver In
        yPosition += 10;
        doc.setFont("helvetica", "bold");
        doc.text("Approved by (In Location)", 14, yPosition);
        yPosition += 10;
        doc.setFont("helvetica", "normal");
        doc.text(`Employee Type: ${request.employeeTypeIn}`, 14, yPosition);
        doc.text(`Approver Name: ${request.approverNameIn}`, 105, yPosition);
        yPosition += 7;
        doc.text(`Service No: ${request.serviceNoIn}`, 14, yPosition);
        if (request.commentIn) {
          yPosition += 7;
          doc.text(`Comment: ${request.commentIn}`, 14, yPosition);
        }

        doc.save(`request_${formatReferenceNumber(request._id, request.createdAt)}.pdf`);
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback PDF generation without logo
      generatePdfWithoutLogo(doc);
    }
  };

  const generatePdfWithoutLogo = (doc) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(18);
    doc.text("REQUEST DETAILS", 105, 15, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(42, 107, 172);
    doc.text(`Ref. No: ${formatReferenceNumber(request._id, request.createdAt)}`, 105, 25, { align: "center" });

    doc.setFontSize(12);
    let statusColor;
    if (request.dispatchStatusIn === 'Approved') {
      statusColor = [0, 128, 0];
    } else if (request.dispatchStatusIn === 'Rejected') {
      statusColor = [255, 0, 0];
    } else {
      statusColor = [255, 165, 0];
    }
    doc.setTextColor(...statusColor);
    doc.text(`Status: ${request.dispatchStatusIn}`, 105, 33, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${formatDate(request.createdAt)}`, 14, 45);

    doc.save(`request_${formatReferenceNumber(request._id, request.createdAt)}.pdf`);
  };

  if (!request) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 font-sans flex justify-center">
      <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-5xl mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 text-blue-700 font-bold text-lg">
          <h2>
            Request Details ➝{" "}
            <span className={`${request.dispatchStatusIn === "Approved"
              ? "text-green-600"
              : request.dispatchStatusIn === "Pending"
              ? "text-yellow-600"
              : "text-red-600"
            }`}>
              {request.dispatchStatusIn}
            </span>
          </h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={downloadPdf}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <FaFilePdf /> Download PDF
            </button>
            <button onClick={() => navigate(-1)} className="text-blue-500 hover:underline">
              ← Back
            </button>
          </div>
        </div>

        {/* Request Full Details Box */}
        <div className="p-3 rounded-lg shadow-md border border-gray-300 mt-6">
          {/* Reference Number Header */}
          <div className="bg-[#2A6BAC] text-white px-4 py-2 rounded-t-md font-bold">
              Ref. No: {formatReferenceNumber(request._id, request.createdAt)}
          </div>

          <div className="p-4 space-y-6">
              {/* Sender Info */}
              <section>
              <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-2">Sender Information</h4>
              <div className="grid grid-cols-2 gap-4">
                  <p><strong>Name:</strong> {request.sender_name}</p>
                  <p><strong>Designation:</strong> {request.designation}</p>
                  <p><strong>Service No:</strong> {request.service_no}</p>
                  <p><strong>Contact No:</strong> {request.contact_number}</p>
              </div>
              </section>

              {/* Item List */}
              {request.items?.length > 0 && (
              <section>
                  <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-2">Item List</h4>
                  <ul className="list-disc list-inside ml-4">
                  {request.items.map((item, index) => (
                      <li key={index}>
                      {item.itemName} {item.quantity ? `(Qty: ${item.quantity})` : ""}
                      </li>
                  ))}
                  </ul>
                  <br/>
                  <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-2">Return Item List</h4>
                  {request.returnedItems?.length > 0 ? (
                    <ul className="list-disc list-inside ml-4">
                      {request.returnedItems.map((returnedItem, index) => (
                        <li key={index}>
                          {returnedItem.item.itemName} {returnedItem.returnQuantity ? `(Qty: ${returnedItem.returnQuantity})` : ""}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No items in returned list.</p>
                  )}
              </section>
              )}

              {/* Locations & Logistics */}
              <section>
              <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-2">Logistics</h4>
              <div className="grid grid-cols-2 gap-4">
                  <p><strong>Out Location:</strong> {request.outLocation}</p>
                  <p><strong>In Location:</strong> {request.inLocation}</p>
                  <p><strong>Executive Officer:</strong> {request.executiveOfficer}</p>
                  <p><strong>Vehicle Number:</strong> {request.vehicleNumber || "N/A"}</p>
              </div>
              </section>

              {/* Receiver Info */}
              <section>
              <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-2">Receiver Details</h4>
              <div className="grid grid-cols-2 gap-4">
                  <p><strong>Name:</strong> {request.receiverName}</p>
                  <p><strong>Contact:</strong> {request.receiverContact}</p>
                  <p><strong>Group:</strong> {request.receiverGroup}</p>
                  <p><strong>Service No:</strong> {request.receiverServiceNumber}</p>
              </div>
              </section>

              {/* Statuses */}
              <section>
              <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-2">Request Status</h4>
              <div className="grid grid-cols-3 gap-4">
                  <p><strong>Request Status:</strong> {request.verify}</p>
                  <p><strong>Dispatch Out:</strong> {request.dispatchStatusOut}</p>
                  <p><strong>Dispatch In:</strong> {request.dispatchStatusIn}</p>
              </div>
              </section>

              {/* Approver Info - Out */}
              <section>
              <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-2">Approved by (Out Location)</h4>
              <div className="grid grid-cols-3 gap-4">
                  <p><strong>Employee Type:</strong> {request.employeeTypeOut}</p>
                  <p><strong>Approver Name:</strong> {request.approverNameOut}</p>
                  <p><strong>Service No:</strong> {request.serviceNoOut}</p>
                  {request.commentOut && <p><strong>Comment:</strong> {request.commentOut}</p>}
              </div>
              </section>

              {/* Approver Info - In */}
              <section>
              <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-2">Approved by (In Location)</h4>
              <div className="grid grid-cols-3 gap-4">
                  <p><strong>Employee Type:</strong> {request.employeeTypeIn}</p>
                  <p><strong>Approver Name:</strong> {request.approverNameIn}</p>
                  <p><strong>Service No:</strong> {request.serviceNoIn}</p>
                  {request.commentIn && <p><strong>Comment:</strong> {request.commentIn}</p>}
              </div>
              </section>

              <br/>
              <button
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setShowModal(true)}
              >
              Return Items
              </button>

              {showModal && (
              <ItemListModal
                  id={id}
                  onClose={() => { setShowModal(false); fetchRequest(); }}
              />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReceiver;