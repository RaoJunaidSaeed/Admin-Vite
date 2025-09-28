import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [initialFormData, setInitialFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('/default-avatar.png');

  useEffect(() => {
    if (user) {
      const userData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      };
      setFormData(userData);
      setInitialFormData(userData);
      setPreview(user.photo ? user.photo : '/default-avatar.png');
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasChanges =
      selectedFile || Object.keys(formData).some((key) => formData[key] !== initialFormData[key]);

    if (!hasChanges) {
      toast.info('No changes made.');
      return;
    }

    try {
      const form = new FormData();
      form.append('firstName', formData.firstName);
      form.append('lastName', formData.lastName);
      form.append('email', formData.email);
      form.append('phoneNumber', formData.phoneNumber);
      if (selectedFile) form.append('photo', selectedFile);
      // console.log('this is selected', selectedFile, form);

      const res = await API.patch('/v1/users/updateMe', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      // console.log('Update Response:', res);

      if (res.status === 200) {
        toast.success('Profile updated successfully!');
        setEditMode(false);
        setUser?.(res.data.user);
        setPreview(res.data.user.photo || '/default-avatar.png');
        // console.log(res.data.user.photo);
      } else {
        toast.error('Update failed.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error Status:', error.response.status);
        console.error('Error Data:', error.response.data);
        toast.error(error.response.data?.message || 'Update failed.');
      } else {
        console.error(error);
        toast.error('Update failed.');
      }
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setSelectedFile(null);
    setPreview(user.photo ? user.photo : '/default-avatar.png');
    setEditMode(false);
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 py-12 px-3 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-2xl shadow-2xl p-4 sm:p-12 space-y-10">
          <h1 className="text-3xl pt-3 font-extrabold text-white text-center">My Profile</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
              {/* Left Form Fields */}
              <div className="space-y-6">
                {['firstName', 'lastName', 'email', 'phoneNumber'].map((field) => (
                  <div key={field}>
                    <label className="text-green-300 text-sm capitalize block mb-1">
                      {field === 'phoneNumber' ? 'Phone Number' : field.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      disabled={field === 'email' || !editMode}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                  </div>
                ))}

                <div>
                  <label className="text-green-300 text-sm block mb-1">Role</label>
                  <div className="bg-white/10 border border-white/20 px-4 py-3 rounded-lg capitalize">
                    {user?.role || 'User'}
                  </div>
                </div>
              </div>

              {/* Right Profile Image & Actions */}
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-green-400 shadow-xl relative group">
                  <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                  {editMode && (
                    <label className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-sm text-green-200 px-3 py-1 rounded cursor-pointer">
                      📸 Change Photo
                      <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        hidden
                      />
                    </label>
                  )}
                </div>

                {editMode ? (
                  <>
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-lg transition focus:ring-2 focus:ring-green-400"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="text-red-400 hover:underline text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-lg transition focus:ring-2 focus:ring-green-400"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;

// import React, { useContext, useEffect, useState } from 'react';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import { AuthContext } from '../context/AuthContext';
// import API from '../api/axios';
// import { toast } from 'react-toastify';

// const ProfilePage = () => {
//   const { user, setUser } = useContext(AuthContext);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phoneNumber: '',
//   });

//   const [initialFormData, setInitialFormData] = useState({});
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [preview, setPreview] = useState('/default-avatar.png');

//   useEffect(() => {
//     if (user) {
//       const userData = {
//         firstName: user.firstName || '',
//         lastName: user.lastName || '',
//         email: user.email || '',
//         phoneNumber: user.phoneNumber || '',
//       };
//       setFormData(userData);
//       setInitialFormData(userData);
//       setPreview(
//         user.photo ? `http://localhost:5000/uploads/${user.photo}` : '/default-avatar.png'
//       );
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const hasChanges =
//       selectedFile || Object.keys(formData).some((key) => formData[key] !== initialFormData[key]);

//     if (!hasChanges) {
//       toast.info('No changes made.');
//       return;
//     }

//     try {
//       const form = new FormData();
//       form.append('firstName', formData.firstName);
//       form.append('lastName', formData.lastName);
//       form.append('email', formData.email);
//       form.append('phoneNumber', formData.phoneNumber);
//       if (selectedFile) form.append('photo', selectedFile);

//       const res = await API.patch('/v1/users/updateMe', form, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         withCredentials: true,
//       });
//       console.log('Update Response:', res);

//       if (res.status === 200) {
//         toast.success('Profile updated successfully!');
//         setEditMode(false);
//         setUser?.(res.data.user);
//       } else {
//         toast.error('Update failed.');
//       }
//     } catch (error) {
//       if (error.response) {
//         console.error('Error Status:', error.response.status);
//         console.error('Error Data:', error.response.data);
//         toast.error(error.response.data?.message || 'Update failed.');
//       } else {
//         console.error(error);
//         toast.error('Update failed.');
//       }
//     }
//   };

//   const handleCancel = () => {
//     setFormData(initialFormData);
//     setSelectedFile(null);
//     setPreview(user.photo ? `http://localhost:5000/uploads/${user.photo}` : '/default-avatar.png');
//     setEditMode(false);
//   };

//   return (
//     <>
//       <Navbar />
//       <main className="min-h-screen py-10 px-4 bg-gradient-to-br from-[#0f2f28] to-[#043e2f]">
//         <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-6 sm:p-10">
//           <h1 className="text-4xl font-bold text-green-100 text-center mb-6">My Profile</h1>

//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-green-100">
//               {/* Left Form */}
//               <div className="space-y-4">
//                 {['firstName', 'lastName', 'email', 'phoneNumber'].map((field) => (
//                   <div key={field}>
//                     <label className="text-green-200 text-sm capitalize">
//                       {field === 'phoneNumber' ? 'Phone Number' : field.replace(/([A-Z])/g, ' $1')}
//                     </label>
//                     <input
//                       type={field === 'email' ? 'email' : 'text'}
//                       name={field}
//                       value={formData[field]}
//                       onChange={handleChange}
//                       disabled={field === 'email' || !editMode}
//                       className="w-full mt-1 p-3 bg-green-900/20 border border-white/10 rounded-md text-white"
//                     />
//                   </div>
//                 ))}

//                 <div>
//                   <label className="text-green-200 text-sm">Role</label>
//                   <div className="bg-green-900/20 p-3 rounded-md border border-white/10 capitalize">
//                     {user?.role || 'User'}
//                   </div>
//                 </div>
//               </div>

//               {/* Right Section: Image + Buttons */}
//               <div className="flex flex-col items-center justify-center gap-4">
//                 <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-300 shadow-lg relative group">
//                   <img src={preview} alt="Profile" className="w-full h-full object-cover" />
//                   {editMode && (
//                     <label className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-sm text-green-300 px-3 py-1 rounded cursor-pointer">
//                       📸 Change Photo
//                       <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
//                     </label>
//                   )}
//                 </div>

//                 {editMode ? (
//                   <>
//                     <button
//                       type="submit"
//                       className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition"
//                     >
//                       Save Changes
//                     </button>
//                     <button
//                       type="button"
//                       onClick={handleCancel}
//                       className="text-red-400 hover:underline"
//                     >
//                       Cancel
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <button
//                       type="button"
//                       onClick={() => setEditMode(true)}
//                       className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition"
//                     >
//                       Edit Profile
//                     </button>
//                     {/* <button
//                       type="button"
//                       className="bg-transparent text-green-300 border border-green-400 px-4 py-2 rounded-lg hover:bg-green-900/30 transition"
//                     >
//                       Change Password
//                     </button> */}
//                   </>
//                 )}
//               </div>
//             </div>
//           </form>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default ProfilePage;
