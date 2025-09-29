import React, { useEffect, useRef, useState } from 'react';
import API from '../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLoading } from '../context/LoadingContext';

const AdminUserPage = () => {
  const { isLoading, setIsLoading } = useLoading();
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, userId: null });
  const userFormRef = useRef(null);

  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'admin',
    active: true,
    isVerified: true,
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const scrollToUserForm = () => {
    userFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleUserInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setUserFormData({
      ...userFormData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const resetUserForm = () => {
    setUserFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: 'admin',
      active: true,
      isVerified: true,
    });
    setPhotoFile(null);
    setPreviewUrl('');
    setIsUserEditing(false);
    setEditUserId(null);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();
      Object.entries(userFormData).forEach(([key, val]) => formData.append(key, val));
      if (photoFile) formData.append('photo', photoFile);

      if (isUserEditing) {
        await API.patch(`/v1/users/${editUserId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('User updated successfully');
      } else {
        await API.post('/v1/users', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('User created successfully');
      }

      fetchUsers();
      resetUserForm();
      setShowUserForm(false);
    } catch (err) {
      toast.error('Failed to submit user form');
      setIsLoading(false);
    }
  };

  const handleUserEdit = (user) => {
    setUserFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role || 'admin',
      active: user.active ?? true,
      isVerified: user.isVerified ?? false,
    });
    setPreviewUrl(user.photo || '');
    setPhotoFile(null);
    setIsUserEditing(true);
    setEditUserId(user._id);
    setShowUserForm(true);
    scrollToUserForm();
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/v1/users');
      setUsers(res.data.data.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  // const deleteUser = async (id) => {
  //   if (!window.confirm('Are you sure you want to delete this user?')) return;
  //   try {
  //     await API.delete(`/v1/users/${id}`);
  //     toast.success('User deleted');
  //     setUsers(users.filter((u) => u._id !== id));
  //   } catch (err) {
  //     toast.error('Failed to delete user');
  //   }
  // };

  const confirmUserDelete = (id) => {
    setConfirmDelete({ show: true, userId: id });
  };

  const handleConfirmDelete = async () => {
    try {
      await API.delete(`/v1/users/${confirmDelete.userId}`);
      toast.success('User deleted');
      setUsers((prev) => prev.filter((u) => u._id !== confirmDelete.userId));
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setConfirmDelete({ show: false, userId: null });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      {!isLoading && confirmDelete.show && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4">
          <div className="bg-white text-gray-800 rounded-xl p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setConfirmDelete({ show: false, userId: null })}
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
            Admin User Management
          </h1>

          {!isUserEditing && !showUserForm && (
            <div className="w-full mb-6 flex justify-center items-center">
              <button
                onClick={() => {
                  setShowUserForm(true);
                  scrollToUserForm();
                }}
                className="w-[70%] sm:w-[50%] bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md shadow transition "
              >
                ➕ Add User
              </button>
            </div>
          )}

          <div
            ref={userFormRef}
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showUserForm || isUserEditing
                ? 'max-h-[2000px] opacity-100 my-10'
                : 'max-h-0 opacity-0'
            }`}
          >
            <form
              onSubmit={handleUserSubmit}
              className="bg-white/10 backdrop-blur-md border border-green-600 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-green-100"
              encType="multipart/form-data"
            >
              {['firstName', 'lastName', 'email', 'phoneNumber', 'role'].map((name) => (
                <div className="flex flex-col gap-2" key={name}>
                  <label className="text-green-200 font-semibold capitalize">
                    {name.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    name={name}
                    type={name === 'email' ? 'email' : 'text'}
                    value={userFormData[name] || ''}
                    onChange={handleUserInputChange}
                    required
                    className="bg-transparent border border-green-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder={name.replace(/([A-Z])/g, ' $1')}
                  />
                </div>
              ))}

              <div className="flex flex-col gap-2">
                <label className="text-green-200 font-semibold">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="bg-transparent border border-green-600 rounded-md px-4 py-2 file:bg-green-700 file:border-none file:text-white file:px-4 file:py-1"
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover mt-2 border border-green-600"
                  />
                )}
              </div>

              <div className="flex items-center gap-4 col-span-full text-green-200">
                {/* <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="active"
                    checked={userFormData.active}
                    onChange={handleUserInputChange}
                    className="w-5 h-5 accent-green-600"
                  />
                  <span className="font-semibold">Active</span>
                </label> */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={userFormData.isVerified}
                    onChange={handleUserInputChange}
                    className="w-5 h-5 accent-green-600"
                  />
                  <span className="font-semibold">Verified</span>
                </label>
              </div>

              <div className="col-span-full flex flex-col sm:flex-row gap-4 mt-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md shadow"
                >
                  {isUserEditing ? 'Update User' : 'Add User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetUserForm();
                    setShowUserForm(false);
                  }}
                  className="text-green-300 hover:text-white underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-700 rounded-xl p-5 shadow-md hover:shadow-lg hover:scale-[1.01] transition-transform duration-200"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={user.photo}
                      alt="User Profile"
                      className="w-14 h-14 rounded-full object-cover border border-green-600"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-green-300">
                        {user.firstName} {user.lastName}
                      </h2>
                      <p className="text-sm text-green-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-green-100">
                    <p>
                      <span className="font-semibold text-green-400">Phone:</span>{' '}
                      {user.phoneNumber}
                    </p>
                    <p>
                      <span className="font-semibold text-green-400">Role:</span>{' '}
                      <span className="capitalize">{user.role}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-green-400">Verified:</span>{' '}
                      {user.isVerified ? '✔ Yes' : '✖ No'}
                    </p>
                  </div>
                  <div className="flex gap-4 mt-4 text-sm font-medium">
                    <button
                      onClick={() => handleUserEdit(user)}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => confirmUserDelete(user._id)}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-green-300 mt-10 text-lg col-span-full">
                No users found.
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminUserPage;

// import React, { useEffect, useRef, useState } from 'react';
// import API from '../api/axios';
// import { toast } from 'react-toastify';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';

// const AdminUserPage = () => {
//   const [users, setUsers] = useState([]);
//   const [showUserForm, setShowUserForm] = useState(false);
//   const [isUserEditing, setIsUserEditing] = useState(false);
//   const [editUserId, setEditUserId] = useState(null);
//   const userFormRef = useRef(null);

//   const [userFormData, setUserFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phoneNumber: '',
//     role: 'user',
//     active: true,
//     isVerified: false,
//     photo: '',
//   });

//   const [photoFile, setPhotoFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState('');
//   const [uploading, setUploading] = useState(false);

//   const scrollToUserForm = () => {
//     userFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   };

//   const handleUserInputChange = (e) => {
//     const { name, type, value, checked } = e.target;
//     setUserFormData({
//       ...userFormData,
//       [name]: type === 'checkbox' ? checked : value,
//     });
//   };

//   const handlePhotoChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', 'your_upload_preset'); // Replace with your actual preset

//     setUploading(true);
//     try {
//       const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
//         method: 'POST',
//         body: formData,
//       });
//       const data = await res.json();
//       setUserFormData((prev) => ({ ...prev, photo: data.secure_url }));
//       setPreviewUrl(data.secure_url);
//     } catch (error) {
//       toast.error('Image upload failed');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const resetUserForm = () => {
//     setUserFormData({
//       firstName: '',
//       lastName: '',
//       email: '',
//       phoneNumber: '',
//       role: 'user',
//       active: true,
//       isVerified: false,
//       photo: '',
//     });
//     setPhotoFile(null);
//     setPreviewUrl('');
//     setIsUserEditing(false);
//     setEditUserId(null);
//   };

//   const handleUserSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       Object.entries(userFormData).forEach(([key, val]) => formData.append(key, val));

//       if (isUserEditing) {
//         await API.patch(`/v1/users/${editUserId}`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         toast.success('User updated successfully');
//       } else {
//         await API.post('/v1/users', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         toast.success('User created successfully');
//       }

//       fetchUsers();
//       resetUserForm();
//       setShowUserForm(false);
//     } catch (err) {
//       toast.error('Failed to submit user form');
//     }
//   };

//   const handleUserEdit = (user) => {
//     setUserFormData({
//       firstName: user.firstName || '',
//       lastName: user.lastName || '',
//       email: user.email || '',
//       phoneNumber: user.phoneNumber || '',
//       role: user.role || 'user',
//       active: user.active ?? true,
//       isVerified: user.isVerified ?? false,
//       photo: user.photo || '',
//     });
//     setPreviewUrl(user.photo || '');
//     setPhotoFile(null);
//     setIsUserEditing(true);
//     setEditUserId(user._id);
//     setShowUserForm(true);
//     scrollToUserForm();
//   };

//   const fetchUsers = async () => {
//     try {
//       const res = await API.get('/v1/users');
//       setUsers(res.data.data.data);
//     } catch (err) {
//       toast.error('Failed to fetch users');
//     }
//   };

//   const deleteUser = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;
//     try {
//       await API.delete(`/v1/users/${id}`);
//       toast.success('User deleted');
//       setUsers(users.filter((u) => u._id !== id));
//     } catch (err) {
//       toast.error('Failed to delete user');
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-950 py-12 px-4">
//         <div className="max-w-6xl mx-auto p-4 sm:p-6">
//           <h1 className="text-3xl font-bold text-green-200 mb-8 border-b border-white/10 pb-3">
//             Admin User Management
//           </h1>

//           {!isUserEditing && !showUserForm && (
//             <div className="mb-6">
//               <button
//                 onClick={() => {
//                   setShowUserForm(true);
//                   scrollToUserForm();
//                 }}
//                 className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md shadow transition"
//               >
//                 ➕ Add User
//               </button>
//             </div>
//           )}

//           <div
//             ref={userFormRef}
//             className={`transition-all duration-500 ease-in-out overflow-hidden ${
//               showUserForm || isUserEditing
//                 ? 'max-h-[2000px] opacity-100 my-10'
//                 : 'max-h-0 opacity-0'
//             }`}
//           >
//             <form
//               onSubmit={handleUserSubmit}
//               className="bg-white/10 backdrop-blur-md border border-green-600 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-green-100"
//               encType="multipart/form-data"
//             >
//               {['firstName', 'lastName', 'email', 'phoneNumber', 'role'].map((name) => (
//                 <div className="flex flex-col gap-2" key={name}>
//                   <label className="text-green-200 font-semibold capitalize">
//                     {name.replace(/([A-Z])/g, ' $1')}
//                   </label>
//                   <input
//                     name={name}
//                     type={name === 'email' ? 'email' : 'text'}
//                     value={userFormData[name] || ''}
//                     onChange={handleUserInputChange}
//                     required
//                     className="bg-transparent border border-green-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
//                     placeholder={name.replace(/([A-Z])/g, ' $1')}
//                   />
//                 </div>
//               ))}

//               <div className="flex flex-col gap-2">
//                 <label className="text-green-200 font-semibold">Profile Photo</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handlePhotoChange}
//                   className="bg-transparent border border-green-600 rounded-md px-4 py-2 file:bg-green-700 file:border-none file:text-white file:px-4 file:py-1"
//                 />
//                 {uploading && <p className="text-sm text-green-300">Uploading...</p>}
//                 {previewUrl && (
//                   <img
//                     src={previewUrl}
//                     alt="Preview"
//                     className="w-24 h-24 rounded-full object-cover mt-2 border border-green-600"
//                   />
//                 )}
//               </div>

//               <div className="flex items-center gap-4 col-span-full text-green-200">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     name="active"
//                     checked={userFormData.active}
//                     onChange={handleUserInputChange}
//                     className="w-5 h-5 accent-green-600"
//                   />
//                   <span className="font-semibold">Active</span>
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     name="isVerified"
//                     checked={userFormData.isVerified}
//                     onChange={handleUserInputChange}
//                     className="w-5 h-5 accent-green-600"
//                   />
//                   <span className="font-semibold">Verified</span>
//                 </label>
//               </div>

//               <div className="col-span-full flex flex-col sm:flex-row gap-4 mt-2">
//                 <button
//                   type="submit"
//                   className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md shadow"
//                 >
//                   {isUserEditing ? 'Update User' : 'Add User'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     resetUserForm();
//                     setShowUserForm(false);
//                   }}
//                   className="text-green-300 hover:text-white underline"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>

//           <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {users.length > 0 ? (
//               users.map((user) => (
//                 <div
//                   key={user._id}
//                   className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-700 rounded-xl p-5 shadow-md hover:shadow-lg hover:scale-[1.01] transition-transform duration-200"
//                 >
//                   <div className="flex items-center gap-4 mb-4">
//                     <img
//                       src={user.photo}
//                       alt="User Profile"
//                       className="w-14 h-14 rounded-full object-cover border border-green-600"
//                     />
//                     <div>
//                       <h2 className="text-xl font-bold text-green-300">
//                         {user.firstName} {user.lastName}
//                       </h2>
//                       <p className="text-sm text-green-400">{user.email}</p>
//                     </div>
//                   </div>
//                   <div className="space-y-2 text-sm text-green-100">
//                     <p>
//                       <span className="font-semibold text-green-400">Phone:</span>{' '}
//                       {user.phoneNumber}
//                     </p>
//                     <p>
//                       <span className="font-semibold text-green-400">Role:</span>{' '}
//                       <span className="capitalize">{user.role}</span>
//                     </p>
//                     {/* <p>
//                       <span className="font-semibold text-green-400">Active:</span>{' '}
//                       {user.active ? '✔ Yes' : '✖ No'}
//                     </p> */}
//                     <p>
//                       <span className="font-semibold text-green-400">Verified:</span>{' '}
//                       {user.isVerified ? '✔ Yes' : '✖ No'}
//                     </p>
//                   </div>
//                   <div className="flex gap-4 mt-4 text-sm font-medium">
//                     <button
//                       onClick={() => handleUserEdit(user)}
//                       className="text-blue-400 hover:text-blue-300 hover:underline transition"
//                     >
//                       ✏️ Edit
//                     </button>
//                     <button
//                       onClick={() => deleteUser(user._id)}
//                       className="text-red-400 hover:text-red-300 hover:underline transition"
//                     >
//                       🗑️ Delete
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center text-green-300 mt-10 text-lg col-span-full">
//                 No users found.
//               </div>
//             )}
//           </section>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default AdminUserPage;
