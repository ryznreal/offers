
import React from 'react';
import { 
  ArrowRight, 
  Download, 
  Copy,
  CheckCircle,
  Database,
  Code,
  ShieldCheck,
  Zap,
  Layout,
  FileSpreadsheet,
  FileText
} from '../components/Icon';

interface SpecSectionProps {
  title: string;
  icon: React.ElementType;
  items: string[];
}

const BulletSection: React.FC<SpecSectionProps> = ({ title, icon: Icon, items }) => (
  <div className="mb-10 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4 mb-6 border-b border-gray-50 pb-4">
      <div className="p-3 bg-primary-600 text-white rounded-2xl shadow-lg">
        <Icon size={24} />
      </div>
      <h3 className="text-2xl font-black text-gray-900">{title}</h3>
    </div>
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-4 group">
          <div className="mt-1.5 shrink-0">
            <CheckCircle size={16} className="text-primary-500 opacity-40 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-gray-700 font-bold leading-relaxed text-sm whitespace-pre-line">
            {item}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export const SpecSheet: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  
  const generateFullSpecText = () => {
    let text = "# وثيقة المواصفات الفنية - نظام الوسيط العقاري\n\n";
    
    const sections = [
      {
        title: "١. هيكلية قواعد البيانات (Data Schema)",
        items: [
          "جدول Properties: المعرف (ID)، النوع (سكني/أرض)، المدينة، الحي، السعر، المساحة، الإحداثيات، الصور.",
          "جدول Projects: هيكل المشروع، المطور، عدد الأدوار، الوحدات لكل دور، رابط البروفايل، الوصف الكامل.",
          "جدول Models: النماذج المرتبطة بالمشروع (المساحة، الغرف، السعر، اللون التعريفي).",
          "جدول Units: تخزين حالات الوحدات الفردية (متاح، محجوز، مباع) وربطها بالنماذج.",
          "جدول Users: بيانات المستخدمين، الرتب (Admin, Marketing, Agent)، ومصفوفة الصلاحيات."
        ]
      },
      {
        title: "٢. المنطق البرمجي والذكاء (Core Logic)",
        items: [
          "خوارزمية refreshDisplayProperties: تقوم بدمج العقارات الفردية مع النماذج المتاحة في المشاريع لتوليد عروض تلقائية.",
          "تطبيع الأرقام (Normalization): دالة لتحويل الأرقام العربية/الفارسية إلى إنجليزية قبل العمليات الحسابية.",
          "منطق الأراضي: حساب السعر الإجمالي تلقائياً (المساحة × سعر المتر).",
          "نظام الحالات: إخفاء الوحدات المباعة تلقائياً من واجهة العرض العامة وتحديثها فقط في لوحة تحكم المسوق."
        ]
      },
      {
        title: "٣. معايير واجهة المستخدم (UX Standards)",
        items: [
          "التصميم المتجاوب: دعم كامل للجوال (عمود واحد) والتابلت (عمودين) والشاشات الكبيرة (٤-٥ أعمدة).",
          "السمات البصرية: استخدام اللون الأزرق (#0284c7) للوحدات السكنية والبني (#8b643f) للأراضي.",
          "دعم RTL: محاذاة كاملة لليمين مع مراعاة اتجاهات الأيقونات والأسهم.",
          "سرعة الأداء: استخدام ميزة Lazy Loading للصور ومكونات React خفيفة لضمان استجابة سريعة."
        ]
      }
    ];

    sections.forEach(s => {
      text += `## ${s.title}\n`;
      s.items.forEach(item => {
        text += `- ${item}\n`;
      });
      text += "\n";
    });

    return text;
  };

  const handleDownloadFile = () => {
    const text = generateFullSpecText();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'RealEstate_System_Spec.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const text = generateFullSpecText();
    navigator.clipboard.writeText(text);
    alert('تم نسخ المواصفات بصيغة نصية (Markdown)!');
  };

  return (
    <div className="p-4 md:p-8 md:pr-[288px] bg-slate-50 min-h-screen pb-24 text-right" dir="rtl">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-200">
              <ArrowRight size={24} className="text-gray-600" />
            </button>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">الدليل التقني والمواصفات</h2>
              <p className="text-sm font-bold text-gray-400">التفاصيل الفنية الكاملة لبناء النظام (Logic & Data)</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <button 
                onClick={handleCopy}
                className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-700 rounded-2xl font-black text-sm border border-gray-200 hover:bg-gray-50 shadow-sm transition-all"
             >
                <Copy size={20} /> نسخ النص
             </button>
             <button 
                onClick={handleDownloadFile}
                className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black text-sm hover:bg-primary-700 shadow-xl shadow-primary-100 transition-all"
             >
                <Download size={20} /> تحميل ملف Spec (.md)
             </button>
          </div>
        </div>

        <div id="technical-specs-content">
          
          <BulletSection 
            title="١. هيكلية البيانات التفصيلية (Data Structure)" 
            icon={Database} 
            items={[
              "جدول العروض الفردية (Properties Table):\n- id: UUID\n- type: enum('Residential', 'Land')\n- price/totalPrice: number\n- area: number\n- district/city: string\n- notes: text",
              "جدول المشاريع (Projects Table):\n- floors: number\n- unitsPerFloor: number\n- models: array<Model>\n- inventoryMapping: Map<coord, status>",
              "جدول المستخدمين (Users Table):\n- role: Admin | Marketing | Agent\n- permissions: Object tracking CRUD rights",
              "نظام الربط (Linking):\nترتبط العروض المولدة ديناميكياً بالمشروع عبر `projectId` و `modelId` لضمان تحديث السعر والمواصفات لحظياً عند تعديل المشروع الأم."
            ]} 
          />

          <BulletSection 
            title="٢. المنطق التشغيلي (Business Logic)" 
            icon={Zap} 
            items={[
              "التوليد الديناميكي (Dynamic Generation):\nيقوم النظام بمسح كافة الوحدات في كافة المشاريع؛ أي وحدة حالتها 'متاح' يتم تحويل نموذجها إلى بطاقة عقار مستقلة تظهر في صفحة البحث الرئيسية.",
              "تطبيع المدخلات (Normalization):\nيتم معالجة كافة المدخلات الرقمية عبر دالة `parseArabicNumber` لضمان تحويل الأرقام العربية والفارسية إلى أرقام إنجليزية قبل أي عملية حسابية أو تخزين.",
              "محرك البحث الهجين (Hybrid Search):\nالبحث يعمل على مستوى المدن والأحياء والمطورين وأسماء المشاريع في وقت واحد باستخدام `toLowerCase()` و `includes()`.",
              "حماية البيانات:\nيتم عزل بيانات العملاء والمسوقين في جدول الحجوزات، ولا تظهر إلا للمستخدمين برتبة 'Marketing' أو 'Admin'."
            ]} 
          />

          <BulletSection 
            title="٣. واجهة المستخدم والتفاعل (Interaction Design)" 
            icon={Layout} 
            items={[
              "نظام الشبكة المتجاوب (Grid System):\n- Desktop: 4 Columns\n- Tablet: 2 Columns\n- Mobile: 1 Column",
              "الهوية البصرية:\n- السكني: تدرجات الأزرق (#0284c7)\n- الأراضي: تدرجات البني (#8b643f)\n- الحالات: أخضر (جاهز)، أحمر (تحت الإنشاء)، برتقالي (محجوز).",
              "تجربة الاستخدام (UX):\nدعم التمرير السلس (Smooth Scroll)، وتأثيرات Hover على البطاقات، وتأكيد الحذف/الحفظ عبر Modals."
            ]} 
          />

          <BulletSection 
            title="٤. أدوات البيانات والأتمتة (Automation)" 
            icon={FileSpreadsheet} 
            items={[
              "معالج الإكسل (Excel Parser):\nيستخدم مكتبة XLSX لتحويل الملفات المرفوعة إلى مصفوفة بيانات، مع التحقق من صحة الحقول الإلزامية وتوليد معرفات تلقائية.",
              "أتمتة واتساب (WhatsApp Logic):\nزر المشاركة يقوم ببناء رابط `wa.me` يحتوي على رسالة منسقة تشمل اسم العقار، السعر، والموقع الجغرافي.",
              "توليد النماذج:\nيتم توليد ملف إكسل قياسي يحتوي على صفوف عينة لضمان التزام المستخدم بصيغة البيانات المطلوبة."
            ]} 
          />

        </div>

        {/* Footer Support */}
        <div className="mt-12 p-8 bg-gray-900 text-white rounded-[3rem] shadow-2xl flex items-center gap-8 no-print">
           <div className="p-4 bg-white/10 rounded-2xl shrink-0">
              <Code size={40} className="text-primary-400" />
           </div>
           <div>
              <h4 className="text-xl font-black mb-1">دعم المطورين:</h4>
              <p className="text-sm font-bold opacity-70 leading-relaxed">
                هذه الوثيقة تم تكييفها لتكون مرجعاً برمجياً مباشراً. يمكنك استخدام ملف Markdown المحمل لإنشاء مستندات المشروع التقنية.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
