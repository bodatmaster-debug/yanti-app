import ExcelJS from 'exceljs';
import type { Letter } from '@/lib/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const exportLettersToExcel = async (letters: Letter[], options?: { month?: string, year?: string }) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Arsip Surat');

  // 1. Tambah Logo jika ada
  try {
    const response = await fetch('/logo.jpg');
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const logoId = workbook.addImage({
        buffer: arrayBuffer,
        extension: 'jpeg',
      });
      // Posisi logo di pojok kiri atas
      worksheet.addImage(logoId, {
        tl: { col: 0.1, row: 0.1 },
        ext: { width: 65, height: 65 }
      });
    }
  } catch (e) {
    console.warn('Logo instansi tidak dapat dimuat ke Excel');
  }

  // 2. Judul Laporan (Kop Surat)
  // Merge baris 1-3 untuk memberikan ruang yang cukup bagi logo di sampingnya
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

  // Beri jarak (baris kosong) agar tabel tidak mepet ke logo
  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow([]);

  // 3. Definisi Kolom
  const headers = [
    { header: 'No. Agenda', key: 'id', width: 15 },
    { header: 'No. Surat', key: 'refNumber', width: 25 },
    { header: 'Jenis', key: 'type', width: 12 },
    { header: 'Pengirim', key: 'sender', width: 25 },
    { header: 'Penerima', key: 'recipient', width: 25 },
    { header: 'Perihal / Hal', key: 'subject', width: 45 },
    { header: 'Tanggal Surat', key: 'date', width: 18 },
    { header: 'Tanggal Input', key: 'createdAt', width: 18 },
  ];

  // Set baris ke-7 sebagai baris header tabel
  const headerRowIndex = 7;
  const headerRow = worksheet.getRow(headerRowIndex);
  headerRow.values = headers.map(h => h.header);

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

  // Atur lebar kolom secara manual agar presisi
  headers.forEach((h, index) => {
    worksheet.getColumn(index + 1).width = h.width;
  });

  // 4. Masukkan Data
  letters.forEach((letter) => {
    const row = worksheet.addRow({
      id: letter.id,
      refNumber: letter.refNumber,
      type: letter.type,
      sender: letter.sender,
      recipient: letter.recipient,
      subject: letter.subject,
      date: format(new Date(letter.date), 'dd/MM/yyyy'),
      createdAt: format(new Date(letter.createdAt), 'dd/MM/yyyy HH:mm'),
    });

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
