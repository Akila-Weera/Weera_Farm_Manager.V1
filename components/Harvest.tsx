
import React, { useState } from 'react';
import { HarvestRecord, VegetableType } from '../types';
import { GREENHOUSES, MONTHS } from '../constants';
import { exportToCSV, exportToPDF } from '../services/exportService';

interface HarvestProps {
  harvests: HarvestRecord[];
  setHarvests: React.Dispatch<React.SetStateAction<HarvestRecord[]>>;
  onBack: () => void;
}

const Harvest: React.FC<HarvestProps> = ({ harvests, setHarvests, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterGH, setFilterGH] = useState('all');
  const [filterMonth, setFilterMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));

  const [formData, setFormData] = useState<Partial<HarvestRecord>>({
    date: new Date().toISOString().split('T')[0],
    greenhouseNumber: 1,
    vegetableType: VegetableType.CUCUMBER,
    otherVegetable: '',
    weight: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setHarvests(prev => prev.map(r => r.id === editingId ? { ...r, ...formData as HarvestRecord } : r));
    } else {
      const newRecord: HarvestRecord = {
        ...formData as HarvestRecord,
        id: Date.now().toString(),
      };
      setHarvests(prev => [newRecord, ...prev]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      greenhouseNumber: 1,
      vegetableType: VegetableType.CUCUMBER,
      otherVegetable: '',
      weight: 0,
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const startEdit = (record: HarvestRecord) => {
    setFormData(record);
    setEditingId(record.id);
    setIsModalOpen(true);
  };

  const deleteRecord = (id: string) => {
    if (confirm('Permanently delete this harvest record?')) {
      setHarvests(prev => prev.filter(r => r.id !== id));
    }
  };

  const filtered = harvests.filter(h => {
    const ghMatch = filterGH === 'all' || h.greenhouseNumber === parseInt(filterGH);
    const monthMatch = h.date.split('-')[1] === filterMonth;
    return ghMatch && monthMatch;
  });

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-full text-gray-600 transition-colors shadow-sm">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h2 className="text-3xl font-black text-gray-900 leading-none">Harvest Logs</h2>
            <p className="text-gray-500 mt-2 text-sm font-medium">Daily production tracking for greenhouses.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <button className="bg-white border border-gray-100 text-gray-600 font-bold py-3.5 px-6 rounded-2xl flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
              <i className="fa-solid fa-download"></i>
              <span>Export</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 hidden group-hover:block z-50">
               <button onClick={() => exportToCSV(filtered, `Weera_Harvest_${filterMonth}`)} className="w-full text-left p-3 hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center gap-2 text-gray-700">
                  <i className="fa-solid fa-file-csv text-green-600"></i> CSV Export
               </button>
               <button onClick={() => exportToPDF(filtered, 'Harvest Yield Report', `Weera_Harvest_${filterMonth}`)} className="w-full text-left p-3 hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center gap-2 text-gray-700">
                  <i className="fa-solid fa-file-pdf text-red-500"></i> PDF Document
               </button>
            </div>
          </div>
          <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#3d634d] text-white font-black py-3.5 px-8 rounded-2xl hover:bg-[#2d4d3a] shadow-xl shadow-green-100 transition-all flex items-center gap-3">
            <i className="fa-solid fa-plus"></i>
            <span>Log Yield</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Greenhouse</label>
          <select value={filterGH} onChange={(e) => setFilterGH(e.target.value)} className="w-full p-4 bg-gray-50 border-none rounded-[1.5rem] font-black text-sm outline-none">
            <option value="all">All Greenhouses</option>
            {GREENHOUSES.map(n => <option key={n} value={n}>Greenhouse {n}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Period</label>
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="w-full p-4 bg-gray-50 border-none rounded-[1.5rem] font-black text-sm outline-none">
            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-bold">No yield recorded for this selection.</p>
          </div>
        ) : (
          filtered.map(record => (
            <div key={record.id} className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-2xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/50 rounded-bl-[4rem] -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform"></div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="bg-[#3d634d] px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100">
                  GH {record.greenhouseNumber}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(record)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><i className="fa-solid fa-pen-to-square"></i></button>
                  <button onClick={() => deleteRecord(record.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><i className="fa-solid fa-trash-can"></i></button>
                </div>
              </div>

              <h4 className="font-black text-xl text-gray-900 leading-none">
                {record.vegetableType === VegetableType.OTHER ? record.otherVegetable : record.vegetableType}
              </h4>
              <p className="text-xs text-gray-400 font-bold mt-2 flex items-center gap-2">
                <i className="fa-regular fa-calendar"></i> {record.date}
              </p>
              
              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-4xl font-black text-gray-900">{record.weight}</span>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Kilograms</span>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
           <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 animate-scaleIn">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-black text-gray-900">{editingId ? 'Modify Yield' : 'Log New Yield'}</h3>
                 <button onClick={resetForm} className="text-gray-400 hover:text-gray-900"><i className="fa-solid fa-xmark text-xl"></i></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pl-1">Harvest Date (Editable for old logs)</label>
                  <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl font-black outline-none border-2 border-transparent focus:border-[#3d634d] transition-all" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pl-1">Greenhouse</label>
                    <select value={formData.greenhouseNumber} onChange={(e) => setFormData({ ...formData, greenhouseNumber: parseInt(e.target.value) })} className="w-full p-4 bg-gray-50 rounded-2xl font-black outline-none">
                      {GREENHOUSES.map(n => <option key={n} value={n}>GH {n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pl-1">Variety</label>
                    <select value={formData.vegetableType} onChange={(e) => setFormData({ ...formData, vegetableType: e.target.value as VegetableType })} className="w-full p-4 bg-gray-50 rounded-2xl font-black outline-none">
                      {Object.values(VegetableType).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>

                {formData.vegetableType === VegetableType.OTHER && (
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pl-1">Name of Variety</label>
                    <input type="text" placeholder="Specify..." value={formData.otherVegetable} onChange={(e) => setFormData({ ...formData, otherVegetable: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl font-black outline-none border-2 border-transparent focus:border-[#3d634d] transition-all" />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pl-1">Yield Weight (kg)</label>
                  <div className="relative">
                    <input type="number" step="0.01" required placeholder="0.00" value={formData.weight || ''} onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })} className="w-full p-5 bg-gray-50 rounded-[1.5rem] text-3xl font-black outline-none border-2 border-transparent focus:border-[#3d634d] transition-all pl-12" />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-black">KG</span>
                  </div>
                </div>
                
                <button type="submit" className="w-full bg-[#3d634d] text-white font-black py-5 rounded-[2rem] uppercase tracking-widest text-sm shadow-xl shadow-green-100 hover:bg-[#2d4d3a] transition-all mt-4">
                   {editingId ? 'Update Record' : 'Confirm Yield'}
                </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Harvest;
