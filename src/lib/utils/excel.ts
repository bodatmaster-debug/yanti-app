
import ExcelJS from 'exceljs';
import type { Letter } from '@/lib/types';
import { format } from 'date-fns';

export const exportLettersToExcel = async (letters: Letter[], options?: { month?: string, year?: string }) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Arsip Surat');

  // 1. Tambah Logo di Pojok Kiri Atas (Kolom A)
  try {
    const response = await fetch('/logo.jpg');
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const logoId = workbook.addImage({
        buffer: arrayBuffer,
        extension: 'jpeg',
      });
      // Menempatkan logo di sel A1 sampai A5
      worksheet.addImage(logoId, {
        tl: { col: 0, row: 0 },
        ext: { width: 90, height: 90 }
      });
    }
  } catch (e) {
    console.warn('Logo tidak dapat dimuat');
  }

  // 2. Judul Laporan & Kop Surat (Merge B sampai G karena A dipakai Logo)
  // Baris 2: Judul Utama
  worksheet.mergeCells('B2:G2');
  const titleCell = worksheet.getCell('B2');
  titleCell.value = 'Agenda surat masuk dan keluar';
  titleCell.font = { name: 'Arial', size: 14, bold: true };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Baris 3: Nama Instansi
  worksheet.mergeCells('B3:G3');
  const instansiCell = worksheet.getCell('B3');
  instansiCell.value = 'USAHA DAGANG PETANI MARSAOR';
  instansiCell.font = { name: 'Arial', size: 12, bold: true };
  instansiCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Baris 4: Alamat 1
  worksheet.mergeCells('B4:G4');
  const addr1Cell = worksheet.getCell('B4');
  addr1Cell.value = 'Jl. T. D. Pardede, Simamora Tarutung';
  addr1Cell.font = { name: 'Arial', size: 10, bold: false };
  addr1Cell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Baris 5: Alamat 2
  worksheet.mergeCells('B5:G5');
  const addr2Cell = worksheet.getCell('B5');
  addr2Cell.value = 'Kabupaten Tapanuli Utara';
  addr2Cell.font = { name: 'Arial', size: 10, bold: false };
  addr2Cell.alignment = { vertical: 'middle', horizontal: 'center' };

  // 3. Header Tabel (Dimulai di baris 7)
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

  // Styling Header
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

  // Atur lebar kolom (7 kolom: A sampai G)
  worksheet.getColumn(1).width = 25; // No. Surat
  worksheet.getColumn(2).width = 15; // Jenis
  worksheet.getColumn(3).width = 25; // Pengirim
  worksheet.getColumn(4).width = 25; // Penerima
  worksheet.getColumn(5).width = 20; // Hal
  worksheet.getColumn(6).width = 18; // Tanggal Surat
  worksheet.getColumn(7).width = 18; // Tanggal Input

  // 4. Masukkan Data (Mulai Baris 8)
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

  // 5. Eksekusi Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const periodStr = options ? `_${options.month}_${options.year}` : `_all_${new Date().toISOString().split('T')[0]}`;
  const filename = `arsip_marsaor${periodStr}.xlsx`;
  
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
