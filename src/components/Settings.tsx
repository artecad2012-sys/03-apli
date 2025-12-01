import React, { useRef } from 'react';
import { Ticket, CompanySettings } from '@/types';
import { Download, Upload, Trash2, AlertTriangle, Save, Store } from 'lucide-react';

interface SettingsProps {
  tickets: Ticket[];
  onImport: (data: Ticket[]) => void;
  onClear: () => void;
  companySettings: CompanySettings;
  onUpdateCompany: (settings: CompanySettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ tickets, onImport, onClear, companySettings, onUpdateCompany }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(tickets, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `respaldo_taller_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          onImport(data);
        } else {
          alert('El archivo no tiene el formato correcto.');
        }
      } catch (err) {
        alert('Error al leer el archivo de respaldo.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-3 mb-6">
        <Store className="w-8 h-8 text-neutral-900" />
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Configuración del Negocio</h2>
          <p className="text-neutral-500">Personaliza la información de tu taller y gestiona tus datos.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-100 bg-neutral-50">
          <h3 className="font-semibold text-neutral-900">Perfil de la Empresa</h3>
          <p className="text-sm text-neutral-500">Esta información aparecerá en los tickets impresos.</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre del Negocio</label>
              <input 
                type="text" 
                value={companySettings.name}
                onChange={(e) => onUpdateCompany({...companySettings, name: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Teléfono</label>
              <input 
                type="text" 
                value={companySettings.phone}
                onChange={(e) => onUpdateCompany({...companySettings, phone: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Dirección</label>
              <input 
                type="text" 
                value={companySettings.address}
                onChange={(e) => onUpdateCompany({...companySettings, address: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Términos y Condiciones (Ticket)</label>
              <textarea 
                rows={3}
                value={companySettings.terms}
                onChange={(e) => onUpdateCompany({...companySettings, terms: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-black outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-100 bg-neutral-50">
          <h3 className="font-semibold text-neutral-900">Gestión de Datos</h3>
          <p className="text-sm text-neutral-500">Respalda o restaura tu base de datos local.</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={handleExport}
              className="flex items-center justify-center gap-2 p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all text-neutral-700 font-medium"
            >
              <Download className="w-5 h-5" />
              Exportar Respaldo
            </button>
            
            <button 
              onClick={handleImportClick}
              className="flex items-center justify-center gap-2 p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all text-neutral-700 font-medium"
            >
              <Upload className="w-5 h-5" />
              Importar Respaldo
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden" 
            />
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-100">
             <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-red-100 rounded-lg">
                   <AlertTriangle className="w-5 h-5 text-red-600" />
                 </div>
                 <div>
                   <p className="font-medium text-red-900">Zona de Peligro</p>
                   <p className="text-sm text-red-700">Esta acción no se puede deshacer.</p>
                 </div>
               </div>
               <button 
                 onClick={() => {
                   if(window.confirm('¿ESTÁS SEGURO? Se borrarán todos los tickets y configuraciones.')) {
                     onClear();
                   }
                 }}
                 className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
               >
                 <Trash2 className="w-4 h-4 inline-block mr-2" />
                 Resetear Todo
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;