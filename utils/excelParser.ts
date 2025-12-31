import * as XLSX from 'xlsx';
import { Property, PropertyType, Status, UnitType, Finishing, LandUse } from '../types';

export const parseExcel = async (file: File): Promise<Property[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const properties: Property[] = jsonData.map((row: any) => {
          // Determine type based on 'Type' column, default to Residential if unknown
          const typeRaw = row['Type'] || '';
          const isLand = typeRaw === 'Land' || typeRaw.includes('أرض');
          const type = isLand ? PropertyType.Land : PropertyType.Residential;
          
          const prop: Property = {
             id: row['ID'] ? String(row['ID']) : Math.random().toString(36).substr(2, 9),
             type: type,
             city: row['City'] || 'غير محدد',
             district: row['District'] || 'غير محدد',
             developer: row['Developer'] || 'غير محدد',
             price: Number(row['Price']) || Number(row['Total_Price']) || 0,
             createdAt: new Date().toISOString(),
             googleMapUrl: row['Google_Map'],
          };

          if (type === PropertyType.Residential) {
             prop.projectName = row['Project_Name'];
             prop.status = row['Status'] as Status;
             prop.unitType = row['Unit_Type'] as UnitType;
             prop.rooms = row['Rooms'] ? Number(row['Rooms']) : undefined;
             prop.bathrooms = row['Bathrooms'] ? Number(row['Bathrooms']) : undefined;
             prop.area = row['Area'] ? Number(row['Area']) : undefined;
             prop.floor = row['Floor'] ? String(row['Floor']) : undefined;
             prop.finishing = row['Finishing'] as Finishing;
             prop.yearBuilt = row['Year_Built'] ? Number(row['Year_Built']) : undefined;
             prop.notes = row['Notes'];
          } else {
             prop.landArea = row['Land_Area'] ? Number(row['Land_Area']) : undefined;
             prop.pricePerMeter = row['Price_per_Meter'] ? Number(row['Price_per_Meter']) : undefined;
             prop.totalPrice = row['Total_Price'] ? Number(row['Total_Price']) : undefined;
             prop.landWidth = row['Land_Width'] ? Number(row['Land_Width']) : undefined;
             prop.landDepth = row['Land_Depth'] ? Number(row['Land_Depth']) : undefined;
             prop.streetWidth = row['Street_Width'] ? Number(row['Street_Width']) : undefined;
             
             const cornerVal = String(row['Corner']).toLowerCase();
             prop.isCorner = cornerVal === 'yes' || cornerVal === 'true' || cornerVal === '1' || cornerVal === 'نعم';
             
             prop.landUse = row['Land_Use'] as LandUse;
             
             const invVal = String(row['Investment_Allowed']).toLowerCase();
             prop.investmentAllowed = invVal === 'yes' || invVal === 'true' || invVal === '1' || invVal === 'نعم';
             
             prop.landNotes = row['Land_Notes'];
             
             // Ensure price is set if Total_Price exists but Price doesn't
             if (!prop.price && prop.totalPrice) {
                 prop.price = prop.totalPrice;
             }
          }
          return prop;
        });

        resolve(properties);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};