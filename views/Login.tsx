
import React, { useState } from 'react';
import { User, UserRole } from '../types';
// Added XCircle to the imports to resolve the "Cannot find name 'XCircle'" error on line 99.
import { Building2, UserCheck, ShieldCheck, Users, ArrowRight, Lock, Mail, Eye, EyeOff, XCircle } from '../components/Icon';
import { toEnglishDigits } from '../utils/helpers';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // البحث عن المستخدم بالاسم أو البريد الإلكتروني
    const user = users.find(u => 
      (u.name === username || u.email === username) && 
      u.password === toEnglishDigits(password)
    );

    if (user) {
      onLogin(user);
    } else {
      setError('خطأ في اسم المستخدم أو كلمة المرور');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-right font-sans" dir="rtl">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-600 text-white rounded-[2.5rem] shadow-2xl shadow-primary-100 mb-6 border-4 border-white">
            <Building2 size={48} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">نظام الوسيط العقاري</h1>
          <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px]">Real Estate Management System v2.0</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
              <Lock size={20} />
            </div>
            <h2 className="text-xl font-black text-gray-800">بوابة الموظفين</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 mr-1">اسم المستخدم أو البريد</label>
                <div className="relative group">
                  <Users className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    required 
                    placeholder="مثال: أحمد الإداري"
                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl pr-12 pl-4 py-4 font-bold text-sm outline-none focus:bg-white focus:border-primary-500 transition-all shadow-inner"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 mr-1">كلمة المرور</label>
                <div className="relative group">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl pr-12 pl-12 py-4 font-bold text-sm outline-none focus:bg-white focus:border-primary-500 transition-all shadow-inner text-left"
                    dir="ltr"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
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
              دخول للنظام
              <ArrowRight size={20} className="rotate-180" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-relaxed">
              إذا فقدت كلمة المرور الخاصة بك<br/>يرجى مراجعة مدير النظام
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
          © {new Date().getFullYear()} جميع الحقوق محفوظة - شركة الوسيط العقاري
        </p>
      </div>
    </div>
  );
};
