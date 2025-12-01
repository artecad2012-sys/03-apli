import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import Reports from './components/Reports';
import Settings from './components/Settings';
import { PrintLayout } from './components/PrintLayout';
import { Ticket, TicketStatus, CompanySettings } from './types';
import { Smartphone, Lock, ArrowRight, Loader2, HelpCircle, X, Globe, CheckSquare } from 'lucide-react';

const DEFAULT_COMPANY: CompanySettings = {
  name: 'Mi Centro de Servicio',
  address: 'Av. Principal 123, Ciudad',
  phone: '+52 555 000 0000',
  terms: 'Garantía de 30 días en mano de obra. No nos hacemos responsables por equipos abandonados después de 30 días.'
};

const injectStyles = () => {
  if (typeof window === 'undefined') return;
  // @ts-ignore
  const isTailwindLoaded = typeof window.tailwind !== 'undefined';

  if (!isTailwindLoaded) {
    console.log("Tailwind not detected. Injecting fallback...");
    const script = document.createElement('script');
    script.src = "https://cdn.tailwindcss.com";
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.tailwind) {
        // @ts-ignore
        window.tailwind.config = {
          theme: {
            extend: {
              fontFamily: { sans: ['Inter', 'sans-serif'] },
              colors: {
                neutral: {
                  50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db',
                  400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151',
                  800: '#1f2937', 900: '#111827', 950: '#030712',
                }
              }
            }
          }
        };
      }
    };
    document.head.appendChild(script);
  }

  const existingFont = document.querySelector('link[href*="fonts.googleapis"]');
  if (!existingFont) {
    const link = document.createElement('link');
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
  }

  const styleId = 'techfix-base-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      body { font-family: 'Inter', sans-serif; background-color: #f9fafb; color: #111827; }
      input, textarea, button { font-family: inherit; }
    `;
    document.head.appendChild(style);
  }
};

const LoginScreen: React.FC<{ onLogin: (remember: boolean) => void, companyName: string, companyLogo?: string }> = ({ onLogin, companyName, companyLogo }) => {
  const [pin, setPin] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    injectStyles();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    const storedPin = localStorage.getItem('techfix_pin') || '1234';
    
    setTimeout(() => {
      if (pin === storedPin) {
        onLogin(remember);
      } else {
        setError(true);
        setPin('');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Acceso y Publicación
              </h3>
              <button onClick={() => setShowHelp(false)} className="text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-sm text-neutral-600">
              <p>
                <strong className="text-neutral-900">¿Cómo uso esto en mi negocio?</strong><br/>
                Actualmente estás en modo "Prueba". Para usarlo con una dirección web real (ej. <em>taller-juan.com</em>), el código debe subirse a un proveedor de hosting.
              </p>
              <div className="p-3 bg-neutral-100 rounded-lg">
                <p className="font-medium text-neutral-900 mb-1">Pasos a seguir:</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Inicia sesión con el PIN (Por defecto: <strong>1234</strong>).</li>
                  <li>Ve a la pestaña <strong>Configuración</strong>.</li>
                  <li>Personaliza el nombre de tu negocio.</li>
                  <li>Lee la guía de "Publicación Web" allí mismo.</li>
                </ol>
              </div>
            </div>
            <button 
              onClick={() => setShowHelp(false)}
              className="w-full mt-6 bg-neutral-900 text-white py-3 rounded-xl font-medium"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-neutral-100 relative">
        <button 
          onClick={() => setShowHelp(true)}
          className="absolute top-4 right-4 text-neutral-400 hover:text-blue-600 transition-colors"
          title="Ayuda de Acceso"
        >
          <HelpCircle className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-neutral-100 overflow-hidden">
            {companyLogo ? (
              <img src={companyLogo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Smartphone className="w-8 h-8 text-neutral-900" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">{companyName}</h1>
          <p className="text-neutral-500">Sistema de Gestión de Soporte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 text-center">
              Ingrese su PIN de Acceso
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                autoFocus
                className={`
                  w-full pl-12 pr-4 py-4 bg-neutral-50 border rounded-xl text-center text-2xl font-bold tracking-[0.5em] outline-none transition-all
                  ${error ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-neutral-200 focus:border-black focus:ring-2 focus:ring-neutral-100'}
                `}
                placeholder="••••"
                value={pin}
                onChange={(e) => {
                  setError(false);
                  setPin(e.target.value.replace(/\D/g, '').slice(0, 4));
                }}
              />
            </div>
          </div>

          <div 
            className="flex items-center justify-center gap-2 cursor-pointer group"
            onClick={() => setRemember(!remember)}
          >
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${remember ? 'bg-black border-black' : 'border-neutral-300 bg-white'}`}>
              {remember && <CheckSquare className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="text-sm text-neutral-600 group-hover:text-neutral-900 select-none">Mantener sesión iniciada</span>
          </div>

          <button
            type="submit"
            disabled={loading || pin.length < 4}
            className="w-full bg-black text-white py-4 rounded-xl font-medium text-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Iniciar Sesión <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
        
        {error && (
          <p className="text-red-500 text-sm text-center mt-4 animate-pulse">
            PIN incorrecto. Intente nuevamente.
          </p>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(DEFAULT_COMPANY);
  const [printData, setPrintData] = useState<{data: Ticket, format: 'ticket' | 'a5'} | null>(null);

  useEffect(() => {
    injectStyles();
    const persistentSession = localStorage.getItem('techfix_session_persist');
    const tempSession = sessionStorage.getItem('techfix_session');
    
    if (persistentSession === 'active' || tempSession === 'active') {
      setIsAuthenticated(true);
    }

    const savedTickets = localStorage.getItem('techfix_tickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    } else {
      setTickets([
        {
          id: '170982',
          customerId: 'c1',
          customerName: 'María García',
          customerPhone: '555-0123',
          deviceModel: 'iPhone 12',
          issueDescription: 'Pantalla rota, touch no responde',
          status: TicketStatus.IN_PROGRESS,
          priceQuote: 120,
          createdAt: Date.now() - 10000000,
          updatedAt: Date.now() - 500000,
          history: []
        }
      ]);
    }

    const savedCompany = localStorage.getItem('techfix_company');
    if (savedCompany) {
      setCompanySettings(JSON.parse(savedCompany));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('techfix_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('techfix_company', JSON.stringify(companySettings));
  }, [companySettings]);

  const handleLogin = (remember: boolean) => {
    if (remember) {
      localStorage.setItem('techfix_session_persist', 'active');
    } else {
      sessionStorage.setItem('techfix_session', 'active');
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('techfix_session_persist');
    sessionStorage.removeItem('techfix_session');
    setIsAuthenticated(false);
  };

  const handleCreateTicket = (newTicketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => {
    const newTicket: Ticket = {
      ...newTicketData,
      id: Math.floor(100000 + Math.random() * 900000).toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      history: [{ status: TicketStatus.RECEIVED, timestamp: Date.now() }]
    };
    setTickets([newTicket, ...tickets]);
    setActiveTab('tickets');
  };

  const handleStatusUpdate = (id: string, newStatus: TicketStatus) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: newStatus,
          updatedAt: Date.now(),
          history: [...t.history, { status: newStatus, timestamp: Date.now() }]
        };
      }
      return t;
    }));
  };

  const handlePrint = (ticket: Ticket, format: 'ticket' | 'a5') => {
    setPrintData({ data: ticket, format });
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleImport = (importedData: Ticket[]) => {
    if (window.confirm('Al importar datos se sobrescribirá la información actual. ¿Deseas continuar?')) {
      setTickets(importedData);
      setActiveTab('dashboard');
      alert('Datos importados correctamente.');
    }
  };

  const handleClear = () => {
    setTickets([]);
    localStorage.removeItem('techfix_tickets');
    alert('Sistema restablecido.');
  };

  const Dashboard = () => (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">Hola, Administrador</h2>
        <p className="text-neutral-500">Bienvenido al panel de {companySettings.name}.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pendientes', val: tickets.filter(t => t.status !== TicketStatus.DELIVERED && t.status !== TicketStatus.CANCELLED).length, color: 'bg-yellow-500' },
          { label: 'Listos', val: tickets.filter(t => t.status === TicketStatus.READY).length, color: 'bg-green-500' },
          { label: 'Entregados (Total)', val: tickets.filter(t => t.status === TicketStatus.DELIVERED).length, color: 'bg-neutral-800' },
          { label: 'Ingresos Totales', val: '$' + tickets.filter(t => t.status === TicketStatus.DELIVERED).reduce((a,b) => a + b.priceQuote, 0), color: 'bg-neutral-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-neutral-500 font-medium mb-1">{stat.label}</p>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-8 rounded-full ${stat.color}`}></div>
              <p className="text-3xl font-bold text-neutral-900">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} companyName={companySettings.name} companyLogo={companySettings.logo} />;
  }

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout}
        companyName={companySettings.name}
        companyLogo={companySettings.logo}
      >
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'new-ticket' && <TicketForm onSubmit={handleCreateTicket} />}
        {activeTab === 'tickets' && <TicketList tickets={tickets} onStatusUpdate={handleStatusUpdate} onPrint={handlePrint} />}
        {activeTab === 'reports' && <Reports tickets={tickets} />}
        {activeTab === 'settings' && (
          <Settings 
            tickets={tickets} 
            onImport={handleImport} 
            onClear={handleClear} 
            companySettings={companySettings}
            onUpdateCompany={setCompanySettings}
          />
        )}
      </Layout>
      
      {printData && (
        <PrintLayout 
          data={printData.data} 
          format={printData.format} 
          companySettings={companySettings} 
        />
      )}
    </>
  );
};

export default App;