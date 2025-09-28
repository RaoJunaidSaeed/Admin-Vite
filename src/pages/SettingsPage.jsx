import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, User, MessageCircle, CreditCard, ClipboardList, LogOut } from 'lucide-react';
import AdminSupportChat from '../components/AdminSupportChat';

export default function SettingsPage() {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState('profile');

  const sidebarItems = [
    { id: 'profile', label: 'User Profile', icon: <User size={20} /> },
    { id: 'chats', label: 'Chats', icon: <MessageCircle size={20} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={20} /> },
    { id: 'requests', label: 'Requests', icon: <ClipboardList size={20} /> },
    { id: 'logout', label: 'Logout', icon: <LogOut size={20} /> },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'profile':
        return <div className="p-6">👤 User Profile Page</div>;
      case 'chats':
        return (
          <div className="p-6">
            <AdminSupportChat adminId={user._id} />
          </div>
        );
      case 'payments':
        return <div className="p-6">💳 Payments Page</div>;
      case 'requests':
        return <div className="p-6">📋 Requests Page</div>;
      case 'logout':
        return <div className="p-6">🚪 Logging out...</div>;
      default:
        return <div className="p-6">Select an option</div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform bg-gray-900 text-white w-64 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 lg:hidden">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
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
      </div>

      {/* Main content */}
      <div className="flex-1 lg:w-4/5 bg-gray-100 overflow-auto">
        {/* Top bar for mobile */}
        <div className="flex items-center justify-between p-4 bg-white shadow lg:hidden">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button onClick={() => setIsOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
        {renderPage()}
      </div>
    </div>
  );
}
