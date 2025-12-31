
import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole, Property } from '../types';
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  UserCheck, 
  XCircle,
  CheckCircle,
  Download,
  Upload,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  Lock,
  UserPlus
} from '../components/Icon';
import { parseExcel } from '../utils/excelParser';
import { downloadTemplate } from '../utils/excelTemplate';

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
  onImportProperties,
  onBack,
  developers
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: UserRole.Developer,
    developerKey: '',
    permissions: {
      canAdd: true,
      canEdit: true,
      canDelete: false,
      canExport: true,
      canManageUsers: false,
      canManageTeam: true
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
        developerId: formData.role === UserRole.Developer ? undefined : formData.developerId,
        lastLogin: new Date().toISOString()
      } as User;
      
      // إذا كان هو المطور نفسه، نجعل الـ ID الخاص به هو الـ developerId للتابعين
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
      name: '', email: '', role: UserRole.Developer, developerKey: '',
      permissions: { canAdd: true, canEdit: true, canDelete: false, canExport: true, canManageUsers: false, canManageTeam: true }
    });
  };

  return (
    <div className="p-4 md:p-8 md:pr-[288px] bg-gray-50 min-h-screen pb-20 text-right" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-3 bg-white rounded-full shadow-sm"><ArrowRight size={24} /></button>
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
              <ShieldCheck className="text-primary-600" size={36} />
              إدارة المطورين والنظام
            </h2>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg">إضافة مطور جديد</button>
        </div>

        <section className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-6 text-xs font-black text-gray-400">الاسم / الشركة</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400">الرتبة</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400">رمز الدخول</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400">العمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(user => (
                <tr key={user.id} className="group">
                  <td className="px-8 py-6 font-black text-gray-900">{user.name}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${
                      user.role === UserRole.Admin ? 'bg-red-50 text-red-600' :
                      user.role === UserRole.Developer ? 'bg-primary-50 text-primary-600' : 'bg-gray-50 text-gray-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-mono text-xs text-primary-600 font-bold">{user.developerKey || '-'}</td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { setEditingUser(user); setFormData(user); setShowModal(true); }} className="p-2 text-primary-600"><UserCheck size={20} /></button>
                      <button onClick={() => onDeleteUser(user.id)} className="p-2 text-red-500"><Trash2 size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-8">
              <h3 className="text-xl font-black mb-8">{editingUser ? 'تعديل بيانات' : 'إضافة مطور جديد'}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2">اسم المطور / الشركة</label>
                  <input type="text" required className="w-full px-5 py-4 rounded-2xl bg-gray-50 font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                {formData.role === UserRole.Developer && (
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 mb-2">رمز المطور (للدخول)</label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input type="text" required className="w-full pr-12 pl-4 py-4 rounded-2xl bg-primary-50 border border-primary-100 text-primary-700 font-black" value={formData.developerKey} onChange={e => setFormData({...formData, developerKey: e.target.value})} placeholder="مثلاً: DEV2024" />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black">حفظ المطور</button>
                  <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 bg-gray-100 rounded-2xl font-black">إلغاء</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
