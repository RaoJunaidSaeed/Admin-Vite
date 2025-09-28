import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useContext(AuthContext); // ✅ Get login from AuthContext

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const from = location.state?.from?.pathname || null;

    try {
      const res = await API.post('/v1/auth/login', form, { withCredentials: true });

      if (res.data.status === 'success') {
        toast.success('Login successful!');
        const user = res.data.data.user;

        login(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', res.data.token); // ⬅️ important for PrivateRoute

        // ✅ Redirect
        if (from && from !== '/login') {
          navigate(from, { replace: true });
        } else {
          // fallback
          if (user.role === 'admin') {
            navigate('/admin-dashboard', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      toast.error('Please enter your email address first.');
      return;
    }

    try {
      setForgotLoading(true);
      const res = await API.post('/v1/auth/forgotPassword', { email: form.email });

      if (res.data.status === 'success') {
        toast.success('Password reset link sent to your email.');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send reset link.';
      toast.error(message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url('/images/hero1.jpg')` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-green-900/60 to-black/70 backdrop-blur-sm  " />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-xl bg-white/10 backdrop-blur-lg ring-1 ring-white/20 p-8 m-4 sm:p-10 rounded-2xl shadow-2xl space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center">Login</h2>
        <p className="text-sm sm:text-base text-green-300 text-center">Welcome back to Rentofix</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition focus:ring-2 focus:ring-green-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Links */}
        <div className="text-center text-sm space-y-4 mt-6">
          <button
            onClick={handleForgotPassword}
            type="button"
            disabled={forgotLoading}
            className="text-green-200 hover:underline disabled:opacity-50"
          >
            {forgotLoading ? 'Sending reset link...' : 'Forgot Password?'}
          </button>
          <div className="flex justify-center items-center gap-2">
            <span className="text-green-100">Don't have an account?</span>
            <button
              type="button"
              className="text-green-300 font-medium hover:underline"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
          <button
            type="button"
            className="text-green-300 hover:underline transition"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
