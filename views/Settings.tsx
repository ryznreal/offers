
import React, { useRef } from 'react';
import { Download, Upload, FileText, ArrowRight } from '../components/Icon';
import { Property } from '../types';
import { parseExcel } from '../utils/excelParser';
import { downloadTemplate } from '../utils/excelTemplate';

interface SettingsProps {
  onImport: (properties: Property[]) => void;
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onImport, onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imported = await parseExcel(file);
        if (imported.length > 0) {
          onImport(imported);
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

  return (
    <div className="p-4 md:p-8 md:pr-72 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowRight size={24} className="text-gray-600" />
          </button>
          <h2 className="text-2xl font-black text-gray-800">إعدادات النظام والبيانات</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Download Template Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-all">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Download size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">نموذج الإكسل</h3>
            <p className="text-sm text-gray-500 mb-6">قم بتحميل الملف فارغاً لترتيب بياناتك قبل الاستيراد</p>
            <button 
              onClick={downloadTemplate}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
            >
              تحميل النموذج
            </button>
          </div>

          {/* Import Data Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-all">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">استيراد البيانات</h3>
            <p className="text-sm text-gray-500 mb-6">ارفع ملف إكسل يحتوي على قائمة العقارات لإضافتها للنظام</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept=".xlsx, .xls"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-100"
            >
              اختيار الملف
            </button>
          </div>
        </div>

        <div className="mt-12 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
           <div className="shrink-0 p-2 bg-amber-100 rounded-lg text-amber-600 h-fit">
              <FileText size={20} />
           </div>
           <div>
              <h4 className="font-bold text-amber-800 mb-1 text-sm">تنبيه عند الاستيراد</h4>
              <p className="text-xs text-amber-700 leading-relaxed">تأكد من مطابقة أسماء الأعمدة في ملف الإكسل مع النموذج المعتمد. سيقوم النظام بتوليد معرفات فريدة تلقائياً في حال عدم وجودها.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
