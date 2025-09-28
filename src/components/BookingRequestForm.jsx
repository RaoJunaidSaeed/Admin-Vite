import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';

const BookingRequestForm = ({ propertyId, user }) => {
  const [moveInDate, setMoveInDate] = useState('');
  const [leaseDuration, setLeaseDuration] = useState('');
  const [message, setMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);

  useEffect(() => {
    const checkExistingRequest = async () => {
      try {
        const res = await axios.get(`/v1/bookings/my-bookings`, {
          withCredentials: true,
        });

        const userRequests = res.data.data.bookings || [];
        const alreadyRequested = userRequests.find((req) => req.propertyId?._id === propertyId);

        if (alreadyRequested) {
          setExistingRequest(alreadyRequested);
          setHasSubmitted(true);
        }
      } catch (err) {
        toast.error('Could not check previous booking requests');
      }
    };

    checkExistingRequest();
  }, [propertyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!moveInDate || !leaseDuration || !message) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const res = await axios.post(
        `/v1/bookings/createBooking/${propertyId}`,
        {
          desiredMoveInDate: moveInDate,
          desiredLeaseDuration: leaseDuration,
          messageFromTenant: message,
        },
        { withCredentials: true }
      );

      toast.success('Booking request sent successfully!');
      setHasSubmitted(true);
      setExistingRequest(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send booking request');
    }
  };

  if (!user || user.role !== 'tenant') return null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 mt-6">
      <h3 className="text-xl font-semibold text-green-100 mb-4 text-center">
        {hasSubmitted ? 'Booking Request Status' : 'Send Booking Request'}
      </h3>

      {hasSubmitted && existingRequest ? (
        <div className="text-sm text-green-100 space-y-2">
          <div>
            <strong>Status:</strong>{' '}
            <span
              className={`inline-block px-3 py-1 rounded-full font-medium capitalize ${
                existingRequest.status === 'approved'
                  ? 'bg-green-400/20 text-green-200'
                  : existingRequest.status === 'rejected'
                  ? 'bg-red-400/20 text-red-200'
                  : 'bg-yellow-400/20 text-yellow-200'
              }`}
            >
              {existingRequest.status}
            </span>
          </div>
          <p>
            Move-in Date:{' '}
            <strong>{new Date(existingRequest.desiredMoveInDate).toLocaleDateString()}</strong>
          </p>
          <p>
            Lease Duration: <strong>{existingRequest.desiredLeaseDuration}</strong>
          </p>
          <p>
            Your message: <em className="text-green-300">{existingRequest.messageFromTenant}</em>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-green-100">
          <div>
            <label className="block mb-1 font-medium">Desired Move-In Date</label>
            <input
              type="date"
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              className="w-full border border-white/20 bg-white/10 text-green-100 placeholder-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Lease Duration</label>
            <select
              value={leaseDuration}
              onChange={(e) => setLeaseDuration(e.target.value)}
              className="w-full border border-white/20 bg-white/10 text-green-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            >
              <option value="">Select duration</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Message to Owner</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="e.g., I'm very interested in this property..."
              className="w-full border border-white/20 bg-white/10 text-green-100 placeholder-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 transition-colors text-white px-5 py-2 rounded-lg shadow-sm"
          >
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
};

export default BookingRequestForm;

// import React, { useState, useEffect } from 'react';
// import axios from '../api/axios';
// import { toast } from 'react-toastify';

// const BookingRequestForm = ({ propertyId, user }) => {
//   const [moveInDate, setMoveInDate] = useState('');
//   const [leaseDuration, setLeaseDuration] = useState('');
//   const [message, setMessage] = useState('');
//   const [hasSubmitted, setHasSubmitted] = useState(false);
//   const [existingRequest, setExistingRequest] = useState(null);

//   useEffect(() => {
//     const checkExistingRequest = async () => {
//       try {
//         const res = await axios.get(`/v1/bookings/my-bookings`, {
//           withCredentials: true,
//         });

//         const userRequests = res.data.data.bookings || [];
//         const alreadyRequested = userRequests.find((req) => req.propertyId?._id === propertyId);

//         if (alreadyRequested) {
//           setExistingRequest(alreadyRequested);
//           setHasSubmitted(true);
//         }
//       } catch (err) {
//         toast.error('Could not check previous booking requests');
//       }
//     };

//     checkExistingRequest();
//   }, [propertyId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!moveInDate || !leaseDuration || !message) {
//       toast.error('Please fill all fields');
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `/v1/bookings/createBooking/${propertyId}`,
//         {
//           desiredMoveInDate: moveInDate,
//           desiredLeaseDuration: leaseDuration,
//           messageFromTenant: message,
//         },
//         { withCredentials: true }
//       );

//       toast.success('Booking request sent successfully!');
//       setHasSubmitted(true);
//       setExistingRequest(res.data.data);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to send booking request');
//     }
//   };

//   if (!user || user.role !== 'tenant') return null;

//   return (
//     // <div className="bg-[#F9FAFB] p-6 rounded-xl shadow border border-gray-200 mt-6">
//     //   <h3 className="text-xl font-semibold text-[#00412E] mb-4">
//     //     {hasSubmitted ? 'Booking Request Status' : 'Send Booking Request'}
//     //   </h3>

//     //   {hasSubmitted && existingRequest ? (
//     //     <div className="text-sm text-gray-700 space-y-2">
//     //       <div>
//     //         <strong>Status:</strong>{' '}
//     //         <span
//     //           className={`inline-block px-3 py-1 rounded-full font-medium capitalize ${
//     //             existingRequest.status === 'approved'
//     //               ? 'bg-green-100 text-green-800'
//     //               : existingRequest.status === 'rejected'
//     //               ? 'bg-red-100 text-red-800'
//     //               : 'bg-yellow-100 text-yellow-800'
//     //           }`}
//     //         >
//     //           {existingRequest.status}
//     //         </span>
//     //       </div>
//     //       <p>
//     //         Move-in Date:{' '}
//     //         <strong>{new Date(existingRequest.desiredMoveInDate).toLocaleDateString()}</strong>
//     //       </p>
//     //       <p>
//     //         Lease Duration: <strong>{existingRequest.desiredLeaseDuration}</strong>
//     //       </p>
//     //       <p>
//     //         Your message: <em className="text-gray-600">{existingRequest.messageFromTenant}</em>
//     //       </p>
//     //     </div>
//     //   ) : (
//     //     <form onSubmit={handleSubmit} className="space-y-4 text-sm">
//     //       <div>
//     //         <label className="block mb-1 font-medium text-gray-700">Desired Move-In Date</label>
//     //         <input
//     //           type="date"
//     //           value={moveInDate}
//     //           onChange={(e) => setMoveInDate(e.target.value)}
//     //           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00412E]"
//     //           required
//     //         />
//     //       </div>

//     //       <div>
//     //         <label className="block mb-1 font-medium text-gray-700">Lease Duration</label>
//     //         <select
//     //           value={leaseDuration}
//     //           onChange={(e) => setLeaseDuration(e.target.value)}
//     //           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00412E]"
//     //           required
//     //         >
//     //           <option value="">Select duration</option>
//     //           <option value="6 months">6 months</option>
//     //           <option value="1 year">1 year</option>
//     //           <option value="2 years">2 years</option>
//     //         </select>
//     //       </div>

//     //       <div>
//     //         <label className="block mb-1 font-medium text-gray-700">Message to Owner</label>
//     //         <textarea
//     //           value={message}
//     //           onChange={(e) => setMessage(e.target.value)}
//     //           rows={4}
//     //           placeholder="e.g., I'm very interested in this property..."
//     //           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00412E]"
//     //           required
//     //         />
//     //       </div>

//     //       <button
//     //         type="submit"
//     //         className="bg-[#00412E] hover:bg-[#00311F] transition-colors text-white px-5 py-2 rounded-lg shadow-sm"
//     //       >
//     //         Submit Request
//     //       </button>
//     //     </form>
//     //   )}
//     // </div>
//     <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 mt-6">
//       <h3 className="text-xl font-semibold text-green-100 mb-4 text-center">
//         {hasSubmitted ? 'Booking Request Status' : 'Send Booking Request'}
//       </h3>

//       {hasSubmitted && existingRequest ? (
//         <div className="text-sm text-green-100 space-y-2">
//           <div>
//             <strong>Status:</strong>{' '}
//             <span
//               className={`inline-block px-3 py-1 rounded-full font-medium capitalize ${
//                 existingRequest.status === 'approved'
//                   ? 'bg-green-400/20 text-green-200'
//                   : existingRequest.status === 'rejected'
//                   ? 'bg-red-400/20 text-red-200'
//                   : 'bg-yellow-400/20 text-yellow-200'
//               }`}
//             >
//               {existingRequest.status}
//             </span>
//           </div>
//           <p>
//             Move-in Date:{' '}
//             <strong>{new Date(existingRequest.desiredMoveInDate).toLocaleDateString()}</strong>
//           </p>
//           <p>
//             Lease Duration: <strong>{existingRequest.desiredLeaseDuration}</strong>
//           </p>
//           <p>
//             Your message: <em className="text-green-300">{existingRequest.messageFromTenant}</em>
//           </p>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-4 text-sm text-green-100">
//           <div>
//             <label className="block mb-1 font-medium">Desired Move-In Date</label>
//             <input
//               type="date"
//               value={moveInDate}
//               onChange={(e) => setMoveInDate(e.target.value)}
//               className="w-full border border-white/20 bg-white/10 text-green-100 placeholder-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Lease Duration</label>
//             <select
//               value={leaseDuration}
//               onChange={(e) => setLeaseDuration(e.target.value)}
//               className="w-full border border-white/20 bg-white/10 text-green-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
//               required
//             >
//               <option value="">Select duration</option>
//               <option value="6 months">6 months</option>
//               <option value="1 year">1 year</option>
//               <option value="2 years">2 years</option>
//             </select>
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Message to Owner</label>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               rows={4}
//               placeholder="e.g., I'm very interested in this property..."
//               className="w-full border border-white/20 bg-white/10 text-green-100 placeholder-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="bg-green-600 hover:bg-green-700 transition-colors text-white px-5 py-2 rounded-lg shadow-sm"
//           >
//             Submit Request
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default BookingRequestForm;

// import React, { useState, useEffect } from 'react';
// import axios from '../api/axios';
// import { toast } from 'react-toastify';

// const BookingRequestForm = ({ propertyId, user }) => {
//   const [moveInDate, setMoveInDate] = useState('');
//   const [leaseDuration, setLeaseDuration] = useState('');
//   const [message, setMessage] = useState('');
//   const [hasSubmitted, setHasSubmitted] = useState(false);
//   const [existingRequest, setExistingRequest] = useState(null);

//   useEffect(() => {
//     const checkExistingRequest = async () => {
//       try {
//         const res = await axios.get(`/v1/bookings/my-bookings`, {
//           withCredentials: true,
//         });
//         const userRequests = res.data.data.bookings || [];
//         const alreadyRequested = userRequests.find((req) => req.propertyId?._id === propertyId);
//         if (alreadyRequested) {
//           setExistingRequest(alreadyRequested);
//           setHasSubmitted(true);
//         }
//       } catch (err) {
//         toast.error('Could not check previous booking requests');
//       }
//     };

//     checkExistingRequest();
//   }, [propertyId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!moveInDate || !leaseDuration || !message) {
//       toast.error('Please fill all fields');
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `/v1/bookings/createBooking/${propertyId}`,
//         {
//           desiredMoveInDate: moveInDate,
//           desiredLeaseDuration: leaseDuration,
//           messageFromTenant: message,
//         },
//         { withCredentials: true }
//       );

//       toast.success('Booking request sent successfully!');
//       setHasSubmitted(true);
//       setExistingRequest(res.data.data);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to send booking request');
//     }
//   };

//   if (!user || user.role !== 'tenant') return null;

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md mt-6 border border-gray-200">
//       <h3 className="text-xl font-semibold text-[#00412E] mb-4">
//         {hasSubmitted ? 'Booking Request Status' : 'Send Booking Request'}
//       </h3>

//       {hasSubmitted && existingRequest ? (
//         <div>
//           <p className="mb-2">
//             <strong>Status:</strong>{' '}
//             <span
//               className={`font-medium px-2 py-1 rounded ${
//                 existingRequest.status === 'approved'
//                   ? 'bg-green-100 text-green-800'
//                   : existingRequest.status === 'rejected'
//                   ? 'bg-red-100 text-red-800'
//                   : 'bg-yellow-100 text-yellow-800'
//               }`}
//             >
//               {existingRequest.status}
//             </span>
//           </p>
//           <p className="text-gray-600">
//             Your request for move-in on{' '}
//             <strong>{new Date(existingRequest.desiredMoveInDate).toLocaleDateString()}</strong> for
//             a lease of <strong>{existingRequest.desiredLeaseDuration}</strong> has been submitted.
//           </p>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">
//               Desired Move-In Date
//             </label>
//             <input
//               type="date"
//               value={moveInDate}
//               onChange={(e) => setMoveInDate(e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">Lease Duration</label>
//             <select
//               value={leaseDuration}
//               onChange={(e) => setLeaseDuration(e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//               required
//             >
//               <option value="">Select duration</option>
//               <option value="6 months">6 months</option>
//               <option value="1 year">1 year</option>
//               <option value="2 years">2 years</option>
//             </select>
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">Message to Owner</label>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               rows={3}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//               placeholder="e.g., I'm very interested in this property..."
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="bg-[#00412E] hover:bg-green-800 text-white px-5 py-2 rounded text-sm"
//           >
//             Submit Request
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default BookingRequestForm;
