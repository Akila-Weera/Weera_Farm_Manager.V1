
import React, { useState } from 'react';
import { ExpenseRecord, ExpenseCategory } from '../types';
import { MONTHS, EXPENSE_CATEGORIES } from '../constants';
import { exportToCSV, exportToPDF } from '../services/exportService';

interface ExpensesProps {
  expenses: ExpenseRecord[];
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseRecord[]>>;
  onBack: () => void;
}

const Expenses: React.FC<ExpensesProps> = ({ expenses, setExpenses, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState<Partial<ExpenseRecord>>({
    date: new Date().toISOString().split('T')[0],
    category: ExpenseCategory.OTHER,
    otherCategory: '',
    description: '',
    amount: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: ExpenseRecord = {
      ...formData as ExpenseRecord,
      id: Date.now().toString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: ExpenseCategory.OTHER,
      otherCategory: '',
      description: '',
      amount: 0,
    });
    setIsModalOpen(false);
  };

  const deleteExpense = (id: string) => {
    if (confirm('Delete this expense record permanently?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const filtered = expenses.filter(e => {
    const monthMatch = e.date.split('-')[1] === filterMonth;
    const categoryText = e.category === ExpenseCategory.OTHER ? (e.otherCategory || 'Other') : e.category;
    const searchMatch = e.description.toLowerCase().includes(search.toLowerCase()) || 
                      categoryText.toLowerCase().includes(search.toLowerCase());
    return monthMatch && searchMatch;
  });

  const totalFiltered = filtered.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-full text-gray-600 transition-colors shadow-sm">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h2 className="text-3xl font-black text-gray-900 font-heading">Operating Expenses</h2>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <button className="bg-white border border-gray-100 text-gray-600 font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
              <i className="fa-solid fa-download"></i>
              <span>Export</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 hidden group-hover:block z-50">
               <button onClick={() => exportToCSV(filtered, `Weera_Expenses_${filterMonth}`)} className="w-full text-left p-3 hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center gap-2 text-gray-700">
                  <i className="fa-solid fa-file-csv text-green-600"></i> Excel (CSV)
               </button>
               <button onClick={() => exportToPDF(filtered, 'Operational Expenditure Log', `Weera_Expenses_${filterMonth}`)} className="w-full text-left p-3 hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center gap-2 text-gray-700">
                  <i className="fa-solid fa-file-pdf text-red-500"></i> PDF Document
               </button>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-red-600 text-white font-black py-2.5 px-6 rounded-xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Log Expense</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Billing Month</label>
          <select 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(e.target.value)} 
            className="w-full p-3.5 bg-white border border-gray-100 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-red-100"
          >
            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Search Logs</label>
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
            <input 
              type="text" 
              placeholder="Filter by description or category..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-12 p-3.5 bg-white border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-red-100" 
            />
          </div>
        </div>
      </div>

      <div className="bg-red-50 p-8 rounded-[2rem] mb-10 border border-red-100 flex justify-between items-center shadow-sm">
        <div>
          <h4 className="text-red-800 font-black uppercase text-[10px] tracking-[0.2em] mb-1">Period Total Expenditure</h4>
          <p className="text-4xl font-black text-red-900">Rs. {totalFiltered.toLocaleString()}</p>
        </div>
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
           <i className="fa-solid fa-calculator text-2xl"></i>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <i className="fa-solid fa-receipt text-4xl text-gray-100 mb-4"></i>
            <p className="text-gray-400 font-bold">No expense records found.</p>
          </div>
        ) : (
          filtered.map(expense => (
            <div key={expense.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex items-center justify-between group hover:border-red-200 transition-all hover:shadow-xl">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 text-xl font-bold shadow-sm">
                  <i className="fa-solid fa-receipt"></i>
                </div>
                <div>
                  <h4 className="font-black text-gray-800 text-lg">{expense.description}</h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-gray-500">
                      {expense.category === ExpenseCategory.OTHER ? (expense.otherCategory || 'Other') : expense.category}
                    </span>
                    <span className="text-[10px] text-gray-300 font-black flex items-center gap-1">
                      <i className="fa-regular fa-calendar"></i> {expense.date}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <p className="text-2xl font-black text-gray-900">Rs. {expense.amount.toLocaleString()}</p>
                <button 
                  onClick={() => deleteExpense(expense.id)} 
                  className="w-10 h-10 flex items-center justify-center text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[95vh]">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30 flex-shrink-0">
              <div>
                <h3 className="text-2xl font-black text-gray-900">Log New Expense</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Operational Outflow Recording</p>
              </div>
              <button onClick={resetForm} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-gray-400">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pl-1">Expense Date</label>
                <input 
                  type="date" 
                  required 
                  value={formData.date} 
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-[1.5rem] font-black outline-none transition-all" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={formData.category === ExpenseCategory.OTHER ? 'sm:col-span-1' : 'sm:col-span-2'}>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pl-1">Category</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })} 
                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-[1.5rem] font-black outline-none transition-all h-[58px]"
                  >
                    {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {formData.category === ExpenseCategory.OTHER && (
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pl-1">Enter new Category</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Marketing" 
                      required
                      value={formData.otherCategory} 
                      onChange={(e) => setFormData({ ...formData, otherCategory: e.target.value })} 
                      className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-[1.5rem] font-black outline-none transition-all h-[58px]" 
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pl-1">Description</label>
                <input 
                  type="text" 
                  required 
                  placeholder="What was this for?" 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-[1.5rem] font-bold outline-none transition-all" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pl-1">Amount (Rs.)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    required 
                    placeholder="0.00" 
                    value={formData.amount || ''} 
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })} 
                    className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-[2rem] text-3xl font-black outline-none transition-all pl-12" 
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-black">Rs</span>
                </div>
              </div>

              <button type="submit" className="w-full bg-red-600 text-white font-black py-5 rounded-[2.5rem] hover:bg-red-700 transition-all uppercase tracking-widest text-sm shadow-xl shadow-red-100 flex-shrink-0">
                Confirm Expenditure
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
