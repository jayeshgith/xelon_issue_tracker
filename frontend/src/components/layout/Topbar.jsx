import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROLE_LABELS } from '../../constants/options.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { fullName } from '../../utils/formatters.js';
import Button from '../common/Button.jsx';

const Topbar = ({ menuButton }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {menuButton}
          <div>
            <p className="text-sm font-semibold text-slate-950">{fullName(user)}</p>
            <p className="text-xs text-slate-500">{ROLE_LABELS[user?.role] || 'User'}</p>
          </div>
        </div>
        <Button title="Logout" variant="secondary" onClick={handleLogout}>
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Topbar;
