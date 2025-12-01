import React from 'react';
import { Smartphone, LayoutDashboard, FilePlus, FileText, Settings, Menu, X, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  companyName?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onLogout, companyName = 'TechFix Pro' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-ticket', label: 'Ingreso', icon: FilePlus },
    { id: 'tickets', label: 'Reparaciones', icon: Smartphone },
    { id: 'reports', label: 'Reportes', icon: FileText },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-neutral-100 overflow-hidden no-print">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-black text-white transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight truncate">{companyName}</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === item.id 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 shrink-0 space-y-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-neutral-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>

          <div className="bg-neutral-900 rounded-xl p-4">
            <p className="text-xs text-neutral-400 mb-1">Estado del Sistema</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">En línea</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 -ml-2 text-neutral-600"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
             <span className="text-sm font-medium text-neutral-600 hidden md:block">{companyName}</span>
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-bold text-neutral-600">
              AD
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
export default Layout;