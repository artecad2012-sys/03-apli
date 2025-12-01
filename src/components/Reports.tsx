import React, { useEffect, useState } from 'react';
import { Ticket, TicketStatus } from '@/types';
import { generateReportSummary } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Sparkles, TrendingUp, DollarSign, Users } from 'lucide-react';

interface ReportsProps {
  tickets: Ticket[];
}

const Reports: React.FC<ReportsProps> = ({ tickets }) => {
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  const totalRevenue = tickets
    .filter(t => t.status === TicketStatus.DELIVERED)
    .reduce((acc, t) => acc + t.priceQuote, 0);
  
  const pendingCount = tickets.filter(t => t.status !== TicketStatus.DELIVERED && t.status !== TicketStatus.CANCELLED).length;
  const completedCount = tickets.filter(t => t.status === TicketStatus.DELIVERED).length;

  const statusData = [
    { name: 'En Proceso', value: tickets.filter(t => t.status === TicketStatus.IN_PROGRESS || t.status === TicketStatus.DIAGNOSING).length },
    { name: 'Listos', value: tickets.filter(t => t.status === TicketStatus.READY).length },
    { name: 'Entregados', value: tickets.filter(t => t.status === TicketStatus.DELIVERED).length },
  ];

  useEffect(() => {
    const fetchSummary = async () => {
      setLoadingSummary(true);
      const summary = await generateReportSummary(tickets);
      setAiSummary(summary || "No se pudo generar el resumen.");
      setLoadingSummary(false);
    };

    if (tickets.length > 0) {
      fetchSummary();
    }
  }, [tickets]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Reportes y Estadísticas</h2>
        <p className="text-neutral-500">Visión general del rendimiento del taller.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Ingresos Totales</p>
              <h3 className="text-2xl font-bold text-neutral-900">${totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Reparaciones Activas</p>
              <h3 className="text-2xl font-bold text-neutral-900">{pendingCount}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Clientes Atendidos</p>
              <h3 className="text-2xl font-bold text-neutral-900">{completedCount}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold">Insights de Gemini AI</h3>
            </div>
            
            {loadingSummary ? (
              <div className="animate-pulse space-y-3">
                <div className="h-2 bg-white/20 rounded w-3/4"></div>
                <div className="h-2 bg-white/20 rounded w-full"></div>
                <div className="h-2 bg-white/20 rounded w-5/6"></div>
              </div>
            ) : (
              <p className="text-neutral-300 leading-relaxed">
                {aiSummary || "No hay suficientes datos para generar un reporte inteligente aún."}
              </p>
            )}

            <div className="mt-8 flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-widest font-medium">
              Actualizado hace un momento
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-neutral-900 mb-6">Estado de Órdenes</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#fbbf24' : index === 1 ? '#22c55e' : '#171717'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Reports;