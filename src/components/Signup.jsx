import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios'; // ← Use custom axios
import { toast } from 'react-toastify';

const Signup = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phoneNumber: '',
    role: 'admin',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/v1/auth/signup', form);
      if (res.data.status === 'success') {
        setOtpSent(true);
        toast.success('OTP sent to your email.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const res = await API.post('/v1/auth/verifyOTP', {
        email: form.email,
        otp,
      });
      if (res.data.status === 'success') {
        toast.success('OTP Verified! Signup complete.');
        navigate('/login'); // Redirect to login after successful verification
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await API.post('/v1/auth/resendOTP', {
        email: form.email,
      });
      toast.success(res.data.message || 'OTP resent');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url('/images/hero1.jpg')` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-green-900/60 to-black/70 backdrop-blur-sm" />

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-xl bg-white/10 backdrop-blur-lg ring-1 ring-white/20 p-8 m-4 sm:p-10 rounded-2xl shadow-2xl space-y-6">
        <h2 className="text-3xl font-extrabold text-white text-center">Sign Up</h2>
        <p className="text-sm text-green-300 text-center">
          Join Rentofix — Simplifying Your Rental Journey
        </p>

        {!otpSent ? (
          <>
            <form onSubmit={handleSignup} className="space-y-4">
              {['firstName', 'lastName', 'email', 'phoneNumber'].map((field, i) => (
                <input
                  key={i}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  name={field}
                  type={field === 'email' ? 'email' : 'text'}
                  placeholder={
                    field === 'firstName'
                      ? 'First Name'
                      : field === 'lastName'
                      ? 'Last Name'
                      : field === 'phoneNumber'
                      ? 'Phone Number'
                      : 'Email'
                  }
                  onChange={handleChange}
                  required
                />
              ))}

              <input
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <input
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                name="passwordConfirm"
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
                required
              />
              {/* <select
                className="w-full  bg-green-900 text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2A5942] appearance-none"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="admin" className="bg-[#04784E78] text-white" disabled>
                  Admin
                </option>
              </select> */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition focus:ring-2 focus:ring-green-400"
              >
                Sign Up
              </button>
            </form>

            <div className="text-sm text-center space-y-3 pt-6">
              <p className="text-green-100">
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-green-300 font-medium hover:underline"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
              </p>
              <button
                type="button"
                className="text-green-300 hover:underline"
                onClick={() => navigate('/')}
              >
                Back to Home
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <input
              className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              value={otp}
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition focus:ring-2 focus:ring-green-400"
              onClick={handleVerifyOTP}
            >
              Verify OTP
            </button>
            <button
              className="w-full border border-green-500 text-green-300 hover:bg-green-600 hover:text-white font-semibold py-3 rounded-lg transition focus:ring-2 focus:ring-green-400"
              onClick={handleResendOTP}
            >
              Resend OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
