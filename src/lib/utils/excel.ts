import ExcelJS from 'exceljs';
import type { Letter } from '@/lib/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const exportLettersToExcel = async (letters: Letter[], options?: { month?: string, year?: string }) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Arsip Surat');

  // 1. Tambah Logo dari /logo.jpg
  try {
    const response = await fetch('/logo.jpg');
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const logoId = workbook.addImage({
        buffer: arrayBuffer,
        extension: 'jpeg',
      });
      // Posisi logo di pojok kiri atas (baris 0-4)
      worksheet.addImage(logoId, {
        tl: { col: 0, row: 0 },
        ext: { width: 80, height: 80 }
      });
    }
  } catch (e) {
    console.warn('Logo instansi tidak dapat dimuat ke excel');
  }

  // 2. Judul Laporan (Kop Surat)
  worksheet.mergeCells('B2:H2');
  const titleCell = worksheet.getCell('B2');
  titleCell.value = 'Pengarsipan Yanti';
  titleCell.font = { name: 'Arial', size: 16, bold: true };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  worksheet.mergeCells('B3:H3');
  const subTitleCell = worksheet.getCell('B3');
  const reportType = options?.month 
    ? `Laporan Bulanan: ${format(new Date(`${options.year}-${options.month}-01`), 'MMMM yyyy', { locale: id })}` 
    : 'Laporan Seluruh Arsip Digital';
  subTitleCell.value = reportType;
  subTitleCell.font = { name: 'Arial', size: 11, bold: false };
  subTitleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Beri jarak agar tabel tidak mepet ke logo (header tabel di baris 7)
  // Tidak perlu addRow manual bertubi-tubi, kita langsung set header di row 7

  // 3. Definisi Header
  const headers = [
    'No. Agenda',
    'No. Surat',
    'Jenis',
    'Pengirim',
    'Penerima',
    'Perihal / Hal',
    'Tanggal Surat',
    'Tanggal Input'
  ];

  const headerRowIndex = 7;
  const headerRow = worksheet.getRow(headerRowIndex);
  headerRow.values = headers;

  // Style Header Tabel
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' }, // Slate-800
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

  // Atur lebar kolom secara manual
  const columnWidths = [12, 25, 12, 25, 25, 45, 18, 18];
  columnWidths.forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });

  // 4. Masukkan Data menggunakan Array (agar tidak tersesat)
  letters.forEach((letter) => {
    const rowValues = [
      letter.id,
      letter.refNumber,
      letter.type,
      letter.sender,
      letter.recipient,
      letter.subject,
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

  // 5. Generate dan Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = options?.month 
    ? `arsip_yanti_${options.year}_${options.month}.xlsx` 
    : `arsip_yanti_lengkap_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
