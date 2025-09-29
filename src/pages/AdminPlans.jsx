import React, { useRef, useEffect, useState } from 'react';
import API from '../api/axios'; // updated import
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLoading } from '../context/LoadingContext';

const formFields = [
  { name: 'name', placeholder: 'Plan Name', type: 'text' },
  { name: 'price', placeholder: 'Price (Rs)', type: 'number' },
  { name: 'maxListings', placeholder: 'Max Listings', type: 'number' },
  { name: 'durationDays', placeholder: 'Duration (Days)', type: 'number' },
];

const AdminPlans = () => {
  const { isLoading, setIsLoading } = useLoading();
  const formWrapperRef = useRef(null);

  const [showForm, setShowForm] = useState(false);
  const [plans, setPlans] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, planId: null });
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    maxListings: '',
    durationDays: '',
    features: '',
    isActive: true,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/v1/plans');
      setPlans(res.data.data.plans);
    } catch {
      toast.error('Failed to fetch plans');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToForm = () => {
    setTimeout(() => {
      const offset = 100;
      const top = formWrapperRef.current?.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 100);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      maxListings: Number(formData.maxListings),
      durationDays: Number(formData.durationDays),
      features:
        typeof formData.features === 'string'
          ? formData.features.split(',').map((f) => f.trim())
          : [],
    };

    try {
      if (isEditing) {
        await API.patch(`/v1/plans/${editId}`, payload);
        toast.success('Plan updated');
      } else {
        await API.post('/v1/plans', payload);
        toast.success('Plan created successfully');
      }

      resetForm();
      fetchPlans();
      setShowForm(false);
    } catch {
      toast.error(isEditing ? 'Error updating plan' : 'Failed to create plan');
    }
  };

  const handleEditClick = (plan) => {
    setFormData({
      name: plan.name,
      price: plan.price,
      maxListings: plan.maxListings,
      durationDays: plan.durationDays,
      features: plan.features.join(', '),
      isActive: plan.isActive,
      _id: plan._id,
    });
    setEditId(plan._id);
    setIsEditing(true);
    setShowForm(true);
    scrollToForm();
  };

  // const handleDelete = async (id) => {
  //   if (!window.confirm('Are you sure you want to delete this plan?')) return;
  //   try {
  //     await API.delete(`/v1/plans/${id}`);
  //     toast.success('Plan deleted');
  //     fetchPlans();
  //   } catch {
  //     toast.error('Failed to delete plan');
  //   }
  // };

  const confirmPlanDelete = (id) => {
    setConfirmDelete({ show: true, planId: id });
  };

  const handleConfirmDelete = async () => {
    try {
      await API.delete(`/v1/plans/${confirmDelete.planId}`);
      toast.success('Plan deleted');
      setPlans((prev) => prev.filter((p) => p._id !== confirmDelete.planId));
    } catch {
      toast.error('Failed to delete plan');
    } finally {
      setConfirmDelete({ show: false, planId: null });
    }
  };
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      maxListings: '',
      durationDays: '',
      features: '',
      isActive: true,
    });
    setEditId(null);
    setIsEditing(false);
  };

  return (
    <>
      {!isLoading && confirmDelete.show && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4">
          <div className="bg-white text-gray-800 rounded-xl p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this plan?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setConfirmDelete({ show: false, planId: null })}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-950 py-12 px-4">
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <h1 className="text-2xl font-bold text-green-200 mb-8 border-b border-white/10 pb-3">
            Admin Plan Management
          </h1>

          {!isEditing && !showForm && (
            <div className="mb-6 flex justify-center items-center">
              <button
                onClick={() => {
                  setShowForm(true);
                  scrollToForm();
                }}
                className="w-[70%] sm:w-[50%] bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md shadow transition"
              >
                ➕ Create Plan
              </button>
            </div>
          )}

          <div
            ref={formWrapperRef}
            className={`scroll-mt-32 transition-all duration-500 overflow-hidden ${
              showForm || isEditing ? 'max-h-[2000px] opacity-100 my-10' : 'max-h-0 opacity-0'
            }`}
          >
            <form
              onSubmit={handleCreateOrUpdate}
              className="bg-white/10 backdrop-blur-md border border-green-600 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-green-100"
            >
              {formFields.map(({ name, placeholder, type }) => (
                <div className="flex flex-col gap-2" key={name}>
                  <label className="text-green-200 font-semibold">{placeholder}</label>
                  <input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleInputChange}
                    required
                    className="bg-transparent border border-green-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder={placeholder}
                  />
                </div>
              ))}

              <div className="flex flex-col gap-2 col-span-full">
                <label className="text-green-200 font-semibold">Features (comma separated)</label>
                <input
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  className="bg-transparent border border-green-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="e.g. Featured Listing, Analytics, Support"
                />
              </div>

              <div className="flex items-center gap-2 col-span-full text-green-200">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-green-600"
                />
                <span className="font-semibold">Active</span>
              </div>

              <div className="col-span-full flex flex-col sm:flex-row gap-4 mt-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md shadow"
                >
                  {isEditing ? 'Update Plan' : 'Create Plan'}
                </button>
                {(isEditing || showForm) && (
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }}
                    className="text-green-300 hover:text-white underline"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.length > 0 ? (
              plans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-700 rounded-xl p-5 shadow-md hover:shadow-lg hover:scale-[1.01] transition-transform duration-200"
                >
                  <h2 className="text-xl font-bold text-green-300 mb-3">{plan.name}</h2>
                  <div className="space-y-2 text-sm text-green-100">
                    <p>
                      <span className="font-semibold text-green-400">Price:</span> Rs. {plan.price}
                    </p>
                    <p>
                      <span className="font-semibold text-green-400">Max Listings:</span>{' '}
                      {plan.maxListings}
                    </p>
                    <p>
                      <span className="font-semibold text-green-400">Duration:</span>{' '}
                      {plan.durationDays} days
                    </p>
                    <p>
                      <span className="font-semibold text-green-400">Features:</span>{' '}
                      {plan.features?.join(', ')}
                    </p>
                    <p>
                      <span className="font-semibold text-green-400">Active:</span>{' '}
                      {plan.isActive ? (
                        <span className="text-green-400 font-medium">✔ Yes</span>
                      ) : (
                        <span className="text-red-400 font-medium">✖ No</span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-4 mt-4 text-sm font-medium">
                    <button
                      onClick={() => handleEditClick(plan)}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => confirmPlanDelete(plan._id)}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-green-300 mt-10 text-lg col-span-full">
                No plans found.
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminPlans;

// import React, { useRef, useEffect, useState } from 'react';
// import axios from '../api/axios';
// import { toast } from 'react-toastify';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';

// const formFields = [
//   { name: 'name', placeholder: 'Plan Name', type: 'text' },
//   { name: 'price', placeholder: 'Price (Rs)', type: 'number' },
//   { name: 'maxListings', placeholder: 'Max Listings', type: 'number' },
//   { name: 'durationDays', placeholder: 'Duration (Days)', type: 'number' },
// ];

// const AdminPlans = () => {
//   const formWrapperRef = useRef(null);

//   const [showForm, setShowForm] = useState(false);
//   const [plans, setPlans] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     price: '',
//     maxListings: '',
//     durationDays: '',
//     features: '',
//     isActive: true,
//   });

//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   const fetchPlans = async () => {
//     try {
//       const res = await axios.get('/v1/plans', { withCredentials: true });
//       setPlans(res.data.data.plans);
//     } catch {
//       toast.error('Failed to fetch plans');
//     }
//   };

//   const scrollToForm = () => {
//     setTimeout(() => {
//       const offset = 100; // Height of fixed navbar or more
//       const top = formWrapperRef.current?.getBoundingClientRect().top + window.scrollY - offset;
//       window.scrollTo({ top, behavior: 'smooth' });
//     }, 100);
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleCreateOrUpdate = async (e) => {
//     e.preventDefault();
//     const payload = {
//       ...formData,
//       price: Number(formData.price),
//       maxListings: Number(formData.maxListings),
//       durationDays: Number(formData.durationDays),
//       features:
//         typeof formData.features === 'string'
//           ? formData.features.split(',').map((f) => f.trim())
//           : [],
//     };

//     try {
//       if (isEditing) {
//         await axios.patch(`/v1/plans/${editId}`, payload, { withCredentials: true });
//         toast.success('Plan updated');
//       } else {
//         await axios.post('/v1/plans', payload, { withCredentials: true });
//         toast.success('Plan created successfully');
//       }

//       resetForm();
//       fetchPlans();
//       setShowForm(false);
//     } catch {
//       toast.error(isEditing ? 'Error updating plan' : 'Failed to create plan');
//     }
//   };

//   const handleEditClick = (plan) => {
//     setFormData({
//       name: plan.name,
//       price: plan.price,
//       maxListings: plan.maxListings,
//       durationDays: plan.durationDays,
//       features: plan.features.join(', '),
//       isActive: plan.isActive,
//       _id: plan._id,
//     });
//     setEditId(plan._id);
//     setIsEditing(true);
//     setShowForm(true);
//     scrollToForm();
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this plan?')) return;
//     try {
//       await axios.delete(`/v1/plans/${id}`, { withCredentials: true });
//       toast.success('Plan deleted');
//       fetchPlans();
//     } catch {
//       toast.error('Failed to delete plan');
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       price: '',
//       maxListings: '',
//       durationDays: '',
//       features: '',
//       isActive: true,
//     });
//     setEditId(null);
//     setIsEditing(false);
//   };

//   return (
//     <>
//       <Navbar />
//       <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-950 py-12 px-4">
//         <div className="max-w-6xl mx-auto p-4 sm:p-6">
//           <h1 className="text-2xl font-bold text-green-200 mb-8 border-b border-white/10 pb-3">
//             Admin Plan Management
//           </h1>

//           {!isEditing && !showForm && (
//             <div className="mb-6 flex justify-center items-center">
//               <button
//                 onClick={() => {
//                   setShowForm(true);
//                   scrollToForm();
//                 }}
//                 className="w-[70%] sm:w-[50%] bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md shadow transition"
//               >
//                 ➕ Create Plan
//               </button>
//             </div>
//           )}

//           <div
//             ref={formWrapperRef}
//             className={`scroll-mt-32 transition-all duration-500 overflow-hidden ${
//               showForm || isEditing ? 'max-h-[2000px] opacity-100 my-10' : 'max-h-0 opacity-0'
//             }`}
//           >
//             <form
//               onSubmit={handleCreateOrUpdate}
//               className="bg-white/10 backdrop-blur-md border border-green-600 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-green-100"
//             >
//               {formFields.map(({ name, placeholder, type }) => (
//                 <div className="flex flex-col gap-2" key={name}>
//                   <label className="text-green-200 font-semibold">{placeholder}</label>
//                   <input
//                     name={name}
//                     type={type}
//                     value={formData[name]}
//                     onChange={handleInputChange}
//                     required
//                     className="bg-transparent border border-green-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
//                     placeholder={placeholder}
//                   />
//                 </div>
//               ))}

//               <div className="flex flex-col gap-2 col-span-full">
//                 <label className="text-green-200 font-semibold">Features (comma separated)</label>
//                 <input
//                   name="features"
//                   value={formData.features}
//                   onChange={handleInputChange}
//                   className="bg-transparent border border-green-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
//                   placeholder="e.g. Featured Listing, Analytics, Support"
//                 />
//               </div>

//               <div className="flex items-center gap-2 col-span-full text-green-200">
//                 <input
//                   type="checkbox"
//                   name="isActive"
//                   checked={formData.isActive}
//                   onChange={handleInputChange}
//                   className="w-5 h-5 accent-green-600"
//                 />
//                 <span className="font-semibold">Active</span>
//               </div>

//               <div className="col-span-full flex flex-col sm:flex-row gap-4 mt-2">
//                 <button
//                   type="submit"
//                   className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md shadow"
//                 >
//                   {isEditing ? 'Update Plan' : 'Create Plan'}
//                 </button>
//                 {(isEditing || showForm) && (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       resetForm();
//                       setShowForm(false);
//                     }}
//                     className="text-green-300 hover:text-white underline"
//                   >
//                     Cancel
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>

//           <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {plans.length > 0 ? (
//               plans.map((plan) => (
//                 <div
//                   key={plan._id}
//                   className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-700 rounded-xl p-5 shadow-md hover:shadow-lg hover:scale-[1.01] transition-transform duration-200"
//                 >
//                   <h2 className="text-xl font-bold text-green-300 mb-3">{plan.name}</h2>
//                   <div className="space-y-2 text-sm text-green-100">
//                     <p>
//                       <span className="font-semibold text-green-400">Price:</span> Rs. {plan.price}
//                     </p>
//                     <p>
//                       <span className="font-semibold text-green-400">Max Listings:</span>{' '}
//                       {plan.maxListings}
//                     </p>
//                     <p>
//                       <span className="font-semibold text-green-400">Duration:</span>{' '}
//                       {plan.durationDays} days
//                     </p>
//                     <p>
//                       <span className="font-semibold text-green-400">Features:</span>{' '}
//                       {plan.features?.join(', ')}
//                     </p>
//                     <p>
//                       <span className="font-semibold text-green-400">Active:</span>{' '}
//                       {plan.isActive ? (
//                         <span className="text-green-400 font-medium">✔ Yes</span>
//                       ) : (
//                         <span className="text-red-400 font-medium">✖ No</span>
//                       )}
//                     </p>
//                   </div>
//                   <div className="flex gap-4 mt-4 text-sm font-medium">
//                     <button
//                       onClick={() => handleEditClick(plan)}
//                       className="text-blue-400 hover:text-blue-300 hover:underline transition"
//                     >
//                       ✏️ Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(plan._id)}
//                       className="text-red-400 hover:text-red-300 hover:underline transition"
//                     >
//                       🗑️ Delete
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center text-green-300 mt-10 text-lg col-span-full">
//                 No plans found.
//               </div>
//             )}
//           </section>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default AdminPlans;
