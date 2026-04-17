
import ExcelJS from 'exceljs';
import type { Letter } from '@/lib/types';
import { format } from 'date-fns';

export const exportLettersToExcel = async (letters: Letter[], options?: { month?: string, year?: string }) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Arsip Surat');

  // 1. Tambah Logo
  try {
    const response = await fetch('/logo.jpg');
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const logoId = workbook.addImage({
        buffer: arrayBuffer,
        extension: 'jpeg',
      });
      worksheet.addImage(logoId, {
        tl: { col: 0, row: 0 },
        ext: { width: 80, height: 80 }
      });
    }
  } catch (e) {
    console.warn('Logo tidak dapat dimuat');
  }

  // 2. Judul Laporan (Kop Surat)
  worksheet.mergeCells('B2:G2');
  const titleCell = worksheet.getCell('B2');
  titleCell.value = 'Agenda surat masuk dan keluar';
  titleCell.font = { name: 'Arial', size: 14, bold: true };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  worksheet.mergeCells('B3:G3');
  const subTitleCell1 = worksheet.getCell('B3');
  subTitleCell1.value = 'USAHA DAGANG PETANI MARSAOR';
  subTitleCell1.font = { name: 'Arial', size: 12, bold: true };
  subTitleCell1.alignment = { vertical: 'middle', horizontal: 'center' };

  worksheet.mergeCells('B4:G4');
  const subTitleCell2 = worksheet.getCell('B4');
  subTitleCell2.value = 'Jl. T. D. Pardede, Simamora Tarutung';
  subTitleCell2.font = { name: 'Arial', size: 10, bold: false };
  subTitleCell2.alignment = { vertical: 'middle', horizontal: 'center' };

  worksheet.mergeCells('B5:G5');
  const subTitleCell3 = worksheet.getCell('B5');
  subTitleCell3.value = 'Kabupaten Tapanuli Utara';
  subTitleCell3.font = { name: 'Arial', size: 10, bold: false };
  subTitleCell3.alignment = { vertical: 'middle', horizontal: 'center' };

  // 3. Definisi Header (Tanpa No. Agenda)
  const headers = [
    'No. Surat',
    'Jenis',
    'Pengirim',
    'Penerima',
    'Hal',
    'Tanggal Surat',
    'Tanggal Input'
  ];

  const headerRowIndex = 7;
  const headerRow = worksheet.getRow(headerRowIndex);
  headerRow.values = headers;

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' },
    };
    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 10 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Atur lebar kolom
  const columnWidths = [25, 12, 25, 25, 15, 18, 18];
  columnWidths.forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });

  // 4. Masukkan Data
  letters.forEach((letter) => {
    const rowValues = [
      letter.refNumber,
      letter.type,
      letter.sender,
      letter.recipient,
      letter.subject, // Hal
      format(new Date(letter.date), 'dd/MM/yyyy'),
      format(new Date(letter.createdAt), 'dd/MM/yyyy HH:mm'),
    ];
    
    const row = worksheet.addRow(rowValues);

    row.eachCell((cell) => {
      cell.font = { size: 10 };
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  // 5. Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = `arsip_marsaor_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
