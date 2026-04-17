
import ExcelJS from 'exceljs';
import type { Letter } from '@/lib/types';

export const exportLettersToExcel = async (letters: Letter[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Arsip Surat');

  worksheet.columns = [
    { header: 'No. Agenda', key: 'id', width: 10 },
    { header: 'No. Surat', key: 'refNumber', width: 25 },
    { header: 'Jenis', key: 'type', width: 15 },
    { header: 'Pengirim', key: 'sender', width: 25 },
    { header: 'Penerima', key: 'recipient', width: 25 },
    { header: 'Perihal', key: 'subject', width: 40 },
    { header: 'Tanggal Surat', key: 'date', width: 15 },
    { header: 'Tgl Input', key: 'createdAt', width: 15 },
  ];

  letters.forEach((letter) => {
    worksheet.addRow({
      ...letter,
      createdAt: new Date(letter.createdAt).toLocaleDateString('id-ID'),
      date: new Date(letter.date).toLocaleDateString('id-ID'),
    });
  });

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `arsip_surat_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
};
