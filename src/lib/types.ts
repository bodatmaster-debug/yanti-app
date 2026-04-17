
export type LetterType = 'Masuk' | 'Keluar' | 'Berita acara';

export interface Letter {
  id: string;
  refNumber: string;
  sender: string;
  recipient: string;
  subject: string;
  date: string;
  type: LetterType;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
  updatedAt: string;
}

export type LetterFormData = Omit<Letter, 'id' | 'createdAt' | 'updatedAt'>;
