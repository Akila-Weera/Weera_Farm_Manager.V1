
import React, { useState, useMemo } from 'react';
import { Order, ExpenseRecord, OrderStatus, ExpenseCategory } from '../types';
import { MONTHS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { exportToCSV, exportToPDF } from '../services/exportService';

interface ReportsProps {
  orders: Order[];
  expenses: ExpenseRecord[];
  onBack: () => void;
}

const Reports: React.FC<ReportsProps> = ({ orders, expenses, onBack }) => {
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    orders.forEach(o => years.add(o.date.split('-')[0]));
    expenses.forEach(e => years.add(e.date.split('-')[0]));
    if (years.size === 0) years.add(new Date().getFullYear().toString());
    return Array.from(years).sort().reverse();
  }, [orders, expenses]);

  const [filterYear, setFilterYear] = useState(availableYears[0] || '2025');
  const [filterMonth, setFilterMonth] = useState('10'); // Default to October

  const monthlyOrders = useMemo(() => {
    return orders.filter(o => {
      const [year, month] = o.date.split('-');
      if (filterMonth === 'ALL') return year === filterYear;
      return year === filterYear && month === filterMonth;
    });
  }, [orders, filterYear, filterMonth]);

  const monthlyExpenses = useMemo(() => {
    return expenses.filter(e => {
      const [year, month] = e.date.split('-');
      if (filterMonth === 'ALL') return year === filterYear;
      return year === filterYear && month === filterMonth;
    });
  }, [expenses, filterYear, filterMonth]);

  const summary = useMemo(() => {
    const totalRevenue = monthlyOrders.reduce((acc, o) => acc + (o.weight * o.price), 0);
    const totalExpenses = monthlyExpenses.reduce((acc, e) => acc + e.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    
    const revData: Record<string, number> = {};
    monthlyOrders.forEach(o => {
      const name = o.vegetableType;
      revData[name] = (revData[name] || 0) + (o.weight * o.price);
    });
    const revChartData = Object.entries(revData).map(([name, value]) => ({ name, value }));

    const expData: Record<string, number> = {};
    monthlyExpenses.forEach(e => {
      const name = e.category;
      expData[name] = (expData[name] || 0) + e.amount;
    });
    const expChartData = Object.entries(expData).map(([name, value]) => ({ name, value }));

    return { totalRevenue, totalExpenses, netProfit, revChartData, expChartData };
  }, [monthlyOrders, monthlyExpenses]);

  const COLORS_LIST = ['#3d634d', '#2563eb', '#ea580c', '#9333ea', '#ef4444', '#f59e0b'];

  const handleExportPDF = () => {
    const label = filterMonth === 'ALL' ? `Full Year ${filterYear}` : `${MONTHS.find(m => m.value === filterMonth)?.label} ${filterYear}`;
    exportToPDF(monthlyOrders, `Sales Report - ${label}`, `Sales_Report_${label}`);
  };

  const handleExportCSV = () => {
    const label = filterMonth === 'ALL' ? `Full Year ${filterYear}` : `${MONTHS.find(m => m.value === filterMonth)?.label} ${filterYear}`;
    exportToCSV(monthlyOrders, `Sales_Report_${label}`);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
            <i className="fa-solid fa-arrow-left text-xl"></i>
          </button>
          <h2 className="text-3xl font-bold text-gray-900 font-heading">Financial Insights</h2>
        </div>
        <div className="flex gap-2">
           <button onClick={handleExportCSV} className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 flex items-center gap-2">
              <i className="fa-solid fa-file-csv"></i> CSV
           </button>
           <button onClick={handleExportPDF} className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 flex items-center gap-2">
              <i className="fa-solid fa-file-pdf text-red-500"></i> PDF
           </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Fiscal Year</label>
          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="w-full p-3.5 bg-gray-50 border-none rounded-xl font-bold text-sm focus:ring-2 focus:ring-green-100">
            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Period Range</label>
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="w-full p-3.5 bg-gray-50 border-none rounded-xl font-bold text-sm focus:ring-2 focus:ring-green-100">
            <option value="ALL">Full Year (January - December)</option>
            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Period Revenue</p>
          <h3 className="text-3xl font-black text-blue-600">Rs. {summary.totalRevenue.toLocaleString()}</h3>
          <p className="text-[10px] text-gray-400 font-bold mt-2">Gross Total</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Period Expenses</p>
          <h3 className="text-3xl font-black text-red-500">Rs. {summary.totalExpenses.toLocaleString()}</h3>
          <p className="text-[10px] text-gray-400 font-bold mt-2">Operational Costs</p>
        </div>
        <div className={`p-8 rounded-[2rem] border shadow-sm ${summary.netProfit >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Net Profit</p>
          <h3 className={`text-3xl font-black ${summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Rs. {summary.netProfit.toLocaleString()}
          </h3>
          <p className={`text-[10px] font-bold mt-2 ${summary.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>Balance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h4 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
               <i className="fa-solid fa-chart-pie"></i>
            </div>
            Revenue Distribution
          </h4>
          <div className="h-[300px]">
            {summary.revChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.revChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {summary.revChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_LIST[index % COLORS_LIST.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-300">
                <i className="fa-solid fa-folder-open text-4xl mb-2"></i>
                <p className="font-bold">No data for selected period</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h4 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
               <i className="fa-solid fa-chart-column"></i>
            </div>
            Spending Categories
          </h4>
          <div className="h-[300px]">
            {summary.expChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.expChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                    {summary.expChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#ef4444" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-300">
                <i className="fa-solid fa-folder-open text-4xl mb-2"></i>
                <p className="font-bold">No data for selected period</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
