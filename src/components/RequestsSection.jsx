import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { Home, Calendar, User } from 'lucide-react';
import Select from 'react-select';
import { useLocation } from 'react-router-dom';

const statusOptions = [
  // { value: 'pending', label: '⏳ Pending' },
  { value: 'approved', label: '✅ Approved' },
  { value: 'rejected', label: '❌ Rejected' },
];

const RequestsSection = () => {
  const [requests, setRequests] = useState([]);
  const location = useLocation();

  // Scroll to this section if URL contains #requests
  useEffect(() => {
    const scrollToSection = () => {
      if (location.hash === '#requests') {
        const element = document.getElementById('requests');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    const timeout = setTimeout(scrollToSection, 300); // Delay to ensure render
    return () => clearTimeout(timeout);
  }, [location]);

  // Fetch bookings
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get('/v1/bookings/my-bookings', {
          withCredentials: true,
        });
        setRequests(res.data.data.bookings || []);
      } catch (err) {
        toast.error('Failed to fetch booking requests');
      }
    };

    fetchRequests();
  }, []);

  // const handleRequestAction = async (id, status) => {
  //   try {
  //     await API.patch(`/v1/bookings/update-status/${id}`, { status }, { withCredentials: true });
  //     toast.success(`Status updated to "${status}"`);

  //     setRequests((prev) =>
  //       prev.map((req) =>
  //         req._id === id
  //           ? { ...req, status, newStatus: undefined } // clear newStatus after update
  //           : req
  //       )
  //     );
  //   } catch (err) {
  //     toast.error('Failed to update booking status');
  //   }
  // };

  const handleRequestAction = async (id, status) => {
    try {
      const endpoint =
        status === 'approved'
          ? `/v1/bookings/approveBooking/${id}`
          : `/v1/bookings/rejectBooking/${id}`;

      await API.patch(endpoint, {}, { withCredentials: true });

      toast.success(`Status updated to "${status}"`);
      // update local state
    } catch (err) {
      toast.error(err.response.data.message);
      console.error(err); // Optional: log actual error
    }
  };

  return (
    <div
      id="requests"
      className=" backdrop-blur-lg ring-1 ring-white/10 rounded-2xl p-3 mt-10 mb-12"
    >
      <h2 className="text-3xl font-extrabold text-white text-center pb-6">Booking Requests</h2>

      {requests.length === 0 ? (
        <p className="text-green-300 text-center text-lg">No booking requests found.</p>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white/10 backdrop-blur-md ring-1 ring-white/10 rounded-xl p-6 shadow-lg hover:shadow-2xl transition"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-green-100 flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  {req.propertyId?.title || 'Untitled Property'}
                </h3>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full capitalize tracking-wide ${
                    req.status === 'approved'
                      ? 'bg-green-500/20 text-green-300'
                      : req.status === 'rejected'
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-yellow-400/20 text-yellow-300'
                  }`}
                >
                  {req.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-green-200">
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4 text-green-300" />
                  Tenant: {req.tenantId?.firstName} {req.tenantId?.lastName}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-300" />
                  Move-in Date: {new Date(req.desiredMoveInDate).toLocaleDateString()}
                </p>
                <p>
                  Lease Duration: <strong>{req.desiredLeaseDuration}</strong>
                </p>

                {req.status === 'approved' && req.tenantId && (
                  <div className="space-y-1 text-green-200">
                    <p>
                      <strong>Email:</strong> {req.tenantId.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {req.tenantId.phoneNumber}
                    </p>
                  </div>
                )}
              </div>

              {req.messageFromTenant && (
                <p className="mt-4 text-green-300 italic">"{req.messageFromTenant}"</p>
              )}

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-full sm:w-64">
                  <Select
                    value={statusOptions.find((opt) => opt.value === (req.newStatus || req.status))}
                    onChange={(selectedOption) =>
                      setRequests((prev) =>
                        prev.map((r) =>
                          r._id === req._id ? { ...r, newStatus: selectedOption.value } : r
                        )
                      )
                    }
                    options={statusOptions}
                    className="text-sm"
                    styles={{
                      control: (base) => ({
                        ...base,
                        padding: '2px',
                        minHeight: '40px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: '#d1fae5',
                        borderRadius: '0.5rem',
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: '#d1fae5',
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: '#f8f8f8ff',
                        color: '#363736ff',
                        borderRadius: '0.5rem',
                      }),
                    }}
                  />
                </div>
                <button
                  onClick={() => handleRequestAction(req._id, req.newStatus || req.status)}
                  disabled={!req.newStatus || req.newStatus === req.status}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-400"
                >
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsSection;

// import React, { useEffect, useState } from 'react';
// import API from '../api/axios';
// import { toast } from 'react-toastify';
// import { Home, Calendar, Mail, User } from 'lucide-react';
// import Select from 'react-select';
// import { useLocation } from 'react-router-dom';

// const statusOptions = [
//   // { value: 'pending', label: '⏳ Pending' },
//   { value: 'approved', label: '✅ Approved' },
//   { value: 'rejected', label: '❌ Rejected' },
// ];

// const RequestsSection = () => {
//   const [requests, setRequests] = useState([]);
//   const location = useLocation();

//   // Scroll to this section if URL contains #requests
//   useEffect(() => {
//     const scrollToSection = () => {
//       if (location.hash === '#requests') {
//         const element = document.getElementById('requests');
//         if (element) {
//           element.scrollIntoView({ behavior: 'smooth' });
//         }
//       }
//     };

//     const timeout = setTimeout(scrollToSection, 300); // Delay to ensure render
//     return () => clearTimeout(timeout);
//   }, [location]);

//   // Fetch bookings
//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const res = await API.get('/v1/bookings/my-bookings', {
//           withCredentials: true,
//         });
//         setRequests(res.data.data.bookings || []);
//       } catch (err) {
//         toast.error('Failed to fetch booking requests');
//       }
//     };

//     fetchRequests();
//   }, []);

//   const handleRequestAction = async (id, status) => {
//     try {
//       await API.patch(`/v1/bookings/update-status/${id}`, { status }, { withCredentials: true });
//       toast.success(`Status updated to "${status}"`);

//       setRequests((prev) =>
//         prev.map((req) =>
//           req._id === id
//             ? { ...req, status, newStatus: undefined } // clear newStatus after update
//             : req
//         )
//       );
//     } catch (err) {
//       toast.error('Failed to update booking status');
//     }
//   };

//   return (
//     // <div
//     //   id="requests"
//     //   className="bg-gradient-to-r from-green-100 to-[#E8EAE5] rounded-xl p-8 shadow mb-10 mt-6"
//     // >
//     //   <h2 className="text-3xl font-bold text-[#00412E] mb-4 text-center">Booking Requests</h2>

//     //   {requests.length === 0 ? (
//     //     <p className="text-gray-700 text-center">No booking requests found.</p>
//     //   ) : (
//     //     <div className="space-y-6">
//     //       {requests.map((req) => (
//     //         <div key={req._id} className="border rounded-lg p-5 bg-white shadow-sm">
//     //           <div className="flex justify-between items-center mb-3">
//     //             <h3 className="font-semibold text-[#00412E] flex items-center gap-2">
//     //               <Home className="w-5 h-5" />
//     //               {req.propertyId?.title || 'Untitled Property'}
//     //             </h3>
//     //             <span
//     //               className={`capitalize text-sm px-3 py-1 rounded-full font-medium ${
//     //                 req.status === 'approved'
//     //                   ? 'bg-green-100 text-green-700'
//     //                   : req.status === 'rejected'
//     //                   ? 'bg-red-100 text-red-700'
//     //                   : 'bg-yellow-100 text-yellow-800'
//     //               }`}
//     //             >
//     //               {req.status}
//     //             </span>
//     //           </div>

//     //           <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
//     //             <p className="flex items-center gap-2">
//     //               <User className="w-4 h-4 text-[#00412E]" />
//     //               Tenant: {req.tenantId?.firstName} {req.tenantId?.lastName}
//     //             </p>
//     //             {req.status === 'approved' && req.tenantId && (
//     //               <div className="mt-2 text-sm text-gray-700">
//     //                 <p>
//     //                   <strong>Email:</strong> {req.tenantId.email}
//     //                 </p>
//     //                 <p>
//     //                   <strong>Phone:</strong> {req.tenantId.phoneNumber}
//     //                 </p>
//     //               </div>
//     //             )}
//     //             <p className="flex items-center gap-2">
//     //               <Calendar className="w-4 h-4 text-[#00412E]" />
//     //               Move-in Date: {new Date(req.desiredMoveInDate).toLocaleDateString()}
//     //             </p>
//     //             <p>
//     //               Lease Duration: <strong>{req.desiredLeaseDuration}</strong>
//     //             </p>
//     //           </div>

//     //           {req.messageFromTenant && (
//     //             <div className="mt-3 text-gray-700 text-sm italic">"{req.messageFromTenant}"</div>
//     //           )}

//     //           <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 mt-4 w-full">
//     //             <div className="w-full sm:w-60">
//     //               <Select
//     //                 value={statusOptions.find((opt) => opt.value === (req.newStatus || req.status))}
//     //                 onChange={(selectedOption) =>
//     //                   setRequests((prev) =>
//     //                     prev.map((r) =>
//     //                       r._id === req._id ? { ...r, newStatus: selectedOption.value } : r
//     //                     )
//     //                   )
//     //                 }
//     //                 options={statusOptions}
//     //                 className="w-full sm:w-60 text-sm"
//     //                 styles={{
//     //                   control: (base) => ({
//     //                     ...base,
//     //                     padding: '2px',
//     //                     minHeight: '36px',
//     //                   }),
//     //                 }}
//     //               />
//     //             </div>

//     //             <button
//     //               onClick={() => handleRequestAction(req._id, req.newStatus || req.status)}
//     //               disabled={!req.newStatus || req.newStatus === req.status}
//     //               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//     //             >
//     //               Update Status
//     //             </button>
//     //           </div>
//     //         </div>
//     //       ))}
//     //     </div>
//     //   )}
//     // </div>
//     <div
//       id="requests"
//       className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 mb-10 mt-6"
//     >
//       <h2 className="text-2xl font-semibold text-green-100 mb-6 text-center">Booking Requests</h2>

//       {requests.length === 0 ? (
//         <p className="text-green-100 text-center">No booking requests found.</p>
//       ) : (
//         <div className="space-y-6">
//           {requests.map((req) => (
//             <div key={req._id} className="bg-white/5 border border-white/10 rounded-lg p-5">
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="font-semibold text-green-100 flex items-center gap-2">
//                   <Home className="w-5 h-5" />
//                   {req.propertyId?.title || 'Untitled Property'}
//                 </h3>
//                 <span
//                   className={`capitalize text-sm px-3 py-1 rounded-full font-medium ${
//                     req.status === 'approved'
//                       ? 'bg-green-400/20 text-green-100'
//                       : req.status === 'rejected'
//                       ? 'bg-red-400/20 text-red-100'
//                       : 'bg-yellow-300/20 text-yellow-100'
//                   }`}
//                 >
//                   {req.status}
//                 </span>
//               </div>

//               <div className="grid sm:grid-cols-2 gap-3 text-sm text-green-200">
//                 <p className="flex items-center gap-2">
//                   <User className="w-4 h-4 text-green-300" />
//                   Tenant: {req.tenantId?.firstName} {req.tenantId?.lastName}
//                 </p>
//                 {req.status === 'approved' && req.tenantId && (
//                   <div className="mt-2 text-sm text-green-200">
//                     <p>
//                       <strong>Email:</strong> {req.tenantId.email}
//                     </p>
//                     <p>
//                       <strong>Phone:</strong> {req.tenantId.phoneNumber}
//                     </p>
//                   </div>
//                 )}
//                 <p className="flex items-center gap-2">
//                   <Calendar className="w-4 h-4 text-green-300" />
//                   Move-in Date: {new Date(req.desiredMoveInDate).toLocaleDateString()}
//                 </p>
//                 <p>
//                   Lease Duration: <strong>{req.desiredLeaseDuration}</strong>
//                 </p>
//               </div>

//               {req.messageFromTenant && (
//                 <div className="mt-3 text-green-200 text-sm italic">"{req.messageFromTenant}"</div>
//               )}

//               <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 mt-4 w-full">
//                 <div className="w-full sm:w-60">
//                   <Select
//                     value={statusOptions.find((opt) => opt.value === (req.newStatus || req.status))}
//                     onChange={(selectedOption) =>
//                       setRequests((prev) =>
//                         prev.map((r) =>
//                           r._id === req._id ? { ...r, newStatus: selectedOption.value } : r
//                         )
//                       )
//                     }
//                     options={statusOptions}
//                     className="text-sm"
//                     styles={{
//                       control: (base) => ({
//                         ...base,
//                         padding: '2px',
//                         minHeight: '36px',
//                         backgroundColor: 'rgba(255,255,255,0.1)',
//                         borderColor: 'rgba(255,255,255,0.2)',
//                         color: '#d1fae5',
//                       }),
//                       singleValue: (base) => ({
//                         ...base,
//                         color: '#d1fae5',
//                       }),
//                       menu: (base) => ({
//                         ...base,
//                         backgroundColor: '#1f2937',
//                         color: '#d1fae5',
//                       }),
//                     }}
//                   />
//                 </div>

//                 <button
//                   onClick={() => handleRequestAction(req._id, req.newStatus || req.status)}
//                   disabled={!req.newStatus || req.newStatus === req.status}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Update Status
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RequestsSection;
