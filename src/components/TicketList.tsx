import React from 'react';
import { Ticket, TicketStatus } from '@/types';
import { Search, Clock, CheckCircle2, AlertCircle, Printer, ChevronRight } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  onStatusUpdate: (id: string, status: TicketStatus) => void;
  onPrint: (ticket: Ticket, format: 'ticket' | 'a5') => void;
}

const statusColors: Record<TicketStatus, string> = {
  [TicketStatus.RECEIVED]: 'bg-blue-100 text-blue-700',
  [TicketStatus.DIAGNOSING]: 'bg-purple-100 text-purple-700',
  [TicketStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-700',
  [TicketStatus.READY]: 'bg-green-100 text-green-700',
  [TicketStatus.DELIVERED]: 'bg-neutral-100 text-neutral-700',
  [TicketStatus.CANCELLED]: 'bg-red-100 text-red-700',
};

const TicketList: React.FC<TicketListProps> = ({ tickets, onStatusUpdate, onPrint }) => {
  const [filter, setFilter] = React.useState('ACTIVE');
  const [search, setSearch] = React.useState('');

  const filteredTickets = tickets
    .filter(t => {
      if (filter === 'ACTIVE') return t.status !== TicketStatus.DELIVERED && t.status !== TicketStatus.CANCELLED;
      return true;
    })
    .filter(t => 
      t.customerName.toLowerCase().includes(search.toLowerCase()) || 
      t.deviceModel.toLowerCase().includes(search.toLowerCase()) ||
      t.id.includes(search)
    )
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Ordenes de Reparación</h2>
          <p className="text-neutral-500">Gestiona el estado y flujo de trabajo.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-neutral-200 shadow-sm">
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${filter === 'ACTIVE' ? 'bg-black text-white shadow' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            Activos
          </button>
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${filter === 'ALL' ? 'bg-black text-white shadow' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            Historial
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          placeholder="Buscar por cliente, modelo o ID..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredTickets.map(ticket => (
          <div key={ticket.id} className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-mono font-medium text-neutral-400">#{ticket.id.slice(-6).toUpperCase()}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[ticket.status]}`}>
                  {ticket.status}
                </span>
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(ticket.updatedAt).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-neutral-900">{ticket.deviceModel}</h3>
              <p className="text-sm text-neutral-600 mb-2">{ticket.issueDescription}</p>
              
              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <span className="flex items-center gap-1">
                  <span className="font-medium text-neutral-900">{ticket.customerName}</span>
                </span>
                <span>•</span>
                <span>${ticket.priceQuote}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-neutral-100">
              <div className="flex gap-2 mr-2">
                {ticket.status === TicketStatus.RECEIVED && (
                  <button 
                    onClick={() => onStatusUpdate(ticket.id, TicketStatus.DIAGNOSING)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    Iniciar Diagnóstico
                  </button>
                )}
                {ticket.status === TicketStatus.DIAGNOSING && (
                  <button 
                    onClick={() => onStatusUpdate(ticket.id, TicketStatus.IN_PROGRESS)}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Iniciar Reparación
                  </button>
                )}
                {ticket.status === TicketStatus.IN_PROGRESS && (
                  <button 
                    onClick={() => onStatusUpdate(ticket.id, TicketStatus.READY)}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Marcar Listo
                  </button>
                )}
                {ticket.status === TicketStatus.READY && (
                  <button 
                    onClick={() => onStatusUpdate(ticket.id, TicketStatus.DELIVERED)}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Entregar
                  </button>
                )}
              </div>

              <div className="relative group">
                <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors">
                  <Printer className="w-5 h-5" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-xl border border-neutral-100 py-1 hidden group-hover:block z-10">
                  <button 
                    onClick={() => onPrint(ticket, 'ticket')}
                    className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    Ticket (80mm)
                  </button>
                  <button 
                    onClick={() => onPrint(ticket, 'a5')}
                    className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    Recibo (A5)
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
        
        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-neutral-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900">No se encontraron tickets</h3>
            <p className="text-neutral-500">Intenta cambiar los filtros o crear una nueva orden.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default TicketList;