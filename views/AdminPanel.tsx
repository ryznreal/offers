
import React, { useState, useRef } from 'react';
import { User, UserRole, Property } from '../types';
import { 
  Users, 
  ShieldCheck, 
  Lock, 
  Plus, 
  Trash2, 
  Mail, 
  UserCheck, 
  XCircle,
  CheckCircle,
  MoreVertical,
  Download,
  Upload,
  FileText,
  ArrowRight
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
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  users, 
  onAddUser, 
  onUpdateUser, 
  onDeleteUser,
  onImportProperties,
  onBack
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: UserRole.Agent,
    permissions: {
      canAdd: true,
      canEdit: true,
      canDelete: false,
      canExport: true,
      canManageUsers: false
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imported = await parseExcel(file);
        if (imported.length > 0) {
          onImportProperties(imported);
          alert(`تم استيراد ${imported.length} عقار بنجاح`);
        } else {
          alert('لم يتم العثور على بيانات في الملف');
        }
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء قراءة الملف. تأكد من صحة الصيغة.');
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
      role: UserRole.Agent,
      permissions: {
        canAdd: true,
        canEdit: true,
        canDelete: false,
        canExport: true,
        canManageUsers: false
      }
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
      <span className="text-base font-bold text-gray-700">{label}</span>
      {formData.permissions![field] ? (
        <CheckCircle className="text-green-500" size={24} />
      ) : (
        <XCircle className="text-gray-300" size={24} />
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-8 md:pr-[288px] bg-gray-50 min-h-screen pb-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-3 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
              <ArrowRight size={24} className="text-gray-600" />
            </button>
            <div>
              <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
                <ShieldCheck className="text-primary-600" size={36} />
                إدارة النظام والبيانات
              </h2>
              <p className="text-gray-500 text-sm font-bold mt-1 uppercase tracking-wider">التحكم الكامل في المستخدمين واستيراد العقارات</p>
            </div>
          </div>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-3 bg-primary-600 text-white px-8 py-4 rounded-[2rem] font-black text-lg shadow-lg shadow-primary-100 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={24} />
            إضافة مستخدم جديد
          </button>
        </div>

        {/* Section 1: Data Management Tools */}
        <section className="mb-14">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-2 h-8 bg-primary-600 rounded-full"></div>
             <h3 className="text-xl font-black text-gray-800">أدوات البيانات (إكسل)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Download Template Card */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex items-center gap-8 group hover:shadow-md transition-all">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Download size={40} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-800 mb-2">نموذج الإكسل</h3>
                <p className="text-xs text-gray-500 mb-4 font-bold">قم بتحميل الملف فارغاً لترتيب بياناتك قبل الاستيراد</p>
                <button 
                  onClick={downloadTemplate}
                  className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                >
                  تحميل النموذج
                </button>
              </div>
            </div>

            {/* Import Data Card */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex items-center gap-8 group hover:shadow-md transition-all">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Upload size={40} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-800 mb-2">استيراد البيانات</h3>
                <p className="text-xs text-gray-500 mb-4 font-bold">ارفع ملف إكسل يحتوي على قائمة العقارات لإضافتها للنظام</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".xlsx, .xls"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3 bg-green-600 text-white rounded-2xl text-sm font-black hover:bg-green-700 transition-colors shadow-lg shadow-green-100"
                >
                  اختيار الملف
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Users Table */}
        <section>
          <div className="flex items-center gap-4 mb-8">
             <div className="w-2 h-8 bg-primary-600 rounded-full"></div>
             <h3 className="text-xl font-black text-gray-800">إدارة الفريق والمستخدمين</h3>
          </div>
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-6 text-sm font-black text-gray-400 uppercase">المستخدم</th>
                    <th className="px-8 py-6 text-sm font-black text-gray-400 uppercase">الدور الوظيفي</th>
                    <th className="px-8 py-6 text-sm font-black text-gray-400 uppercase">آخر تسجيل دخول</th>
                    <th className="px-8 py-6 text-sm font-black text-gray-400 uppercase">الصلاحيات</th>
                    <th className="px-8 py-6 text-sm font-black text-gray-400 uppercase"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-black shadow-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-lg font-black text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-400 font-bold">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-2 rounded-xl text-xs font-black ${
                          user.role === UserRole.Admin ? 'bg-red-50 text-red-600' :
                          user.role === UserRole.Agent ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-gray-400">
                        {new Date(user.lastLogin).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          {user.permissions.canAdd && <CheckCircle size={20} className="text-green-500" title="إضافة" />}
                          {user.permissions.canDelete && <Trash2 size={20} className="text-red-400" title="حذف" />}
                          {user.permissions.canManageUsers && <ShieldCheck size={20} className="text-primary-500" title="إدارة" />}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-left">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(user)}
                            className="p-3 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                          >
                            <UserCheck size={24} />
                          </button>
                          <button 
                            onClick={() => onDeleteUser(user.id)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 size={24} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-2xl font-black text-gray-900">
                  {editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={32} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">الاسم الكامل</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-base font-bold shadow-sm"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-base font-bold shadow-sm"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">الدور الوظيفي</label>
                    <select 
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-base font-bold bg-white shadow-sm"
                      value={formData.role}
                      onChange={e => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                    >
                      {Object.values(UserRole).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">الصلاحيات المخصصة</label>
                  <div className="grid grid-cols-2 gap-4">
                    <PermissionToggle label="إضافة عروض" field="canAdd" />
                    <PermissionToggle label="تعديل العروض" field="canEdit" />
                    <PermissionToggle label="حذف العروض" field="canDelete" />
                    <PermissionToggle label="تصدير بيانات" field="canExport" />
                    <PermissionToggle label="إدارة الفريق" field="canManageUsers" />
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-primary-50 hover:bg-primary-700 transition-all active:scale-95"
                  >
                    حفظ البيانات
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-10 py-5 rounded-[2rem] border border-gray-200 font-black text-lg text-gray-400 hover:bg-gray-50 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
