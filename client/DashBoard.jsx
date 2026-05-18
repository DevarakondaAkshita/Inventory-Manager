import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({ name: '', quantity: '', price: '' });
  const [orderReq, setOrderReq] = useState({ name: '', qty: 1 });
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:5000/api/products';

  useEffect(() => {
    if (!token) navigate('/login');
    else fetchProducts();
  }, [token]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data);
    } catch (err) { setMessage("Connection error."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this entry?")) return;
    await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchProducts();
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const item = products.find(p => p.name.toLowerCase() === orderReq.name.toLowerCase());
    
    if (!item || item.quantity < orderReq.qty) {
      return setMessage("❌ Error: Stock unavailable.");
    }

    try {
      const newQty = item.quantity - orderReq.qty;
      await axios.put(`${API_URL}/${item._id}`, { ...item, quantity: newQty }, { headers: { Authorization: `Bearer ${token}` } });

      setCart([...cart, { 
        name: item.name, 
        qty: orderReq.qty, 
        total: item.price * orderReq.qty 
      }]);
      
      fetchProducts();
      setMessage(`Added ${item.name} to order.`);
    } catch (err) { setMessage("Transaction failed."); }
  };

  const grandTotal = cart.reduce((acc, i) => acc + i.total, 0);

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-6 md:p-12 text-[#4A5568] font-sans">
      
      {/* Bold Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12 bg-white/70 backdrop-blur-md p-8 rounded-[2rem] border border-[#E2E8F0] shadow-sm">
        <h1 className="text-3xl font-black tracking-tighter text-[#2D3748] uppercase">
          Inventory <span className="text-[#9F7AEA]">Manager</span>
        </h1>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-[#718096] font-black hover:text-[#9F7AEA] transition uppercase text-sm tracking-widest">Log Out</button>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        
        {/* Misty Blue Card - Management */}
        <div className="bg-[#EBF8FF] p-10 rounded-[3rem] border-2 border-white shadow-md">
          <h2 className="text-xl font-black text-[#3182CE] mb-8 uppercase tracking-widest">Stock Entry</h2>
          <div className="space-y-5">
            <input className="w-full p-4 rounded-2xl bg-white border-none shadow-sm placeholder-[#A0AEC0] font-bold outline-none focus:ring-4 focus:ring-[#BEE3F8] transition" placeholder="Item Name" onChange={e => setFormData({...formData, name: e.target.value})} />
            <div className="flex gap-4">
              <input className="w-1/2 p-4 rounded-2xl bg-white border-none shadow-sm font-bold outline-none" type="number" placeholder="Qty" onChange={e => setFormData({...formData, quantity: e.target.value})} />
              <input className="w-1/2 p-4 rounded-2xl bg-white border-none shadow-sm font-bold outline-none" type="number" placeholder="Price (Rs.)" onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <button className="w-full bg-[#63B3ED] text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#4299E1] transition shadow-lg shadow-blue-200" onClick={async () => {
              await axios.post(API_URL, formData, { headers: { Authorization: `Bearer ${token}` } });
              fetchProducts();
            }}>Update Warehouse</button>
          </div>
        </div>

        {/* Lavender Card - Checkout */}
        <div className="bg-[#FAF5FF] p-10 rounded-[3rem] border-2 border-white shadow-md">
          <h2 className="text-xl font-black text-[#805AD5] mb-8 uppercase tracking-widest">Client Order</h2>
          <form onSubmit={handleCheckout} className="space-y-5">
            <input className="w-full p-4 rounded-2xl bg-white border-none shadow-sm placeholder-[#A0AEC0] font-bold outline-none focus:ring-4 focus:ring-[#E9D8FD]" placeholder="Search Product..." onChange={e => setOrderReq({...orderReq, name: e.target.value})} />
            <input className="w-full p-4 rounded-2xl bg-white border-none shadow-sm font-bold outline-none" type="number" placeholder="Quantity" onChange={e => setOrderReq({...orderReq, qty: Number(e.target.value)})} />
            <button className="w-full bg-[#B794F4] text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#9F7AEA] transition shadow-lg shadow-purple-200">Process Sale</button>
          </form>
          {message && <p className="mt-4 text-center font-black text-xs text-[#CBD5E0] uppercase tracking-widest">{message}</p>}
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Inventory Table */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-[#EDF2F7]">
          <h3 className="text-sm font-black text-[#A0AEC0] uppercase tracking-[0.4em] mb-12 text-center">Warehouse Registry</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[#CBD5E0] font-black text-xs uppercase border-b-2 border-[#F7FAFC]">
                  <th className="pb-6">Description</th>
                  <th className="pb-6">Stock Status</th>
                  <th className="pb-6">Valuation</th>
                  <th className="pb-6 text-right">Control</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} className="border-b border-[#F7FAFC] hover:bg-[#F8FAFC] transition">
                    <td className="py-8 font-black text-[#4A5568] text-lg uppercase tracking-tight">{p.name}</td>
                    <td className="py-8">
                      <span className={`px-5 py-2 rounded-xl text-xs font-black uppercase ${p.quantity < 5 ? 'bg-[#FFF5F5] text-[#F56565]' : 'bg-[#EBF8FF] text-[#3182CE]'}`}>
                        {p.quantity} Units
                      </span>
                    </td>
                    <td className="py-8 font-black text-[#718096] text-lg">Rs. {p.price}</td>
                    <td className="py-8 text-right">
                      <button onClick={() => handleDelete(p._id)} className="text-[#EDF2F7] hover:text-[#FEB2B2] font-black transition text-xs uppercase">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Price & Cart Table */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border-t-[12px] border-[#E9D8FD]">
          <h3 className="text-sm font-black text-[#A0AEC0] uppercase tracking-[0.4em] mb-12 text-center">Current Transaction List</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#CBD5E0] font-black text-xs uppercase border-b-2 border-[#F7FAFC]">
                <th className="pb-6">Purchased Item</th>
                <th className="pb-6">Quantity</th>
                <th className="pb-6 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index} className="border-b border-[#F7FAFC]">
                  <td className="py-8 text-[#4A5568] font-black uppercase italic">{item.name}</td>
                  <td className="py-8 text-[#718096] font-bold">{item.qty} Units</td>
                  <td className="py-8 text-right font-black text-[#805AD5] text-lg">Rs. {item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-16 flex justify-between items-center bg-[#F7FAFC] p-12 rounded-[3rem] border-2 border-white shadow-inner">
            <div>
              <p className="text-xs font-black text-[#A0AEC0] uppercase tracking-[0.3em] mb-2">Total Payable Amount</p>
              <h2 className="text-7xl font-black text-[#2D3748] tracking-tighter">
                <span className="text-2xl font-bold text-[#A0AEC0] mr-4 uppercase">Rs.</span>
                {grandTotal.toFixed(2)}
              </h2>
            </div>
            <button className="bg-[#2D3748] text-white px-14 py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-black transition shadow-2xl hover:scale-105 active:scale-95">Complete Order</button>
          </div>
        </div>
      </div>
      <div className="h-24"></div>
    </div>
  );
}

export default Dashboard;