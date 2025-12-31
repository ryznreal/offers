
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  Users, 
  Trash2, 
  ArrowRight, 
  UserPlus, 
  CheckCircle, 
  XCircle,
  Mail
} from '../components/Icon';

interface TeamManagementProps {
  currentUser: User;
  allUsers: User[];
  onAddMember: (user: User) => void;
  onDeleteMember: (id: string) => void;
  onBack: () => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ currentUser, allUsers, onAddMember, onDeleteMember, onBack }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    username: '', 
    name: '', 
    email: '', 
    role: UserRole.Agent 
  });

  const team = allUsers.filter(u => u.developerId === currentUser.developerId && u.id !== currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: formData.username.trim().toLowerCase(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      developerId: currentUser.developerId, // ربط ثابت بمعرف المطور
      parentId: currentUser.id,
      permissions: {
        canAdd: true, canEdit: true, canDelete: false, canExport: true, canManageUsers: false,
        canManageTeam: formData.role === UserRole.Marketing
      },
      lastLogin: new Date().toISOString()
    };
    
    onAddMember(newUser);
    setShowModal(false);
    setFormData({ username: '', name: '', email: '', role: UserRole.Agent });
  };

  return (
    <div className="p-4 md:p-8 md:pr-[288px] bg-gray-50 min-h-screen text-right" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"><ArrowRight size={22} /></button>
            <h2 className="text-2xl font-black text-gray-900">إدارة فريق العمل</h2>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-primary-600 text-white px-6 py-3 rounded-xl font-black shadow-lg flex items-center gap-2 hover:scale-[1.02] transition-transform">
            <UserPlus size={20} />
            إضافة عضو فريق
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          {team.length === 0 ? (
            <div className="p-20 text-center">
              <Users size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">لم يتم إضافة أي أعضاء في فريقك حتى الآن</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-xs font-black text-gray-400">الاسم والبيانات</th>
                  <th className="px-8 py-4 text-xs font-black text-gray-400 text-center">الرتبة</th>
                  <th className="px-8 py-4 text-xs font-black text-gray-400 text-center">العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {team.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50/50">
                    <td className="px-8 py-5">
                      <p className="font-black text-gray-800">{member.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-primary-600 font-black">@{member.username}</span>
                        <span className="text-[10px] text-gray-300 font-bold">• {member.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${member.role === UserRole.Marketing ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <button onClick={() => { if(confirm('حذف هذا العضو؟')) onDeleteMember(member.id); }} className="p-2 text-red-300 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
              <h3 className="text-xl font-black mb-6">إضافة عضو جديد للفريق</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 mr-1 uppercase">الاسم الكامل</label>
                  <input type="text" required className="w-full px-5 py-4 rounded-xl bg-gray-50 font-bold border border-transparent focus:border-primary-500 transition-all outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="أحمد محمد" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 mr-1 uppercase">اسم المستخدم للدخول</label>
                  <input type="text" required className="w-full px-5 py-4 rounded-xl bg-gray-50 font-bold border border-transparent focus:border-primary-500 transition-all outline-none" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="ahmed_99" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 mr-1 uppercase">البريد الإلكتروني</label>
                  <input type="email" className="w-full px-5 py-4 rounded-xl bg-gray-50 font-bold border border-transparent focus:border-primary-500 transition-all outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="mail@example.com" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 mr-1 uppercase">الرتبة الوظيفية</label>
                  <select className="w-full px-5 py-4 rounded-xl bg-gray-50 font-bold border border-transparent focus:border-primary-500 transition-all outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
                    <option value={UserRole.Agent}>مسوق عقاري</option>
                    <option value={UserRole.Marketing}>مدير تسويق</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-primary-600 text-white py-4 rounded-xl font-black shadow-lg">تأكيد الإضافة</button>
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
