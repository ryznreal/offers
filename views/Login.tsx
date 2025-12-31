
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Building2, UserCheck, ShieldCheck, Users, ArrowRight, XCircle } from '../components/Icon';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // تنظيف البيانات المدخلة
    const normalizedUsername = username.trim().toLowerCase();

    // البحث عن المستخدم (الدخول بالاسم فقط للمراجعة)
    const user = users.find(u => 
      (u.name.toLowerCase() === normalizedUsername || u.email.toLowerCase() === normalizedUsername)
    );

    if (user) {
      onLogin(user);
    } else {
      setError('اسم المستخدم غير موجود (استخدم admin)');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-right font-sans" dir="rtl">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-600 text-white rounded-[2.5rem] shadow-2xl shadow-primary-100 mb-6 border-4 border-white">
            <Building2 size={48} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">نظام الوسيط العقاري</h1>
          <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px]">Review Mode - Login as 'admin'</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
              <UserCheck size={20} />
            </div>
            <h2 className="text-xl font-black text-gray-800">تسجيل الدخول</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 mr-1">اسم المستخدم</label>
                <div className="relative group">
                  <Users className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    required 
                    placeholder="admin"
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="username"
                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl pr-12 pl-4 py-5 font-bold text-sm outline-none focus:bg-white focus:border-primary-500 transition-all shadow-inner"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 animate-in shake duration-300">
                <XCircle size={18} className="text-red-500 shrink-0" />
                <p className="text-xs font-black text-red-600">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-5 rounded-[2rem] font-black text-lg shadow-xl bg-primary-600 text-white shadow-primary-100 hover:bg-primary-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              دخول مباشر
              <ArrowRight size={20} className="rotate-180" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
              يرجى استخدام اسم المستخدم: <span className="text-primary-600 font-black">admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
