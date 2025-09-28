// App.jsx
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './context/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signup from './components/Signup';
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import PaymentPage from './pages/PaymentPage';
import ListPropertyPage from './pages/ListPropertyPage'; // adjust the path if it's in a different folder
import PropertyDetails from './pages/PropertyDetails';
import UserProfile from './pages/UserProfile';
import RequestsPage from './components/RequestsSection';
import ResetPassword from './components/ResetPassword';
import AdminUserPage from './pages/AdminUserPage';
import AdminPlans from './pages/AdminPlans';
import AdminPaymentPage from './pages/AdminPaymentPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingOverlay from './components/LoadingOverlay';
import SettingsPage from './pages/SettingsPage';

function Layout({ children }) {
  const location = useLocation();

  // hide navbar + footer on settings page
  const hideLayout = location.pathname === '/settings';

  return (
    <>
      {!hideLayout && <Navbar />}
      <LoadingOverlay />
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <LoadingOverlay />
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUserPage />} />
            <Route path="/admin/plans" element={<AdminPlans />} />
            <Route path="/admin/payments" element={<AdminPaymentPage />} />
            <Route path="/payment/:planId" element={<PaymentPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/add-property" element={<ListPropertyPage />} />
            <Route path="/owner/requests" element={<RequestsPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
