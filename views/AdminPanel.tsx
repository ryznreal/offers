
import React, { useState, useEffect } from 'react';
import { User, UserRole, Property } from '../types';
import { 
  Users, 
  ShieldCheck, 
  Trash2, 
  UserCheck, 
  XCircle,
  ArrowRight,
  Lock,
  Building2
} from '../components/Icon';

interface AdminPanelProps {
  users: User[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onImportProperties: (properties: Property[]) => void;
  onBack: () => void;
  developers: string[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  users, 
  onAddUser, 
  onUpdateUser, 
  onDeleteUser,
  onBack
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    username: '',
    email: '',
    role: UserRole.Developer,
    developerKey: '',
    permissions: {
      canAdd: true, canEdit: true, canDelete: true, canExport: true, canManageUsers: false, canManageTeam: true
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdateUser({ ...editingUser, ...formData } as User);
    } else {
      const newUser: User = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        lastLogin: new Date().toISOString()
      } as User;
      
      if (newUser.role === UserRole.Developer) {
         newUser.developerId = newUser.id;
      }
      onAddUser(newUser);
    }
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      name: '', username: '', email: '', role: UserRole.Developer, developerKey: '',
      permissions: { canAdd: true, canEdit: true, canDelete: true, canExport: true, canManageUsers: false, canManageTeam: true }
    });
  };

  return (
    <div className="p-4 md:p-8 md:pr-[288px] bg-gray-50 min-h-screen pb-20 text-right" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm"><ArrowRight size={24} /></button>
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <ShieldCheck className="text-primary-600" size={32} />
              إدارة المطورين
            </h2>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform">إضافة مطور جديد</button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-gray-400">اسم المطور / الشركة</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400">اسم المستخدم</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400">المعرف الشخصي</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 text-center">العمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.filter(u => u.role === UserRole.Developer).map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5 font-black text-gray-800">{user.name}</td>
                  <td className="px-8 py-5 text-sm text-primary-600 font-bold">@{user.username}</td>
                  <td className="px-8 py-5 font-mono text-xs text-gray-400 font-bold">{user.developerKey}</td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => { setEditingUser(user); setFormData(user); setShowModal(true); }} className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"><UserCheck size={20} /></button>
                      <button onClick={() => onDeleteUser(user.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black">{editingUser ? 'تعديل بيانات المطور' : 'إضافة مطور جديد'}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500"><XCircle size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 mr-1">اسم المطور / الشركة</label>
                  <input type="text" required className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 font-bold outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="مثلاً: شركة ريز العقارية" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 mr-1">اسم المستخدم للدخول</label>
                  <input type="text" required className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 font-bold outline-none transition-all" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="مثلاً: reez_admin" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 mr-1">المعرف الشخصي (الرمز)</label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input type="text" required className="w-full pr-12 pl-4 py-4 rounded-xl bg-primary-50 border-2 border-primary-100 text-primary-700 font-black focus:border-primary-500 outline-none transition-all" value={formData.developerKey} onChange={e => setFormData({...formData, developerKey: e.target.value})} placeholder="مثلاً: RZ-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 mr-1">البريد الإلكتروني</label>
                  <input type="email" className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 font-bold outline-none transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="ceo@company.com" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-primary-600 text-white py-4 rounded-xl font-black shadow-lg">حفظ البيانات</button>
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-4 bg-gray-100 rounded-xl font-black text-gray-500">إلغاء</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
