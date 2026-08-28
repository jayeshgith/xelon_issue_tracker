import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROLE_LABELS } from '../../constants/options.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { fullName } from '../../utils/formatters.js';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';

const roleTone = {
  admin: 'bg-brand-50 text-brand-700 ring-brand-200',
  developer: 'bg-sky-50 text-sky-700 ring-sky-200',
  user: 'bg-slate-100 text-slate-700 ring-slate-200'
};

const Topbar = ({ menuButton }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {menuButton}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">{fullName(user)}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Badge className={`hidden sm:inline-flex ${roleTone[user?.role] || roleTone.user}`} dot>
            {ROLE_LABELS[user?.role] || 'User'}
          </Badge>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;