import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadPDF = (request) => {
  const doc = new jsPDF();
  let y = 30;

  const drawFooter = () => {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
    }
  };

  const addPageIfNeeded = (heightNeeded = 20) => {
    const pageHeight = doc.internal.pageSize.height;
    if (y + heightNeeded >= pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  };

  const sectionTitle = (title) => {
    addPageIfNeeded();
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(40, 64, 122);
    doc.text(title, 15, y);
    y += 3;
    doc.setDrawColor(40, 64, 122);
    doc.setLineWidth(0.5);
    doc.line(15, y, 195, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
  };

  const addRow = (label, value) => {
    if (!value || value === "N/A") return;
    addPageIfNeeded();
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 15, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${value}`, 60, y);
    y += 6;
  };

  // Draw first page
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Request Summary Report", 105, 25, null, null, "center");
  y = 35;

  // Sections
  if (request._id) {
    sectionTitle("Request Information");
    addRow("Request ID", request._id);
    addRow("Created At", new Date(request.createdAt).toLocaleString());
    addRow("Updated At", new Date(request.updatedAt).toLocaleString());
  }

  sectionTitle("Sender Details");
  addRow("Name", request.sender_name);
  addRow("Designation", request.designation);
  addRow("Service No", request.service_no);
  addRow("Section", request.section);
  addRow("Group No", request.group_number);
  addRow("Contact", request.contact_number);

  sectionTitle("Receiver Details");
  addRow("Name", request.receiverName);
  addRow("Group", request.receiverGroup);
  addRow("Service No", request.receiverServiceNumber);
  addRow("Contact", request.receiverContact);

  sectionTitle("Location Information");
  addRow("Out Location", request.outLocation);
  addRow("In Location", request.inLocation);

  sectionTitle("Transport Method");
  if (request.vehicleNumber && request.vehicleNumber !== "N/A") {
    addRow("Vehicle Number", request.vehicleNumber);
  } else {
    addRow("By Hand", request.byHand);
  }

  sectionTitle("Executive Status");
  addRow("Status", request.status);
  addRow("Verify", request.verify);
  addRow("Executive Comment", request.executiveComment);

  sectionTitle("Dispatch - Out Location");
  addRow("Status", request.dispatchStatusOut);
  addRow("Employee Type", request.employeeTypeOut);
  if (request.employeeTypeOut === "SLT") {
    addRow("Approver Name", request.approverNameOut);
    addRow("Service No", request.serviceNoOut);
    addRow("Comment", request.commentOut);
  } else if (request.employeeTypeOut === "NON-SLT") {
    addRow("Name", request.nonSltNameOut);
    addRow("NIC", request.nicNumberOut);
    addRow("Company", request.companyNameOut);
  }

  sectionTitle("Dispatch - In Location");
  addRow("Status", request.dispatchStatusIn);
  addRow("Employee Type", request.employeeTypeIn);
  if (request.employeeTypeIn === "SLT") {
    addRow("Approver Name", request.approverNameIn);
    addRow("Service No", request.serviceNoIn);
    addRow("Comment", request.commentIn);
  } else if (request.employeeTypeIn === "NON-SLT") {
    addRow("Name", request.nonSltNameIn);
    addRow("NIC", request.nicNumberIn);
    addRow("Company", request.companyNameIn);
  }

  // Assigned Officer
  sectionTitle("Assigned Officer");
  const hasAssignedOfficer =
    (request.assignedOfficerName && request.assignedOfficerName !== "N/A") ||
    (request.assignedOfficerServiceNo && request.assignedOfficerServiceNo !== "N/A") ||
    (request.assignedAt && request.assignedAt !== "N/A");

  if (hasAssignedOfficer) {
    addRow("Name", request.assignedOfficerName);
    addRow("Service No", request.assignedOfficerServiceNo);

    if (request.assignedAt && request.assignedAt !== "N/A") {
      const date = new Date(request.assignedAt).toLocaleString();
      addRow("Assigned At", date);
    }
  } else {
    doc.setFont("helvetica", "normal");
    doc.text("No assigned officer", 15, y);
    y += 6;
  }

  // Items List
  sectionTitle("Items List");
  if (request.items?.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [["#", "Item Name", "Quantity"]],
      body: request.items.map((item, index) => [
        index + 1,
        item.itemName || "Unknown",
        item.quantity || "N/A",
      ]),
      theme: "grid",
      headStyles: { fillColor: [40, 64, 122] },
      margin: { left: 15, right: 15 },
    });
    y = doc.lastAutoTable.finalY + 10;
  } else {
    doc.text("No items listed", 15, y);
    y += 6;
  }

  // Returned Items
  sectionTitle("Returned Items");

  if (request.returnedItems?.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [["#", "Item Name", "Returned Quantity"]],
      body: request.returnedItems.map((item, index) => [
        index + 1,
        item.item?.itemName || "Unknown",
        item.returnQuantity || "N/A",
      ]),
      theme: "grid",
      headStyles: { fillColor: [40, 64, 122] },
      margin: { left: 15, right: 15 },
    });

    y = doc.lastAutoTable.finalY + 10;
  } else {
    doc.text("No returned items", 15, y);
    y += 6;
  }

  // Footer on all pages
  drawFooter();

  // Open and download the PDF
  doc.setProperties({
    title: `Request Summary Report - ${request._id}`,
    subject: "Request Summary",
  });
  window.open(doc.output("bloburl"), "_blank");

};
