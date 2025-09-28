import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Home, User, FileText, CreditCard, Settings, Menu, X } from 'lucide-react';
import AdminSupportChat from '../components/AdminSupportChat';
import Logout from '../components/Logout';
import AdminDashboard from './AdminDashboard';
import { useNavigate } from 'react-router-dom';
import AdminUserPage from './AdminUserPage';
import AdminPlans from './AdminPlans';
import AdminPaymentPage from './AdminPaymentPage';
import UserProfile from './UserProfile';

export default function AdminSettingsPage() {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState('profile');
  const navigate = useNavigate();

  // Sidebar items (no more paths — just ids)
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'users', label: 'Users', icon: <User size={20} /> },
    { id: 'plans', label: 'Plans', icon: <FileText size={20} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'chats', label: 'Support Chat', icon: <FileText size={20} /> },
  ];

  // Render main content based on activePage
  const renderPage = () => {
    switch (activePage) {
      case 'properties':
        return (
          <div className="px-1">
            <AdminDashboard />
          </div>
        );
      case 'users':
        return (
          <div className="px-1">
            <AdminUserPage />
          </div>
        );
      case 'plans':
        return (
          <div className="px-1">
            <AdminPlans />
          </div>
        );
      case 'payments':
        return (
          <div className="px-1">
            <AdminPaymentPage />
          </div>
        );
      case 'profile':
        return (
          <div className="px-1">
            <UserProfile />
          </div>
        );
      case 'chats':
        return (
          <div className="px-1 flex flex-col h-full bg-gray-50">
            <div className="flex overflow-scroll bg-gradient-to-br from-gray-900 to-green-900">
              <AdminSupportChat adminId={user._id} />
            </div>
          </div>
        );
      default:
        return <div className="px-1">Select an option</div>;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 px-6 bg-white shadow">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Settings</h1>
        </div>
        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-200"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Main Section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`flex flex-col fixed inset-y-0 left-0 transform bg-gradient-to-br from-gray-900 to-green-900 text-white w-64 sm:w-56 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 z-50 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-4 lg:hidden">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <nav className="mt-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'dashboard') {
                    navigate(user?.role === 'admin' ? '/admin-dashboard' : '/');
                    setIsOpen(false);
                    return;
                  }

                  setActivePage(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-6 py-3 w-full text-left hover:bg-gray-700 transition ${
                  activePage === item.id ? 'bg-gray-700' : ''
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          {/* Logout pinned at bottom */}
          <div className="p-4 border-t border-gray-700 mt-auto">
            <Logout />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 overflow-auto px-1">{renderPage()}</div>
      </div>
    </div>
  );
}
