
import React, { useState, useEffect, useRef } from 'react';

interface LoginProps {
  onLogin: (pin: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the hidden input for keyboard support
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 6) {
      setPin(val);
      if (error) setError('');
    }
  };

  const handleKeypadPress = (num: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + num);
      if (error) setError('');
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (pin.length !== 6) {
      setError('PIN must be 6 digits.');
      return;
    }
    try {
      onLogin(pin);
    } catch (err) {
      setError('Invalid PIN. Access denied.');
      setPin('');
      inputRef.current?.focus();
    }
  };

  // Submit automatically when 6 digits are entered
  useEffect(() => {
    if (pin.length === 6) {
      handleSubmit();
    }
  }, [pin]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-gray-100 p-6">
      <div className="w-full max-w-md text-center mb-8 animate-fadeIn">
        <div className="inline-flex items-center justify-center p-5 bg-[#3d634d] rounded-3xl shadow-xl shadow-green-200 mb-6">
          <i className="fa-solid fa-seedling text-4xl text-white"></i>
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">WEERA AGRICULTURE</h1>
        <p className="text-gray-500 mt-2 font-black uppercase tracking-widest text-[10px]">Internal Management System</p>
        <p className="text-blue-500 text-xs mt-1 font-bold">www.weera.lk</p>
      </div>

      <div className="w-full max-w-sm bg-white p-8 rounded-[2.5rem] shadow-2xl border border-white/50 backdrop-blur-sm animate-scaleIn">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-8">Security Check</h2>
        
        <div className="flex justify-center gap-3 mb-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-10 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all duration-200 ${
                pin.length > i 
                  ? 'border-green-500 bg-green-50 text-green-600 scale-105 shadow-sm' 
                  : 'border-gray-200 bg-gray-50 text-gray-300'
              }`}
            >
              {pin[i] ? '•' : ''}
            </div>
          ))}
        </div>

        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={pin}
          onChange={handleInputChange}
          className="sr-only"
          maxLength={6}
          autoFocus
        />

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeypadPress(num.toString())}
              className="h-16 rounded-2xl bg-gray-50 text-gray-800 text-xl font-bold hover:bg-[#3d634d] hover:text-white transition-all active:scale-90 flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            className="h-16 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => setPin('')}
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
          <button
            key={0}
            type="button"
            onClick={() => handleKeypadPress('0')}
            className="h-16 rounded-2xl bg-gray-50 text-gray-800 text-xl font-bold hover:bg-[#3d634d] hover:text-white transition-all active:scale-90 flex items-center justify-center"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-16 rounded-2xl bg-gray-50 text-gray-800 text-xl font-bold hover:bg-gray-100 transition-all active:scale-90 flex items-center justify-center"
          >
            <i className="fa-solid fa-delete-left"></i>
          </button>
        </div>

        {error ? (
          <p className="text-red-500 text-center text-sm font-semibold mb-2 animate-bounce">{error}</p>
        ) : (
          <p className="text-gray-400 text-center text-xs font-medium mb-2">Enter your 6-digit PIN to continue</p>
        )}
      </div>

      <div className="mt-12 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest opacity-50">
        &copy; 2025 WEERA AGRICULTURE (PVT) LTD.
      </div>
    </div>
  );
};

export default Login;
