
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Building2, UserCheck, ShieldCheck, Users, ArrowRight, Lock } from '../components/Icon';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.id === selectedUserId);
    if (user) {
      onLogin(user);
    } else if (users.length > 0) {
      // Default to first user if none selected but form submitted
      onLogin(users[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-right font-sans" dir="rtl">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 text-white rounded-[2.5rem] shadow-xl shadow-primary-100 mb-6">
            <Building2 size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">نظام الوسيط العقاري</h1>
          <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-xs">Real Estate Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-white">
          <div className="flex items-center gap-3 mb-8">
            <Lock className="text-primary-500" size={20} />
            <h2 className="text-xl font-black text-gray-800">تسجيل الدخول</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">اختر المستخدم للدخول</label>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {users.map(user => (
                  <label 
                    key={user.id}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedUserId === user.id 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-50 bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="user" 
                      className="hidden" 
                      value={user.id} 
                      onChange={() => setSelectedUserId(user.id)}
                      checked={selectedUserId === user.id}
                    />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                      selectedUserId === user.id ? 'bg-primary-600 text-white' : 'bg-white text-gray-400'
                    }`}>
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-black ${selectedUserId === user.id ? 'text-primary-800' : 'text-gray-700'}`}>
                        {user.name}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400">{user.role}</p>
                    </div>
                    {selectedUserId === user.id && <UserCheck size={20} className="text-primary-600" />}
                  </label>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={!selectedUserId}
              className={`w-full py-5 rounded-[2rem] font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                selectedUserId 
                ? 'bg-primary-600 text-white shadow-primary-100 hover:bg-primary-700 active:scale-95' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              دخول للنظام
              <ArrowRight size={20} className="rotate-180" />
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
          © {new Date().getFullYear()} جميع الحقوق محفوظة - شركة الوسيط العقاري
        </p>
      </div>
    </div>
  );
};
