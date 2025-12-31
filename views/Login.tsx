
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Building2, Users, ArrowRight, XCircle, Lock, ShieldCheck } from '../components/Icon';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
  const [loginType, setLoginType] = useState<'staff' | 'admin'>('staff');
  const [username, setUsername] = useState('');
  const [devKey, setDevKey] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedUsername = username.trim().toLowerCase();
    
    // البحث عن المستخدم بواسطة الحقل username الجديد
    const user = users.find(u => u.username.toLowerCase() === normalizedUsername);

    if (!user) {
      setError('اسم المستخدم غير صحيح');
      return;
    }

    // منطق دخول مدير النظام
    if (loginType === 'admin') {
      if (user.role !== UserRole.Admin) {
        setError('هذا الحساب لا يملك صلاحيات مدير نظام');
        return;
      }
      onLogin(user);
      return;
    }

    // منطق دخول المطور وفريقه
    if (loginType === 'staff') {
      if (user.role === UserRole.Admin) {
        setError('يرجى اختيار "إدارة النظام" لتسجيل الدخول بهذا الحساب');
        return;
      }

      if (!devKey) {
        setError('يرجى إدخال المعرف الشخصي (رمز المطور)');
        return;
      }

      // التحقق من المعرف الشخصي (developerKey) المرتبط بالمطور الرئيسي لهذا العضو
      const developer = users.find(u => u.id === user.developerId && u.role === UserRole.Developer);
      
      if (!developer || developer.developerKey !== devKey.trim()) {
        setError('المعرف الشخصي غير صحيح لهذه المنشأة');
        return;
      }

      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 text-right font-sans" dir="rtl">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 text-white rounded-[1.5rem] shadow-xl mb-4 border-4 border-white">
            <Building2 size={40} />
          </div>
          <h1 className="text-2xl font-black text-gray-900">الوسيط العقاري</h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">بوابة المطورين والفرق المعتمدة</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary-600 opacity-20"></div>
          
          <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-8">
            <button 
              onClick={() => { setLoginType('staff'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs transition-all ${loginType === 'staff' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400'}`}
            >
              <Users size={16} />
              مطور / فريق عمل
            </button>
            <button 
              onClick={() => { setLoginType('admin'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs transition-all ${loginType === 'admin' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'}`}
            >
              <ShieldCheck size={16} />
              إدارة النظام
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-1">اسم المستخدم</label>
              <div className="relative group">
                <Users className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${loginType === 'admin' ? 'text-red-300' : 'text-primary-300'}`} size={18} />
                <input 
                  type="text" 
                  required 
                  placeholder="أدخل اسم المستخدم"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pr-12 pl-4 py-4 font-bold text-sm outline-none focus:bg-white focus:border-primary-500 transition-all shadow-inner"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
            </div>

            {loginType === 'staff' && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-1">المعرف الشخصي (رمز المطور)</label>
                <div className="relative group">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="مثال: EMAR-100"
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pr-12 pl-4 py-4 font-bold text-sm outline-none focus:bg-white focus:border-primary-500 transition-all shadow-inner"
                    value={devKey}
                    onChange={e => setDevKey(e.target.value)}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 animate-in shake duration-300">
                <XCircle size={18} className="text-red-500 shrink-0" />
                <p className="text-[11px] font-black text-red-600">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              className={`w-full py-5 rounded-[1.5rem] font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
                loginType === 'admin' 
                ? 'bg-red-600 text-white shadow-red-100 hover:bg-red-700' 
                : 'bg-primary-600 text-white shadow-primary-100 hover:bg-primary-700'
              }`}
            >
              دخول المنصة
              <ArrowRight size={20} className="rotate-180" />
            </button>
          </form>

          <div className="mt-8 text-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 leading-relaxed">
              {loginType === 'admin' 
                ? 'لوحة تحكم مدير النظام محمية وتتطلب صلاحيات عليا.' 
                : 'يجب استخدام اسم المستخدم الشخصي مع رمز الشركة المعتمد.'}
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
           الوسيط العقاري &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};
