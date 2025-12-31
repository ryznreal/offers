
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Building2, UserCheck, ShieldCheck, Users, ArrowRight, XCircle, Lock } from '../components/Icon';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [devKey, setDevKey] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedUsername = username.trim().toLowerCase();
    
    // محاولة إيجاد المستخدم
    const user = users.find(u => 
      (u.name.toLowerCase() === normalizedUsername || u.email.toLowerCase() === normalizedUsername)
    );

    if (!user) {
      setError('اسم المستخدم غير صحيح');
      return;
    }

    // إذا لم يكن مدير نظام، يجب التأكد من رمز المطور
    if (user.role !== UserRole.Admin) {
      if (!devKey) {
        setError('يرجى إدخال رمز المطور الخاص بشركتك');
        return;
      }

      // البحث عن المطور الأساسي لهذا المستخدم للتأكد من الرمز
      const developer = users.find(u => u.id === user.developerId && u.role === UserRole.Developer);
      if (developer?.developerKey !== devKey) {
        setError('رمز المطور غير صحيح');
        return;
      }
    }

    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-right font-sans" dir="rtl">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-600 text-white rounded-[2.5rem] shadow-2xl shadow-primary-100 mb-6 border-4 border-white">
            <Building2 size={48} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">نظام الوسيط العقاري</h1>
          <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px]">نظام إدارة المطورين والوكلاء</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-white">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-1">اسم المستخدم</label>
                <div className="relative group">
                  <Users className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="text" 
                    required 
                    placeholder="اسم المستخدم"
                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl pr-12 pl-4 py-4 font-bold text-sm outline-none focus:bg-white focus:border-primary-500 transition-all shadow-inner"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* حقل رمز المطور يظهر دائماً كخيار احترازي أو بناءً على اسم المستخدم */}
              <div className="animate-in fade-in duration-700">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-1">رمز المطور (للمطورين والمنسوبين)</label>
                <div className="relative group">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="رمز الشركة الخاص بك"
                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl pr-12 pl-4 py-4 font-bold text-sm outline-none focus:bg-white focus:border-primary-500 transition-all shadow-inner"
                    value={devKey}
                    onChange={e => setDevKey(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3">
                <XCircle size={18} className="text-red-500" />
                <p className="text-xs font-black text-red-600">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-5 rounded-[2rem] font-black text-lg shadow-xl bg-primary-600 text-white shadow-primary-100 hover:bg-primary-700 transition-all flex items-center justify-center gap-3"
            >
              تسجيل الدخول
              <ArrowRight size={20} className="rotate-180" />
            </button>
          </form>

          <div className="mt-8 text-center p-4 bg-blue-50 rounded-2xl">
            <p className="text-[10px] font-bold text-blue-700 leading-relaxed">
              * الدخول كمدير نظام لا يتطلب رمز مطور.
              <br/>
              * المنسوبون يحتاجون رمز المطور الذي أضافهم.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
