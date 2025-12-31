import * as XLSX from 'xlsx';

export const downloadTemplate = () => {
  const headers = [
    'ID', 'Type', 'City', 'District', 'Developer', 'Project_Name', 'Status', 'Price', 'Google_Map',
    'Unit_Type', 'Rooms', 'Bathrooms', 'Area', 'Floor', 'Finishing', 'Year_Built', 'Notes',
    'Land_Area', 'Price_per_Meter', 'Total_Price', 'Land_Width', 'Land_Depth', 'Street_Width', 
    'Corner', 'Land_Use', 'Investment_Allowed', 'Land_Notes'
  ];

  const sampleData = [
    {
      'ID': '101',
      'Type': 'Residential',
      'City': 'الرياض',
      'District': 'الملقا',
      'Developer': 'شركة التطوير',
      'Project_Name': 'برج النخبة',
      'Status': 'جاهز',
      'Price': 1500000,
      'Google_Map': 'https://maps.google.com/?q=24.7136,46.6753',
      'Unit_Type': 'شقة',
      'Rooms': 4,
      'Bathrooms': 3,
      'Area': 200,
      'Floor': '3',
      'Finishing': 'فاخر',
      'Year_Built': 2022,
      'Notes': 'إطلالة بحرية مميزة'
    },
    {
      'ID': '201',
      'Type': 'Land',
      'City': 'جدة',
      'District': 'أبحر',
      'Developer': 'مالك مباشر',
      'Land_Area': 500,
      'Price_per_Meter': 4000,
      'Total_Price': 2000000,
      'Land_Width': 20,
      'Land_Depth': 25,
      'Street_Width': 15,
      'Corner': 'نعم',
      'Land_Use': 'سكني',
      'Investment_Allowed': 'نعم',
      'Land_Notes': 'قريبة من الخدمات'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData, { header: headers });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Properties Template');

  // Generate Excel file and trigger download
  XLSX.writeFile(wb, 'Real_Estate_Template.xlsx');
};