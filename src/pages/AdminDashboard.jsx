import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useLoading();

  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({
    city: '',
    region: '',
    type: '',
    rentMin: '',
    rentMax: '',
  });
  const [statusFilter, setStatusFilter] = useState('all');

  const applyClientFilters = (updatedFilters = filters, updatedStatus = statusFilter) => {
    let filtered = [...allProperties];

    if (updatedFilters.city) {
      filtered = filtered.filter((p) => p.city === updatedFilters.city);
    }
    if (updatedFilters.region) {
      filtered = filtered.filter((p) => p.region === updatedFilters.region);
    }
    if (updatedFilters.type) {
      filtered = filtered.filter((p) => p.propertyType === updatedFilters.type);
    }
    if (updatedFilters.rentMin) {
      filtered = filtered.filter((p) => p.rentAmount >= parseInt(updatedFilters.rentMin));
    }
    if (updatedFilters.rentMax) {
      filtered = filtered.filter((p) => p.rentAmount <= parseInt(updatedFilters.rentMax));
    }

    if (updatedStatus && updatedStatus !== 'all') {
      if (updatedStatus === 'verified') {
        filtered = filtered.filter((p) => p.isVerified === true);
      } else if (updatedStatus === 'unverified') {
        filtered = filtered.filter((p) => p.isVerified === false);
      } else {
        filtered = filtered.filter((p) => p.availabilityStatus === updatedStatus);
      }
    }

    setFilteredProperties(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updated = {
        ...prev,
        [name]: value,
        ...(name === 'city' ? { region: '' } : {}),
      };
      applyClientFilters(updated, statusFilter);
      return updated;
    });
  };

  const fetchAllProperties = async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/v1/properties');

      const raw = res.data?.data?.data || [];
      const safe = raw.map((p) => ({
        ...p,
        images: Array.isArray(p.images) ? p.images : [],
        amenities: Array.isArray(p.amenities) ? p.amenities : [],
      }));

      setAllProperties(safe);
      setFilteredProperties(safe);
    } catch (err) {
      toast.error('Failed to fetch properties.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProperties();
  }, []);

  useEffect(() => {
    applyClientFilters(filters, statusFilter);
  }, [statusFilter]);

  const cities = [...new Set(allProperties.map((p) => p.city))].filter(Boolean);
  const regions = filters.city
    ? [
        ...new Set(allProperties.filter((p) => p.city === filters.city).map((p) => p.region)),
      ].filter(Boolean)
    : [...new Set(allProperties.map((p) => p.region))].filter(Boolean);
  const types = [...new Set(allProperties.map((p) => p.propertyType))].filter(Boolean);

  return (
    <>
      {!isLoading && (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 py-12 px-2 sm:px-2 lg:px-4">
          {/* <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-2xl shadow-2xl p-2 sm:p-4 space-y-6"> */}
          <div className="max-w-7xl mx-auto backdrop-blur-lg p-2 sm:p-4 space-y-6">
            <div className="text-center space-y-3 pt-12 pb-8">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Welcome, {user?.firstName || 'User'}
              </h1>
              <p className="text-green-300 text-lg">Browse and Update Properties.</p>
            </div>

            <section className="bg-[rgba(63,73,63,0.05)] backdrop-blur-md ring-1 ring-white/15 rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-2xl font-semibold text-green-200">Filter Properties</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <select
                  name="city"
                  value={filters.city}
                  onChange={handleInputChange}
                  className="w-full max-w-sm bg-white/10 text-green-600 border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2A5942] appearance-none"
                >
                  <option value="">Select City</option>
                  {cities.map((city, idx) => (
                    <option key={idx} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                <select
                  name="region"
                  value={filters.region}
                  onChange={handleInputChange}
                  className="w-full max-w-sm bg-white/10 text-green-600 border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2A5942] appearance-none"
                >
                  <option value="">Select Region</option>
                  {regions.map((region, idx) => (
                    <option key={idx} value={region}>
                      {region}
                    </option>
                  ))}
                </select>

                <select
                  name="type"
                  value={filters.type}
                  onChange={handleInputChange}
                  className="w-full max-w-sm bg-white/10 text-green-600 border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2A5942] appearance-none"
                >
                  <option value="">Select Type</option>
                  {types.map((type, idx) => (
                    <option key={idx} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  name="rentMin"
                  placeholder="Min Rent"
                  value={filters.rentMin}
                  onChange={handleInputChange}
                  className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <input
                  type="number"
                  name="rentMax"
                  placeholder="Max Rent"
                  value={filters.rentMax}
                  onChange={handleInputChange}
                  className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {['all', 'available', 'rented', 'pending', 'verified', 'unverified'].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-5 py-2 rounded-full font-medium uppercase text-sm tracking-wide transition ${
                        statusFilter === status
                          ? 'bg-green-600 text-white'
                          : 'bg-white/10 text-green-200 hover:bg-white/20'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  )
                )}
              </div>
            </section>

            <section className="bg-[rgba(63,73,63,0.05)] backdrop-blur-md ring-1 ring-white/15 rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-2xl font-semibold text-green-200">Available Properties</h2>
              {filteredProperties.length === 0 ? (
                <p className="text-center text-green-300">No properties match the criteria.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProperties.map((property) => (
                    <div
                      key={property._id}
                      className="bg-white/5 backdrop-blur-md ring-1 ring-white/20 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1"
                    >
                      {property.images?.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-600 text-white flex items-center justify-center">
                          No Image Available
                        </div>
                      )}
                      <div className="p-5 text-green-100 space-y-2">
                        <h3 className="text-xl font-bold text-white">{property.title}</h3>
                        <p className="text-sm">
                          {property.city}, {property.region}
                        </p>
                        <p className="text-sm">
                          Rs {property.rentAmount} / {property.currency}
                        </p>
                        <p className="text-sm">
                          Status:{' '}
                          <span className={`font-semibold text-green-300 `}>
                            {property.availabilityStatus}
                          </span>
                        </p>
                        <div className="mt-3">
                          <button
                            onClick={() => navigate(`/property/${property._id}`)}
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-green-400"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      )}
    </>
  );
};

export default AdminDashboard;

// import React, { useEffect, useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import API from '../api/axios';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import { AuthContext } from '../context/AuthContext';

// const AdminDashboard = () => {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [allProperties, setAllProperties] = useState([]);
//   const [filteredProperties, setFilteredProperties] = useState([]);

//   const [filters, setFilters] = useState({
//     city: '',
//     region: '',
//     type: '',
//     rentMin: '',
//     rentMax: '',
//   });

//   const [loading, setLoading] = useState(false);

//   const applyClientFilters = (updatedFilters = filters) => {
//     let filtered = [...allProperties];

//     if (updatedFilters.city) {
//       filtered = filtered.filter((p) => p.city === updatedFilters.city);
//     }
//     if (updatedFilters.region) {
//       filtered = filtered.filter((p) => p.region === updatedFilters.region);
//     }
//     if (updatedFilters.type) {
//       filtered = filtered.filter((p) => p.propertyType === updatedFilters.type);
//     }
//     if (updatedFilters.rentMin) {
//       filtered = filtered.filter((p) => p.rentAmount >= parseInt(updatedFilters.rentMin));
//     }
//     if (updatedFilters.rentMax) {
//       filtered = filtered.filter((p) => p.rentAmount <= parseInt(updatedFilters.rentMax));
//     }

//     setFilteredProperties(filtered);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => {
//       const updated = {
//         ...prev,
//         [name]: value,
//         ...(name === 'city' ? { region: '' } : {}),
//       };
//       applyClientFilters(updated);
//       return updated;
//     });
//   };

//   const fetchAllProperties = async () => {
//     try {
//       setLoading(true);
//       const res = await API.get('/v1/properties');

//       const raw = res.data?.data?.data || [];
//       console.log(raw);
//       const safe = raw.map((p) => ({
//         ...p,
//         images: Array.isArray(p.images) ? p.images : [],
//         amenities: Array.isArray(p.amenities) ? p.amenities : [],
//       }));

//       setAllProperties(safe);
//       setFilteredProperties(safe);
//     } catch (err) {
//       toast.error('Failed to fetch properties.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllProperties();
//   }, []);

//   const cities = [...new Set(allProperties.map((p) => p.city))].filter(Boolean);
//   const regions = filters.city
//     ? [
//         ...new Set(allProperties.filter((p) => p.city === filters.city).map((p) => p.region)),
//       ].filter(Boolean)
//     : [...new Set(allProperties.map((p) => p.region))].filter(Boolean);
//   const types = [...new Set(allProperties.map((p) => p.propertyType))].filter(Boolean);

//   return (
//     <>
//       <Navbar />
//       <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 py-12 px-2 sm:px-2 lg:px-4">
//         <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-2xl shadow-2xl p-2 sm:p-4 space-y-6">
//           {/* Header */}
//           <div className="text-center space-y-3 pt-12 pb-8">
//             <h1 className="text-3xl font-extrabold text-white tracking-tight">
//               Welcome, {user?.firstName || 'User'}
//             </h1>
//             <p className="text-green-300 text-lg">Browse and Update Properties.</p>
//           </div>

//           {/* Filters
//           <section className="bg-white/5 backdrop-blur-md ring-1 ring-white/15 rounded-2xl p-6 sm:p-8 space-y-6">
//             <h2 className="text-2xl font-semibold text-green-200">Filter Properties</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//               <select
//                 name="city"
//                 value={filters.city}
//                 onChange={handleInputChange}
//                 className="w-full max-w-sm bg-white/10 text-green-600 border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2A5942] appearance-none"
//               >
//                 <option value="">Select City</option>
//                 {cities.map((city, idx) => (
//                   <option key={idx} value={city}>
//                     {city}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 name="region"
//                 value={filters.region}
//                 onChange={handleInputChange}
//                 className="w-full max-w-sm bg-white/10 text-green-600 border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2A5942] appearance-none"
//               >
//                 <option value="">Select Region</option>
//                 {regions.map((region, idx) => (
//                   <option key={idx} value={region}>
//                     {region}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 name="type"
//                 value={filters.type}
//                 onChange={handleInputChange}
//                 className="w-full max-w-sm bg-white/10 text-green-600 border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2A5942] appearance-none"
//               >
//                 <option value="">Select Type</option>
//                 {types.map((type, idx) => (
//                   <option key={idx} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>

//               <input
//                 type="number"
//                 name="rentMin"
//                 placeholder="Min Rent"
//                 value={filters.rentMin}
//                 onChange={handleInputChange}
//                 className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
//               />

//               <input
//                 type="number"
//                 name="rentMax"
//                 placeholder="Max Rent"
//                 value={filters.rentMax}
//                 onChange={handleInputChange}
//                 className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
//               />
//             </div>
//           </section> */}
//           {/* Filters */}
//           <section className="bg-white/5 backdrop-blur-md ring-1 ring-white/15 rounded-2xl p-6 sm:p-8 space-y-6">
//             <h2 className="text-2xl font-semibold text-green-200">Filter Properties</h2>

//             {/* Filter Dropdowns */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//               <select
//                 name="city"
//                 value={filters.city}
//                 onChange={handleInputChange}
//                 className="w-full max-w-sm bg-white/10 text-green-600 border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2A5942] appearance-none"
//               >
//                 <option value="">Select City</option>
//                 {cities.map((city, idx) => (
//                   <option key={idx} value={city}>
//                     {city}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 name="region"
//                 value={filters.region}
//                 onChange={handleInputChange}
//                 className="w-full max-w-sm bg-white/10 text-green-600 border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2A5942] appearance-none"
//               >
//                 <option value="">Select Region</option>
//                 {regions.map((region, idx) => (
//                   <option key={idx} value={region}>
//                     {region}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 name="type"
//                 value={filters.type}
//                 onChange={handleInputChange}
//                 className="w-full max-w-sm bg-white/10 text-green-600 border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2A5942] appearance-none"
//               >
//                 <option value="">Select Type</option>
//                 {types.map((type, idx) => (
//                   <option key={idx} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>

//               <input
//                 type="number"
//                 name="rentMin"
//                 placeholder="Min Rent"
//                 value={filters.rentMin}
//                 onChange={handleInputChange}
//                 className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
//               />

//               <input
//                 type="number"
//                 name="rentMax"
//                 placeholder="Max Rent"
//                 value={filters.rentMax}
//                 onChange={handleInputChange}
//                 className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
//               />
//             </div>

//             {/* Status Filter Buttons */}
//             <div className="flex flex-wrap justify-center gap-3 pt-4">
//               {['all', 'available', 'rented', 'pending', 'unavailable', 'verified'].map(
//                 (status) => (
//                   <button
//                     key={status}
//                     onClick={() => setFilter(status)}
//                     className={`px-5 py-2 rounded-full font-medium uppercase text-sm tracking-wide transition ${
//                       filters === status
//                         ? 'bg-green-600 text-white'
//                         : 'bg-white/10 text-green-200 hover:bg-white/20'
//                     }`}
//                   >
//                     {status.charAt(0).toUpperCase() + status.slice(1)}
//                   </button>
//                 )
//               )}
//             </div>
//           </section>

//           {/* Property Cards */}
//           <section className="bg-white/5 backdrop-blur-md ring-1 ring-white/15 rounded-2xl p-6 sm:p-8 space-y-6">
//             <h2 className="text-2xl font-semibold text-green-200">Available Properties</h2>
//             {loading ? (
//               <p className="text-center text-green-300">Loading...</p>
//             ) : filteredProperties.length === 0 ? (
//               <p className="text-center text-green-300">No properties match the criteria.</p>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {filteredProperties
//                   // .filter((property) => property.availabilityStatus !== 'rented')
//                   .map((property) => (
//                     <div
//                       key={property._id}
//                       className="bg-white/5 backdrop-blur-md ring-1 ring-white/20 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1"
//                     >
//                       {property.images?.length > 0 ? (
//                         <img
//                           src={property.images[0]}
//                           alt={property.title}
//                           className="w-full h-48 object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-48 bg-gray-600 text-white flex items-center justify-center">
//                           No Image Available
//                         </div>
//                       )}
//                       <div className="p-5 text-green-100 space-y-2">
//                         <h3 className="text-xl font-bold text-white">{property.title}</h3>
//                         <p className="text-sm">
//                           {property.city}, {property.region}
//                         </p>
//                         <p className="text-sm">
//                           Rs {property.rentAmount} / {property.currency}
//                         </p>
//                         <p className="text-sm">
//                           Status:{' '}
//                           <span
//                             className={`font-semibold ${
//                               property.availabilityStatus === 'rented'
//                                 ? 'text-red-400'
//                                 : 'text-green-300'
//                             }`}
//                           >
//                             {property.availabilityStatus}
//                           </span>
//                         </p>
//                         <div className="mt-3">
//                           <button
//                             onClick={() => navigate(`/property/${property._id}`)}
//                             className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-green-400"
//                           >
//                             View Details
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             )}
//           </section>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default AdminDashboard;
