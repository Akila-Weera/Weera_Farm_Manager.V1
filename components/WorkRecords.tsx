
import React, { useState } from 'react';
import { WorkRecord } from '../types';
import { GREENHOUSES, MONTHS, TASKS } from '../constants';
import { exportToCSV, exportToPDF } from '../services/exportService';

interface WorkRecordsProps {
  records: WorkRecord[];
  setRecords: React.Dispatch<React.SetStateAction<WorkRecord[]>>;
  onBack: () => void;
}

const WorkRecords: React.FC<WorkRecordsProps> = ({ records, setRecords, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterGH, setFilterGH] = useState('all');
  const [filterMonth, setFilterMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));

  const [formData, setFormData] = useState<Partial<WorkRecord>>({
    date: new Date().toISOString().split('T')[0],
    greenhouseNumber: 1,
    task: TASKS[0],
    hoursWorked: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: WorkRecord = {
      ...formData as WorkRecord,
      id: Date.now().toString(),
    };
    setRecords(prev => [newRecord, ...prev]);
    setIsModalOpen(false);
  };

  const deleteRecord = (id: string) => {
    if (confirm('Delete this record?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const filtered = records.filter(r => {
    const ghMatch = filterGH === 'all' || r.greenhouseNumber === parseInt(filterGH);
    const monthMatch = r.date.split('-')[1] === filterMonth;
    return ghMatch && monthMatch;
  });

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
            <i className="fa-solid fa-arrow-left text-xl"></i>
          </button>
          <h2 className="text-3xl font-bold text-gray-900 font-heading">Work Records</h2>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <button className="bg-gray-100 text-gray-600 font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-all">
              <i className="fa-solid fa-download"></i>
              <span>Export</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 hidden group-hover:block z-50">
               <button onClick={() => exportToCSV(filtered, `Labor_${filterMonth}`)} className="w-full text-left p-3 hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center gap-2">
                  <i className="fa-solid fa-file-csv text-green-600"></i> Excel (CSV)
               </button>
               <button onClick={() => exportToPDF(filtered, 'Labor & Maintenance Report', `Labor_${filterMonth}`)} className="w-full text-left p-3 hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center gap-2">
                  <i className="fa-solid fa-file-pdf text-red-500"></i> PDF Document
               </button>
            </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-orange-700 transition-all flex items-center gap-2">
            <i className="fa-solid fa-plus"></i>
            <span>Log Work</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <select value={filterGH} onChange={(e) => setFilterGH(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl">
          <option value="all">All Greenhouses</option>
          {GREENHOUSES.map(n => <option key={n} value={n}>Greenhouse {n}</option>)}
        </select>
        <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl">
          {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map(record => (
          <div key={record.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-xl text-orange-700 font-bold">GH{record.greenhouseNumber}</div>
              <div>
                <h4 className="font-bold text-gray-800">{record.task}</h4>
                <p className="text-sm text-gray-500">{record.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <p className="text-lg font-bold text-gray-900">{record.hoursWorked} hrs</p>
              <button onClick={() => deleteRecord(record.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><i className="fa-solid fa-trash-can"></i></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6">
             {/* Simple form implementation */}
             <form onSubmit={handleSubmit} className="space-y-4">
                <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full p-3 bg-gray-50 rounded-xl" />
                <input type="number" step="0.1" required value={formData.hoursWorked || ''} onChange={(e) => setFormData({ ...formData, hoursWorked: parseFloat(e.target.value) })} className="w-full p-3 bg-gray-50 rounded-xl" placeholder="Hours" />
                <button type="submit" className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg">Log Record</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkRecords;
