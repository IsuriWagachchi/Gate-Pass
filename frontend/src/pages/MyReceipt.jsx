import React from 'react'

const MyReceipt = () => {

  const data = [
    {
      refNo: "3423455",
      name: "Dasun Shanaka",
      mobile: "071 65 56 350",
      inLocation: "Colombo",
      outLocation: "Kurunegala",
      createdDateTime: "2025-02-22 16:30:34",
    },
    {
      refNo: "3424677",
      name: "Nimal Kumara",
      mobile: "071 02 26 930",
      inLocation: "Galle",
      outLocation: "Kurunegala",
      createdDateTime: "2024-08-14 15:34:56",
    },
    {
      refNo: "3423875",
      name: "Amara Disanayake",
      mobile: "071 67 45 098",
      inLocation: "Colombo",
      outLocation: "Kurunegala",
      createdDateTime: "2023-09-20 09:24:43",
    },
  ];

  return (
    <div className="container mx-auto p-6 border-4 border-blue-200 rounded-lg shadow-lg bg-white w-full mt-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left">
        My Receipts
      </h2>
      <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
        <table className="w-full min-w-max border-collapse border rounded-lg shadow-lg">
            <thead>
              <tr className="bg-[#2A6BAC] text-white">
                <th className="py-3 px-4 border text-left">Ref.No</th>
                <th className="py-3 px-4 border text-left">Name</th>
                <th className="py-3 px-4 border text-left">Created Date Time</th>       
                <th className="py-3 px-4 border text-center">Full Details</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                  <td className="py-2 px-4 border text-left">{item.refNo}</td>
                  <td className="py-2 px-4 border text-left">{item.name}</td>
                  <td className="py-2 px-4 border text-left">{item.createdDateTime}</td>
                  <td className="py-2 px-4 border text-center">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded mr-2"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyReceipt