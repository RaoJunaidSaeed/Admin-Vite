import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: '',
    passwordConfirm: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.patch(`/v1/auth/resetPassword/${token}`, form);

      if (res.data.status === 'success') {
        toast.success('Password reset successful! Login to continue.');
        navigate('/login'); // or /login if you want them to log in again
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-green-900 py-12 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg ring-1 ring-white/15 rounded-2xl shadow-2xl p-8 sm:p-10 space-y-6">
        <h2 className="text-3xl font-extrabold text-white text-center">Reset Your Password</h2>

        <form onSubmit={handleReset} className="space-y-5">
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
          <input
            type="password"
            name="passwordConfirm"
            placeholder="Confirm Password"
            value={form.passwordConfirm}
            onChange={handleChange}
            required
            className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition focus:ring-2 focus:ring-green-400 disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import API from '../api/axios';
// import { toast } from 'react-toastify';

// const ResetPassword = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     password: '',
//     passwordConfirm: '',
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleReset = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await API.patch(`/v1/auth/resetPassword/${token}`, form);

//       if (res.data.status === 'success') {
//         toast.success('Password reset successful! Login to continue.');
//         navigate('/login'); // or /login if you want them to log in again
//       }
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Failed to reset password';
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-brand-light">
//       <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold text-brand-dark text-center mb-6">Reset Your Password</h2>
//         <form onSubmit={handleReset} className="space-y-4">
//           <input
//             type="password"
//             name="password"
//             placeholder="New Password"
//             className="input"
//             value={form.password}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="password"
//             name="passwordConfirm"
//             placeholder="Confirm Password"
//             className="input"
//             value={form.passwordConfirm}
//             onChange={handleChange}
//             required
//           />
//           <button type="submit" className="btn-primary" disabled={loading}>
//             {loading ? 'Resetting...' : 'Reset Password'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;
