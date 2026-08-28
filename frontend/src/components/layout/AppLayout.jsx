import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Button from '../common/Button.jsx';
import Breadcrumbs from './Breadcrumbs.jsx';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-bg min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <Topbar
          menuButton={
            <Button
              aria-label="Open navigation"
              title="Open navigation"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </Button>
          }
        />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;