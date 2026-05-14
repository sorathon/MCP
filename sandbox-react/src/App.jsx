import React, { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [dynamicId, setDynamicId] = useState(`user_${Math.floor(Math.random() * 1000)}`);

  const handleLogin = () => {
    setIsLoggedIn(true);
    // เปลี่ยน ID ทันทีหลัง login เพื่อดักพวกชอบใช้ ID คงที่
    setDynamicId(`finished_${Math.floor(Math.random() * 1000)}`);
  };

  const handleBooking = () => {
    setLoading(true);
    setBookingId('');
    setTimeout(() => {
      setLoading(false);
      setBookingId(`CAR-${Math.floor(1000 + Math.random() * 9000)}`);
    }, 3000); // หน่วงเวลา 3 วินาที
  };

  const handleSearch = () => {
    if (searchQuery === bookingId && bookingId !== '') {
      setSearchResult("✅ พบข้อมูล: สถานะรอยืนยัน");
    } else {
      setSearchResult("❌ ไม่พบข้อมูลการจอง");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">🚗 React Booking Sandbox</h1>

        {/* Step 1: Login */}
        <section className={`mb-6 p-4 rounded-lg border-2 ${isLoggedIn ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'}`}>
          <h2 className="font-bold mb-2 text-blue-800">1. เข้าสู่ระบบ (Case Sensitive & Dynamic ID)</h2>
          <div className="flex gap-2">
            <input 
              id={dynamicId} 
              type="text" 
              placeholder="Username" 
              className="border p-2 rounded flex-1"
            />
            <button 
              onClick={handleLogin}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-bold"
            >
              LOGIN
            </button>
          </div>
          {isLoggedIn && <p className="text-green-600 mt-2 font-medium">เข้าสู่ระบบสำเร็จ!</p>}
        </section>

        {/* Step 2: Booking */}
        <section className={`mb-6 p-4 rounded-lg border-2 ${!isLoggedIn ? 'opacity-30' : 'border-orange-500 bg-orange-50'}`}>
          <h2 className="font-bold mb-2 text-orange-800">2. จองรถ (Loading & Async)</h2>
          <select disabled={!isLoggedIn} className="w-full border p-2 rounded mb-3">
            <option>เลือกประเภทรถ...</option>
            <option>Sedan</option>
            <option>SUV</option>
          </select>
          <button 
            disabled={!isLoggedIn || loading}
            onClick={handleBooking}
            className="w-full bg-orange-500 text-white p-2 rounded font-bold hover:bg-orange-600 disabled:bg-gray-400"
          >
            {loading ? 'กำลังประมวลผล...' : 'ยืนยันการจอง'}
          </button>
          
          {loading && <div className="mt-4 animate-pulse text-orange-600">⌛ กำลังบันทึกข้อมูลเข้าระบบ...</div>}
          {bookingId && (
            <div className="mt-4 p-3 bg-white border-2 border-green-500 rounded text-center">
              <span className="text-gray-600">รหัสจองของคุณคือ:</span>
              <div id="booking-res" className="text-2xl font-black text-green-600">{bookingId}</div>
            </div>
          )}
        </section>

        {/* Step 3: Search */}
        <section className={`p-4 rounded-lg border-2 ${!bookingId ? 'opacity-30' : 'border-purple-500 bg-purple-50'}`}>
          <h2 className="font-bold mb-2 text-purple-800">3. ตรวจสอบ (Memory & Search)</h2>
          <input 
            disabled={!bookingId}
            type="text" 
            placeholder="กรอกรหัสจองเพื่อค้นหา" 
            className="w-full border p-2 rounded mb-2"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            disabled={!bookingId}
            onClick={handleSearch}
            className="w-full bg-purple-600 text-white p-2 rounded font-bold hover:bg-purple-700"
          >
            ค้นหา
          </button>
          {searchResult && <p className={`mt-3 font-bold text-center ${searchResult.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>{searchResult}</p>}
        </section>
      </div>
    </div>
  );
}

export default App;