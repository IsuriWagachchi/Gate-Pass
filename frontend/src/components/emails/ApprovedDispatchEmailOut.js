export const getApprovedDispatchEmailHTMLOut = ({ outLocation, inLocation, itemDetails }) => {
  const itemRows = itemDetails.map(item => `
    <tr>
      <td style="border: 1px solid #ccc; padding: 8px;">${item.itemName}</td>
      <td style="border: 1px solid #ccc; padding: 8px;">${item.serialNo}</td>
      <td style="border: 1px solid #ccc; padding: 8px;">${item.category}</td>
      <td style="border: 1px solid #ccc; padding: 8px;">${item.quantity}</td>
      <td style="border: 1px solid #ccc; padding: 8px;">${item.returnable}</td>
    </tr>
  `).join("");

  return `
    <div>
      <h2 style="color: #2A6BAC;">New Dispatch Approved to Your Location</h2>
      <p>The following items are being dispatched <strong>from ${outLocation}</strong> to your branch <strong>${inLocation}</strong>.</p>
      <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ccc; padding: 8px;">Item Name</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Serial No</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Category</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Quantity</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Returnable</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>
      <p>Please prepare to receive them at your location.</p>
    </div>
  `;
};
