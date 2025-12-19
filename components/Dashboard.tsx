
import React, { useMemo } from 'react';
import { ViewState, HarvestRecord, Order, ExpenseRecord, WorkRecord } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
  harvests: HarvestRecord[];
  orders: Order[];
  expenses: ExpenseRecord[];
  workRecords: WorkRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, harvests, orders, expenses, workRecords }) => {
  const totalRevenue = orders.reduce((acc, o) => acc + (o.weight * o.price), 0);
  
  // Generate real data for Sales Trend Monitor based on Orders
  const salesTrendData = useMemo(() => {
    const dailyData: Record<string, { date: string, revenue: number, weight: number }> = {};
    const sortedOrders = [...orders].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sortedOrders.forEach(order => {
      if (!dailyData[order.date]) {
        dailyData[order.date] = { date: order.date, revenue: 0, weight: 0 };
      }
      dailyData[order.date].revenue += (order.weight * order.price);
      dailyData[order.date].weight += order.weight;
    });

    return Object.values(dailyData).slice(-15);
  }, [orders]);

  // Calendar Logic
  const calendarData = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const todayDate = today.getDate();

    const monthName = today.toLocaleString('default', { month: 'long' });
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    // Padding for days from previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: '', isToday: false, isPadding: true });
    }
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ 
        day: i, 
        isToday: i === todayDate,
        isPadding: false 
      });
    }

    return { monthName, currentYear, days };
  }, []);

  return (
    <div className="grid grid-cols-12 gap-6 pb-10">
      {/* Main Content Area */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        
        {/* Welcome Banner */}
        <div className="relative h-64 rounded-[2.5rem] overflow-hidden group shadow-xl">
           <img 
            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover brightness-[0.7]"
            alt="Farm Header"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-12 text-white">
             <h2 className="text-4xl font-black mb-2">Welcome Back, Weera</h2>
             <p className="text-lg font-medium text-green-100">Managing your agricultural operations efficiently.</p>
          </div>
        </div>

        {/* Sales Performance Trend */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                 <i className="fa-solid fa-chart-line"></i>
               </div>
               <div>
                <h4 className="font-extrabold text-gray-900">Sales Performance Monitor</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Revenue vs Weight Trend</p>
               </div>
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3d634d" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3d634d" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fontWeight: 'bold' }} 
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                  formatter={(value: any, name: string) => [name === 'revenue' ? `Rs. ${value.toLocaleString()}` : `${value} kg`, name.toUpperCase()]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3d634d" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex gap-6 mt-6 justify-center">
             <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3d634d]"></div>
                <span className="text-xs font-bold text-gray-500">Revenue (Rs.)</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></div>
                <span className="text-xs font-bold text-gray-500">Weight Sold (kg)</span>
             </div>
          </div>
        </div>
      </div>

      {/* Right Column (Widgets) */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        
        {/* Cumulative Revenue Card */}
        <div className="bg-[#ffce6d] p-8 rounded-[2rem] text-gray-900 flex justify-between items-center group overflow-hidden">
          <div>
              <p className="text-sm font-bold text-[#8a6a2a] mb-1 flex items-center gap-2">
                <i className="fa-solid fa-sack-dollar"></i> Cumulative Revenue
              </p>
              <h2 className="text-4xl font-black">Rs.{totalRevenue.toLocaleString()}</h2>
              <p className="text-xs font-bold text-[#8a6a2a] mt-1">Total Sales to Date</p>
          </div>
          <button 
            onClick={() => onNavigate('ORDERS')}
            className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center hover:bg-black/20 transition-all"
          >
              <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        {/* Mini Calendar Widget - Refined & Synchronized */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <div>
                <p className="font-black text-lg text-gray-900 leading-tight">{calendarData.monthName}</p>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{calendarData.currentYear}</p>
              </div>
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#3d634d]">
                <i className="fa-solid fa-calendar-day"></i>
              </div>
           </div>
           
           <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['S','M','T','W','T','F','S'].map(d => (
                <span key={d} className="text-[10px] font-black text-gray-300 uppercase py-2">{d}</span>
              ))}
              {calendarData.days.map((d, i) => (
                <div 
                  key={i} 
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                    d.isPadding ? 'text-transparent' : 
                    d.isToday 
                      ? 'bg-[#3d634d] text-white shadow-lg shadow-green-100 scale-110' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {d.day}
                </div>
              ))}
           </div>

           <div className="mt-8 pt-6 border-t border-gray-50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                System Time Synchronized
              </p>
           </div>
        </div>

        {/* Quick Insights Stat */}
        <div className="bg-[#3d634d] p-8 rounded-[2.5rem] text-white shadow-xl shadow-green-100">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-green-200 mb-2">Daily Summary</h4>
           <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black">
                {harvests.filter(h => h.date === new Date().toISOString().split('T')[0]).reduce((acc, h) => acc + h.weight, 0).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-green-200">kg harvested today</span>
           </div>
           <div className="mt-6 flex gap-2">
              <button 
                onClick={() => onNavigate('HARVEST')}
                className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Log Harvest
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
