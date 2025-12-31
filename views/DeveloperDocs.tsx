
import React from 'react';
import { ArrowRight, Code, Database, FileJson, Layout, Shield, Zap, Globe, FileSpreadsheet } from '../components/Icon';

// Fix: Defined SectionProps interface to properly type the Section component and its children
interface SectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

// Fix: Moved Section component outside of DeveloperDocs and typed it as React.FC to resolve children property errors
const Section: React.FC<SectionProps> = ({ title, icon: Icon, children }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-8">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-black text-gray-800">{title}</h3>
    </div>
    <div className="prose prose-sm max-w-none text-gray-600 font-medium leading-relaxed">
      {children}
    </div>
  </div>
);

export const DeveloperDocs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="p-4 md:p-8 md:pr-[288px] bg-gray-50 min-h-screen pb-20 text-right" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
            <ArrowRight size={24} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-3xl font-black text-gray-900">الدليل التقني للمطورين</h2>
            <p className="text-gray-400 text-xs font-bold mt-1 uppercase">Architecture, Data Models & Logic</p>
          </div>
        </div>

        {/* Fix: Usage of Section component now correctly passes children through standard JSX nesting */}
        <Section title="نظرة عامة على التقنيات" icon={Zap}>
          <p>تم بناء التطبيق باستخدام <strong>React 19</strong> مع <strong>Tailwind CSS</strong> للتصميم. يعتمد التطبيق على نظام الـ Single Page Application (SPA) مع إدارة حالة مركزية في ملف <code className="bg-gray-100 px-1 rounded">App.tsx</code>.</p>
          <ul className="list-disc pr-5 mt-4 space-y-2">
            <li><strong>Tailwind Config:</strong> مخصص لدعم ألوان الهوية (Primary للسكني، Secondary للأراضي).</li>
            <li><strong>Icons:</strong> استخدام مكتبة <code className="bg-gray-100 px-1 rounded">lucide-react</code> عبر مكون وسيط.</li>
            <li><strong>Excel:</strong> معالجة الملفات عبر مكتبة <code className="bg-gray-100 px-1 rounded">xlsx (SheetJS)</code>.</li>
          </ul>
        </Section>

        <Section title="هيكلة البيانات (Data Models)" icon={Database}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <h4 className="font-black text-gray-800 mb-2">Property (العرض الفردي)</h4>
              <p className="text-[11px]">يمثل عقاراً واحداً (شقة، أرض، فيلا). يتم تخزينه في مصفوفة <code className="bg-gray-100 px-1 rounded">baseProperties</code>.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <h4 className="font-black text-gray-800 mb-2">Project (المشروع المطور)</h4>
              <p className="text-[11px]">يمثل هيكلاً إنشائياً كاملاً (أدوار، وحدات، نماذج). يتم تخزينه في <code className="bg-gray-100 px-1 rounded">projects</code>.</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-primary-50 rounded-2xl border border-primary-100">
            <h4 className="font-black text-primary-800 mb-2">منطق التوليد الديناميكي (Dynamic Generation)</h4>
            <p className="text-xs">في ملف <code className="bg-gray-100 px-1 rounded">App.tsx</code>، تقوم دالة <code className="bg-gray-100 px-1 rounded">refreshDisplayProperties</code> بدمج العروض الفردية مع العروض المولدة آلياً من المشاريع بناءً على النماذج المتاحة، مما يعرضها للمستخدم النهائي كبطاقات مستقلة.</p>
          </div>
        </Section>

        <Section title="نظام الصلاحيات (RBAC)" icon={Shield}>
          <p>يحتوي كائن المستخدم <code className="bg-gray-100 px-1 rounded">User</code> على حقل <code className="bg-gray-100 px-1 rounded">permissions</code> الذي يتحكم في ظهور العناصر:</p>
          <ul className="list-disc pr-5 mt-3 space-y-1 text-xs">
            <li><code className="bg-gray-100 px-1 rounded">canAdd</code>: التحكم في ظهور زر الإضافة وبوابة الأنواع.</li>
            <li><code className="bg-gray-100 px-1 rounded">canManageUsers</code>: الوصول إلى لوحة تحكم الإدارة (AdminPanel).</li>
            <li><code className="bg-gray-100 px-1 rounded">Marketing Role</code>: يسمح بالوصول لبوابة التسويق لتغيير حالات الوحدات فقط.</li>
          </ul>
        </Section>

        <Section title="معالجة الأرقام واللغات" icon={Globe}>
          <p>لحل مشاكل الإدخال في بيئة المستخدم العربي، تم إنشاء <code className="bg-gray-100 px-1 rounded">utils/helpers.ts</code>:</p>
          <ul className="list-disc pr-5 mt-3 space-y-2 text-xs">
            <li><strong>Normalization:</strong> تحويل الأرقام الهندية (٠١٢) إلى عربية (012) برمجياً قبل الحفظ.</li>
            <li><strong>Inputs:</strong> استبدال <code className="bg-gray-100 px-1 rounded">type="number"</code> بـ <code className="bg-gray-100 px-1 rounded">type="text"</code> مع <code className="bg-gray-100 px-1 rounded">inputMode="numeric"</code> لضمان استجابة لوحة المفاتيح بشكل صحيح في الجوال.</li>
          </ul>
        </Section>

        <Section title="استيراد وتصدير البيانات" icon={FileSpreadsheet}>
          <ul className="list-disc pr-5 space-y-2">
            <li><code className="bg-gray-100 px-1 rounded">excelTemplate.ts</code>: يقوم بإنشاء ملف Blob يحتوي على ترويسات متوافقة مع واجهة البيانات.</li>
            <li><code className="bg-gray-100 px-1 rounded">excelParser.ts</code>: يقرأ الملف ويقوم بعملية Mapping ذكية للحقول بناءً على نوع العقار (سكني/أرض).</li>
          </ul>
        </Section>

        <Section title="إرشادات الصيانة" icon={Code}>
          <p className="text-xs">عند إضافة حقل جديد:</p>
          <ol className="list-decimal pr-5 mt-2 space-y-1 text-xs">
            <li>تحديث الواجهة في <code className="bg-gray-100 px-1 rounded">types.ts</code>.</li>
            <li>تحديث نموذج الإضافة في <code className="bg-gray-100 px-1 rounded">AddProperty.tsx</code>.</li>
            <li>تحديث دالة <code className="bg-gray-100 px-1 rounded">refreshDisplayProperties</code> في <code className="bg-gray-100 px-1 rounded">App.tsx</code> إذا كان الحقل مرتبطاً بالمشاريع المطورة.</li>
          </ol>
        </Section>
      </div>
    </div>
  );
};
