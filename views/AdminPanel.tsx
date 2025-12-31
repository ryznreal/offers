
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
  Building2
} from '../components/Icon';
// Fix: Corrected import source for parseExcel as it is exported from excelParser, not helpers
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
  const [showFormPassword, setShowFormPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    password: '',
    role: UserRole.Agent,
    assignedDeveloper: '',
    permissions: {
      canAdd: true,
      canEdit: true,
      canDelete: false,
      canExport: true,
      canManageUsers: false
    }
  });

  useEffect(() => {
    if (formData.role && !editingUser) {
      const defaultPermissions = {
        [UserRole.Admin]: { canAdd: true, canEdit: true, canDelete: true, canExport: true, canManageUsers: true },
        [UserRole.Marketing]: { canAdd: false, canEdit: true, canDelete: false, canExport: true, canManageUsers: false },
        [UserRole.Agent]: { canAdd: true, canEdit: true, canDelete: false, canExport: true, canManageUsers: false },
        [UserRole.Viewer]: { canAdd: false, canEdit: false, canDelete: false, canExport: false, canManageUsers: false },
      };
      
      setFormData(prev => ({
        ...prev,
        permissions: defaultPermissions[formData.role as UserRole] || prev.permissions
      }));
    }
  }, [formData.role, editingUser]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imported = await parseExcel(file);
        if (imported.length > 0) {
          onImportProperties(imported);
          alert(`تم استيراد ${imported.length} عقار بنجاح`);
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة الملف.');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData(user);
    setShowModal(true);
  };

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
      onAddUser(newUser);
    }
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: UserRole.Agent,
      assignedDeveloper: '',
      permissions: { canAdd: true, canEdit: true, canDelete: false, canExport: true, canManageUsers: false }
    });
  };

  const PermissionToggle = ({ label, field }: { label: string, field: keyof User['permissions'] }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary-100 transition-all cursor-pointer" 
         onClick={() => setFormData(prev => ({
           ...prev,
           permissions: {
             ...prev.permissions!,
             [field]: !prev.permissions![field]
           }
         }))}>
      <span className="text-xs font-bold text-gray-700">{label}</span>
      {formData.permissions![field] ? (
        <CheckCircle className="text-green-500" size={20} />
      ) : (
        <XCircle className="text-gray-300" size={20} />
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-8 md:pr-[288px] bg-gray-50 min-h-screen pb-20 text-right" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-3 bg-white rounded-full shadow-sm">
              <ArrowRight size={24} className="text-gray-600" />
            </button>
            <div>
              <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
                <ShieldCheck className="text-primary-600" size={36} />
                إدارة النظام
              </h2>
            </div>
          </div>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-primary-600 text-white px-8 py-4 rounded-[2rem] font-black shadow-lg"
          >
            إضافة مستخدم جديد
          </button>
        </div>

        <section className="mb-14 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex items-center gap-8">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <Download size={40} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-800">نموذج الإكسل</h3>
                <button onClick={downloadTemplate} className="mt-2 text-primary-600 font-bold underline">تحميل النموذج</button>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex items-center gap-8">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                <Upload size={40} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-800">استيراد البيانات</h3>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".xlsx, .xls" />
                <button onClick={() => fileInputRef.current?.click()} className="mt-2 text-green-600 font-bold underline">اختيار ملف</button>
              </div>
            </div>
        </section>

        <section className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-6 text-xs font-black text-gray-400">المستخدم</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400">الدور</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400">التبعية (للمسوقين)</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(user => (
                <tr key={user.id} className="group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-black">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-gray-900">{user.name}</p>
                        <p className="text-[10px] text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${
                      user.role === UserRole.Admin ? 'bg-red-50 text-red-600' :
                      user.role === UserRole.Marketing ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-gray-500">
                    {user.assignedDeveloper || '-'}
                  </td>
                  <td className="px-8 py-6 text-left">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100">
                      <button onClick={() => handleEdit(user)} className="p-2 text-primary-600"><UserCheck size={20} /></button>
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
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-black">{editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400"><XCircle size={32} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">الاسم الكامل</label>
                    <input type="text" required className="w-full px-5 py-4 rounded-2xl bg-gray-50 font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">الدور الوظيفي</label>
                    <select className="w-full px-5 py-4 rounded-2xl bg-gray-50 font-bold" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
                      {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </div>
                  
                  {formData.role === UserRole.Marketing && (
                    <div className="animate-in slide-in-from-top-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">المطور المسؤول عنه</label>
                      <select className="w-full px-5 py-4 rounded-2xl bg-orange-50 border border-orange-100 font-bold text-orange-700" value={formData.assignedDeveloper} onChange={e => setFormData({...formData, assignedDeveloper: e.target.value})}>
                        <option value="">اختر المطور...</option>
                        {developers.map(dev => <option key={dev} value={dev}>{dev}</option>)}
                      </select>
                    </div>
                  )}

                  <div className="col-span-2">
                    <label className="block text-xs font-black text-gray-400 mb-3">الصلاحيات التقنية</label>
                    <div className="grid grid-cols-2 gap-3">
                      <PermissionToggle label="إضافة عروض" field="canAdd" />
                      <PermissionToggle label="تعديل العروض" field="canEdit" />
                      <PermissionToggle label="حذف العروض" field="canDelete" />
                      <PermissionToggle label="إدارة النظام (إعدادات)" field="canManageUsers" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black shadow-lg">حفظ البيانات</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
