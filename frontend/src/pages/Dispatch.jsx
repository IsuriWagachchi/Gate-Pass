import React from "react";

const Dispatch = () => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left">
        Dispatch
      </h2>
      <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
        <table className="w-full bg-white border rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-4 border text-left">Ref.No</th>
                <th className="py-3 px-4 border text-left">Name</th>
                <th className="py-3 px-4 border text-left">Mobile No</th>                
                <th className="py-3 px-4 border text-left">In Location</th>
                <th className="py-3 px-4 border text-left">Out Location</th>
                <th className="py-3 px-4 border text-left">Created Date Time</th>       
                <th className="py-3 px-4 border text-left">Full Details</th>
              </tr>
            </thead>
            <tbody>
                <tr className="bg-gray-100">
                  <td className="py-2 px-4 border text-left">324544</td>
                  <td className="py-2 px-4 border text-left">Dasun Shanaka</td>
                  <td className="py-2 px-4 border text-left">071 02 56 930</td>
                  <td className="py-2 px-4 border text-left">Colombo</td>
                  <td className="py-2 px-4 border text-left">Kurunagala</td>
                  <td className="py-2 px-4 border text-left">2023-02-22 16:30:34</td>
                  <td className="py-2 px-4 border text-center">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded transition-all duration-200"
                    >
                      View
                    </button>
                  </td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dispatch;
