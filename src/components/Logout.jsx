import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Logout() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="text-cherry font-semibold hover:bg-cherry/10 px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
}
