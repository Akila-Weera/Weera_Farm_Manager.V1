
import React, { useState } from 'react';
import { Order, VegetableType, OrderStatus, PaymentStatus } from '../types';
import { MONTHS } from '../constants';
import { exportToCSV, exportToPDF } from '../services/exportService';

interface OrdersProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  onBack: () => void;
}

const Orders: React.FC<OrdersProps> = ({ orders, setOrders, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterMonth, setFilterMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));

  const [formData, setFormData] = useState<Partial<Order>>({
    date: new Date().toISOString().split('T')[0],
    vegetableType: VegetableType.CUCUMBER,
    otherVegetable: '',
    weight: 0,
    price: 0,
    orderStatus: OrderStatus.COMPLETED,
    paymentStatus: PaymentStatus.PAID,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setOrders(prev => prev.map(o => o.id === editingId ? { ...o, ...formData as Order } : o));
    } else {
      const newOrder: Order = {
        ...formData as Order,
        id: Date.now().toString(),
      };
      setOrders(prev => [newOrder, ...prev]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      vegetableType: VegetableType.CUCUMBER,
      otherVegetable: '',
      weight: 0,
      price: 0,
      orderStatus: OrderStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const editOrder = (order: Order) => {
    setFormData(order);
    setEditingId(order.id);
    setIsModalOpen(true);
  };

  const deleteOrder = (id: string) => {
    if (confirm('Delete this order permanently?')) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const filtered = orders.filter(o => o.date.split('-')[1] === filterMonth);

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-full text-gray-600 transition-colors shadow-sm">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h2 className="text-3xl font-black text-gray-900 font-heading">Sales Orders</h2>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <button className="bg-white border border-gray-100 text-gray-600 font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
              <i className="fa-solid fa-file-export"></i>
              <span>Export</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 hidden group-hover:block z-50">
               <button onClick={() => exportToCSV(filtered, `Weera_Orders_${filterMonth}`)} className="w-full text-left p-3 hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center gap-2 text-gray-700">
                  <i className="fa-solid fa-file-csv text-green-600"></i> Export to CSV
               </button>
               <button onClick={() => exportToPDF(filtered, 'Sales History Report', `Weera_Orders_${filterMonth}`)} className="w-full text-left p-3 hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center gap-2 text-gray-700">
                  <i className="fa-solid fa-file-pdf text-red-500"></i> Export to PDF
               </button>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-[#3d634d] text-white font-black py-2.5 px-6 rounded-xl hover:bg-[#2d4d3a] shadow-lg shadow-green-100 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add New Sale</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:w-auto flex-1">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Displaying Month</label>
          <select 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full max-w-xs p-3.5 bg-gray-50 border-none rounded-2xl font-black text-sm focus:ring-2 focus:ring-[#3d634d]/10"
          >
            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <div className="text-right bg-[#3d634d]/5 px-6 py-4 rounded-2xl border border-[#3d634d]/10">
           <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Monthly Revenue</p>
           <p className="text-3xl font-black text-[#3d634d]">Rs. {filtered.reduce((acc, o) => acc + (o.weight * o.price), 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-basket-shopping text-3xl text-gray-200"></i>
            </div>
            <p className="text-gray-400 font-bold">No sales records found for this period.</p>
            <button 
               onClick={() => setIsModalOpen(true)}
               className="mt-4 text-[#3d634d] font-black text-xs uppercase tracking-widest hover:underline"
            >
              Log your first sale of the month
            </button>
          </div>
        ) : (
          filtered.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h4 className="text-xl font-black text-gray-900 leading-tight">
                    {order.vegetableType === VegetableType.OTHER ? (order.otherVegetable || 'Other') : order.vegetableType}
                  </h4>
                  <p className="text-xs text-gray-400 font-bold flex items-center gap-2 mt-1.5">
                    <i className="fa-regular fa-calendar-check"></i> {order.date}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
                    order.paymentStatus === PaymentStatus.PAID ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center mb-6">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Weight & Rate</p>
                  <p className="text-sm font-black text-gray-700">{order.weight} kg @ Rs. {order.price}/kg</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Total</p>
                  <p className="text-xl font-black text-gray-900">Rs. {(order.weight * order.price).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => editOrder(order)} className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all">
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button onClick={() => deleteOrder(order.id)} className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all">
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-scaleIn flex flex-col max-h-[95vh]">
            <div className="px-6 md:px-10 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30 flex-shrink-0">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">{editingId ? 'Modify Record' : 'Log New Sale'}</h3>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Update historical or current sales</p>
              </div>
              <button onClick={resetForm} className="w-10 h-10 rounded-full hover:bg-white border border-transparent hover:border-gray-100 flex items-center justify-center text-gray-400 transition-all">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order Date (Change for old records)</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.date} 
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#3d634d] focus:bg-white rounded-[1.2rem] font-black text-base outline-none transition-all" 
                  />
                </div>
                
                <div className={formData.vegetableType === VegetableType.OTHER ? 'sm:col-span-1' : 'sm:col-span-2'}>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Vegetable Type</label>
                  <select 
                    value={formData.vegetableType} 
                    onChange={(e) => setFormData({ ...formData, vegetableType: e.target.value as VegetableType })} 
                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#3d634d] focus:bg-white rounded-[1.2rem] font-black text-sm outline-none transition-all h-[58px]"
                  >
                    {Object.values(VegetableType).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                {formData.vegetableType === VegetableType.OTHER && (
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Enter new Category</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Bell Pepper" 
                      required
                      value={formData.otherVegetable} 
                      onChange={(e) => setFormData({ ...formData, otherVegetable: e.target.value })} 
                      className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#3d634d] focus:bg-white rounded-[1.2rem] font-black text-sm outline-none transition-all h-[58px]"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Quantity (kg)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.01" 
                      required 
                      placeholder="0.00"
                      value={formData.weight || ''} 
                      onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })} 
                      className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#3d634d] focus:bg-white rounded-[1.2rem] font-black text-lg outline-none transition-all pl-12" 
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold">KG</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Rate (Rs / kg)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.01" 
                      required 
                      placeholder="0.00"
                      value={formData.price || ''} 
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} 
                      className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#3d634d] focus:bg-white rounded-[1.2rem] font-black text-lg outline-none transition-all pl-12" 
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold">Rs</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Payment Status</label>
                  <select 
                    value={formData.paymentStatus} 
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })} 
                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#3d634d] focus:bg-white rounded-[1.2rem] font-black text-sm outline-none transition-all h-[58px]"
                  >
                    {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order Status</label>
                  <select 
                    value={formData.orderStatus} 
                    onChange={(e) => setFormData({ ...formData, orderStatus: e.target.value as OrderStatus })} 
                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#3d634d] focus:bg-white rounded-[1.2rem] font-black text-sm outline-none transition-all h-[58px]"
                  >
                    {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex-shrink-0">
                <button type="submit" className="w-full bg-[#3d634d] text-white font-black py-5 rounded-[2rem] hover:bg-[#2d4d3a] transition-all uppercase tracking-[0.2em] text-sm shadow-2xl shadow-green-100 flex items-center justify-center gap-3">
                  <i className="fa-solid fa-check-circle"></i>
                  {editingId ? 'Save Changes' : 'Record Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
