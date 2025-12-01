import React from 'react';
import { Ticket, TicketStatus, CompanySettings } from '@/types';
import { Smartphone } from 'lucide-react';

interface PrintLayoutProps {
  data: Ticket | null;
  format: 'ticket' | 'a5';
  companySettings: CompanySettings;
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({ data, format, companySettings }) => {
  if (!data) return null;

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString() + ' ' + new Date(ts).toLocaleTimeString();

  return (
    <div className="print-only">
      <div className={format === 'ticket' ? 'print-format-ticket' : 'hidden'}>
        <div className="text-center mb-4 border-b border-black pb-2">
          <h1 className="text-xl font-bold uppercase">{companySettings.name}</h1>
          <p className="text-xs mt-1">{companySettings.address}</p>
          <p className="text-xs">Tel: {companySettings.phone}</p>
        </div>

        <div className="mb-4">
          <p><strong>Orden:</strong> #{data.id.slice(-6).toUpperCase()}</p>
          <p><strong>Fecha:</strong> {formatDate(data.createdAt)}</p>
          <p><strong>Cliente:</strong> {data.customerName}</p>
        </div>

        <div className="mb-4 border-b border-black pb-2">
          <p><strong>Equipo:</strong> {data.deviceModel}</p>
          <p><strong>Falla:</strong> {data.issueDescription}</p>
        </div>

        <div className="flex justify-between font-bold text-lg mb-4">
          <span>Total Est:</span>
          <span>${data.priceQuote}</span>
        </div>

        <div className="text-center text-xs mt-6">
          <p>{companySettings.terms.substring(0, 100)}...</p>
          <div className="mt-2 text-[10px] text-gray-500">
             Sistema TechFix Pro
          </div>
        </div>
      </div>

      <div className={format === 'a5' ? 'print-format-a5' : 'hidden'}>
        <div className="flex justify-between items-start border-b-2 border-neutral-200 pb-6 mb-8">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-black text-white rounded-lg">
               <Smartphone className="w-8 h-8" />
             </div>
             <div>
               <h1 className="text-2xl font-bold text-neutral-900">{companySettings.name}</h1>
               <p className="text-sm text-neutral-500">{companySettings.address}</p>
               <p className="text-sm text-neutral-500">{companySettings.phone}</p>
             </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-mono font-bold text-neutral-900">ORDEN #{data.id.slice(-6).toUpperCase()}</h2>
            <p className="text-sm text-neutral-500 mt-1">Fecha: {formatDate(data.createdAt)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-8">
          <div>
            <h3 className="text-xs font-bold uppercase text-neutral-400 mb-2">Cliente</h3>
            <p className="text-lg font-bold text-neutral-900">{data.customerName}</p>
            <p className="text-neutral-600">{data.customerPhone}</p>
          </div>
          <div>
             <h3 className="text-xs font-bold uppercase text-neutral-400 mb-2">Estado Actual</h3>
             <span className="inline-block px-3 py-1 bg-neutral-100 rounded-md font-medium text-neutral-900">
               {data.status}
             </span>
          </div>
        </div>

        <div className="bg-neutral-50 rounded-xl p-6 mb-8">
          <h3 className="text-sm font-bold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">Detalles del Servicio</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-2">
              <p className="font-medium text-neutral-900">{data.deviceModel}</p>
              <p className="text-sm text-neutral-500">{data.issueDescription}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-neutral-900">${data.priceQuote.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 pt-4 flex justify-between items-center">
             <span className="font-bold text-lg">Total Estimado</span>
             <span className="font-bold text-2xl">${data.priceQuote.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-xs font-bold uppercase text-neutral-400 mb-2">Términos y Condiciones</h3>
          <p className="text-xs text-neutral-500 text-justify leading-relaxed">
            {companySettings.terms}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12 mt-auto">
          <div className="border-t border-neutral-300 pt-2 text-center">
            <p className="text-sm font-medium">Firma del Cliente</p>
          </div>
          <div className="border-t border-neutral-300 pt-2 text-center">
            <p className="text-sm font-medium">Firma del Técnico</p>
          </div>
        </div>
      </div>
    </div>
  );
};