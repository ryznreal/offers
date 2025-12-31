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
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary-100 transition-all cursor-pointer" 
         onClick={() => setFormData(prev => ({
           ...prev,
           permissions: {
             ...prev.permissions!,
             [field]: !prev.permissions![field]
           }
         }))}>
      <span className="text-sm font-bold text-gray-700">{label}</span>
      {formData.permissions![field] ? (
        <CheckCircle className="text-green-500" size={20} />
      ) : (
        <XCircle className="text-gray-300" size={20} />
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-8 md:pr-[288px] bg-gray-50 min-h-screen pb-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
              <ArrowRight size={20} className="text-gray-600" />
            </button>
            <div>
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <ShieldCheck className="text-primary-600" size={28} />
                إدارة النظام والبيانات
              </h2>
              <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-wider">التحكم الكامل في المستخدمين واستيراد العقارات</p>
            </div>
          </div>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-primary-100 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={20} />
            إضافة مستخدم جديد
          </button>
        </div>

        {/* Section 1: Data Management Tools */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-1.5 h-6 bg-primary-600 rounded-full"></div>
             <h3 className="text-lg font-black text-gray-800">أدوات البيانات (إكسل)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Download Template Card */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Download size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-black text-gray-800 mb-1">نموذج الإكسل</h3>
                <p className="text-[10px] text-gray-500 mb-3 font-bold">قم بتحميل الملف فارغاً لترتيب بياناتك قبل الاستيراد</p>
                <button 
                  onClick={downloadTemplate}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                >
                  تحميل النموذج
                </button>
              </div>
            </div>

            {/* Import Data Card */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Upload size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-black text-gray-800 mb-1">استيراد البيانات</h3>
                <p className="text-[10px] text-gray-500 mb-3 font-bold">ارفع ملف إكسل يحتوي على قائمة العقارات لإضافتها للنظام</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".xlsx, .xls"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-green-600 text-white rounded-xl text-xs font-black hover:bg-green-700 transition-colors shadow-lg shadow-green-100"
                >
                  اختيار الملف
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Users Table */}
        <section>
          <div className="flex items-center gap-3 mb-6">
             <div className="w-1.5 h-6 bg-primary-600 rounded-full"></div>
             <h3 className="text-lg font-black text-gray-800">إدارة الفريق والمستخدمين</h3>
          </div>
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">المستخدم</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">الدور الوظيفي</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">آخر تسجيل دخول</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">الصلاحيات</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-black">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900">{user.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${
                          user.role === UserRole.Admin ? 'bg-red-50 text-red-600' :
                          user.role === UserRole.Agent ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[10px] font-bold text-gray-400">
                        {new Date(user.lastLogin).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex gap-1.5">
                          {user.permissions.canAdd && <CheckCircle size={14} className="text-green-500" title="إضافة" />}
                          {user.permissions.canDelete && <Trash2 size={14} className="text-red-400" title="حذف" />}
                          {user.permissions.canManageUsers && <ShieldCheck size={14} className="text-primary-500" title="إدارة" />}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-left">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(user)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <UserCheck size={18} />
                          </button>
                          <button 
                            onClick={() => onDeleteUser(user.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
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
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-black text-gray-900">
                  {editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">الاسم الكامل</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm font-bold"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm font-bold"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">الدور الوظيفي</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm font-bold bg-white"
                      value={formData.role}
                      onChange={e => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                    >
                      {Object.values(UserRole).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">الصلاحيات المخصصة</label>
                  <div className="grid grid-cols-2 gap-3">
                    <PermissionToggle label="إضافة عروض" field="canAdd" />
                    <PermissionToggle label="تعديل العروض" field="canEdit" />
                    <PermissionToggle label="حذف العروض" field="canDelete" />
                    <PermissionToggle label="تصدير بيانات" field="canExport" />
                    <PermissionToggle label="إدارة الفريق" field="canManageUsers" />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-primary-50 hover:bg-primary-700 transition-all"
                  >
                    حفظ البيانات
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-4 rounded-2xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50"
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