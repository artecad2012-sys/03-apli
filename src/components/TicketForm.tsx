import React, { useState } from 'react';
import { Ticket, TicketStatus } from '@/types';
import { analyzeDeviceIssue } from '../services/geminiService';
import { Sparkles, Loader2, Save, User, Smartphone, AlertCircle } from 'lucide-react';

interface TicketFormProps {
  onSubmit: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    deviceModel: '',
    issueDescription: '',
    priceQuote: 0
  });

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!formData.deviceModel || !formData.issueDescription) return;
    
    setIsAnalyzing(true);
    const result = await analyzeDeviceIssue(formData.deviceModel, formData.issueDescription);
    setAiAnalysis(result);
    setIsAnalyzing(false);
    
    if (result && result.estimatedPrice) {
      setFormData(prev => ({ ...prev, priceQuote: result.estimatedPrice }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      customerId: Date.now().toString(),
      status: TicketStatus.RECEIVED,
      aiDiagnosis: aiAnalysis,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900">Ingreso de Equipo</h2>
        <p className="text-neutral-500">Registra un nueva reparación en el sistema.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 space-y-6">
            
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-neutral-400" />
                Datos del Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    value={formData.customerName}
                    onChange={e => setFormData({...formData, customerName: e.target.value})}
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    value={formData.customerPhone}
                    onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                    placeholder="Ej. +52 555 123 4567"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-neutral-100" />

            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Smartphone className="w-5 h-5 text-neutral-400" />
                Datos del Equipo
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Modelo del Dispositivo</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    value={formData.deviceModel}
                    onChange={e => setFormData({...formData, deviceModel: e.target.value})}
                    placeholder="Ej. iPhone 13 Pro, Samsung S21"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Descripción del Problema</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none resize-none"
                    value={formData.issueDescription}
                    onChange={e => setFormData({...formData, issueDescription: e.target.value})}
                    placeholder="Describe el fallo (ej. Pantalla rota, no carga, se calienta...)"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Usa Gemini para analizar el costo y tiempo</span>
              </div>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !formData.deviceModel || !formData.issueDescription}
                className="px-4 py-2 bg-white border border-neutral-200 text-neutral-900 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analizar con AI'}
              </button>
            </div>

            <div className="h-px bg-neutral-100" />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Cotización Estimada ($)</label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-lg font-semibold"
                value={formData.priceQuote}
                onChange={e => setFormData({...formData, priceQuote: parseFloat(e.target.value) || 0})}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-medium text-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-neutral-200"
            >
              <Save className="w-5 h-5" />
              Registrar Orden
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {aiAnalysis ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 ring-4 ring-purple-50/50">
              <div className="flex items-center gap-2 mb-4 text-purple-700">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold">Análisis de Gemini</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Diagnóstico</p>
                  <p className="text-neutral-900 font-medium mt-1">{aiAnalysis.category}</p>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Tiempo Estimado</p>
                  <p className="text-neutral-900 font-medium mt-1">{aiAnalysis.estimatedTime}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Sugerencias</p>
                  <ul className="space-y-2">
                    {aiAnalysis.suggestedActions?.map((action: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-100 border border-neutral-200 rounded-2xl p-8 text-center">
              <Sparkles className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-500 font-medium">Asistente Inteligente</p>
              <p className="text-sm text-neutral-400 mt-2">
                Completa los datos del equipo y presiona "Analizar" para recibir sugerencias de reparación y costos.
              </p>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Nota Importante</p>
              <p className="mt-1 opacity-90">Recuerda verificar el estado físico del equipo antes de recibirlo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TicketForm;