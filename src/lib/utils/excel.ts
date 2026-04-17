
import ExcelJS from 'exceljs';
import type { Letter } from '@/lib/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const exportLettersToExcel = async (letters: Letter[], options?: { month?: string, year?: string }) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Arsip Surat');

  // 1. Add Header / Kop Surat
  worksheet.mergeCells('A1:H1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'SISTEM MANAJEMEN ARSIP DIGITAL - SURAT DIGITAL';
  titleCell.font = { name: 'Arial', size: 14, bold: true };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  worksheet.mergeCells('A2:H2');
  const subTitleCell = worksheet.getCell('A2');
  const reportType = options?.month ? `Laporan Bulanan: ${format(new Date(`${options.year}-${options.month}-01`), 'MMMM yyyy', { locale: id })}` : 'Laporan Seluruh Arsip';
  subTitleCell.value = reportType;
  subTitleCell.font = { name: 'Arial', size: 12, bold: false };
  subTitleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  worksheet.addRow([]); // Spacer

  // 2. Define Columns
  const headers = [
    { header: 'No. Agenda', key: 'id', width: 12 },
    { header: 'No. Surat', key: 'refNumber', width: 25 },
    { header: 'Jenis', key: 'type', width: 12 },
    { header: 'Pengirim', key: 'sender', width: 25 },
    { header: 'Penerima', key: 'recipient', width: 25 },
    { header: 'Perihal / Subjek', key: 'subject', width: 45 },
    { header: 'Tanggal Surat', key: 'date', width: 18 },
    { header: 'Tanggal Input', key: 'createdAt', width: 18 },
  ];

  worksheet.columns = headers;

  // 3. Style Table Header (Row 4)
  const headerRow = worksheet.getRow(4);
  headerRow.values = headers.map(h => h.header);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E2021' }, // Dark Slate from theme
    };
    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // 4. Add Data Rows
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
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  // 5. Try to add Logo if exists
  try {
    const response = await fetch('/logo.jpg');
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const logoId = workbook.addImage({
        buffer: arrayBuffer,
        extension: 'jpeg',
      });
      // Position logo on top left (floating)
      // worksheet.addImage(logoId, 'A1:B2'); 
    }
  } catch (e) {
    console.log('Logo not found or could not be loaded');
  }

  // 6. Generate and Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = options?.month 
    ? `arsip_surat_${options.year}_${options.month}.xlsx` 
    : `arsip_surat_lengkap_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
