
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Users, Plus, Trash2, ArrowRight, UserPlus } from '../components/Icon';

interface TeamManagementProps {
  currentUser: User;
  allUsers: User[];
  onAddMember: (user: User) => void;
  onDeleteMember: (id: string) => void;
  onBack: () => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ currentUser, allUsers, onAddMember, onDeleteMember, onBack }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: UserRole.Agent });

  const team = allUsers.filter(u => u.developerId === currentUser.developerId && u.id !== currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      developerId: currentUser.developerId,
      parentId: currentUser.id,
      permissions: {
        canAdd: true,
        canEdit: true,
        canDelete: false,
        canExport: true,
        canManageUsers: false,
        canManageTeam: formData.role === UserRole.Marketing
      },
      lastLogin: new Date().toISOString()
    };
    onAddMember(newUser);
    setShowModal(false);
    setFormData({ name: '', email: '', role: UserRole.Agent });
  };

  return (
    <div className="p-4 md:p-8 md:pr-[288px] bg-gray-50 min-h-screen text-right" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm"><ArrowRight size={22} /></button>
            <h2 className="text-2xl font-black text-gray-900">إدارة الفريق</h2>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-primary-600 text-white px-6 py-3 rounded-xl font-black shadow-lg flex items-center gap-2">
            <UserPlus size={20} />
            إضافة عضو
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          {team.length === 0 ? (
            <div className="p-20 text-center">
              <Users size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">لا يوجد أعضاء في فريقك</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-xs font-black text-gray-400">الاسم</th>
                  <th className="px-8 py-4 text-xs font-black text-gray-400">الدور</th>
                  <th className="px-8 py-4 text-xs font-black text-gray-400">العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {team.map(member => (
                  <tr key={member.id}>
                    <td className="px-8 py-5">
                      <p className="font-black text-gray-800">{member.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{member.email}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${member.role === UserRole.Marketing ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <button onClick={() => onDeleteMember(member.id)} className="p-2 text-red-400"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8">
              <h3 className="text-xl font-black mb-6">إضافة عضو جديد</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2">اسم المستخدم</label>
                  <input type="text" required className="w-full px-5 py-4 rounded-xl bg-gray-50 font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2">الرتبة</label>
                  <select className="w-full px-5 py-4 rounded-xl bg-gray-50 font-bold" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
                    {currentUser.role === UserRole.Developer && <option value={UserRole.Marketing}>{UserRole.Marketing}</option>}
                    <option value={UserRole.Agent}>{UserRole.Agent}</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-primary-600 text-white py-4 rounded-xl font-black">حفظ العضو</button>
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-4 bg-gray-100 rounded-xl font-black">إلغاء</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
