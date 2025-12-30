import multer from 'multer';
import path from 'path';
import type { Request } from 'express';

const storage = multer.diskStorage({
  destination: (_req: Request, file, cb) => {
    // Tentukan folder berdasarkan fieldname
    let folder = 'public/uploads/'; // default
    
    if (file.fieldname === 'image') {
      folder = 'public/books/';
    } else if (file.fieldname === 'profile_picture') {
      folder = 'public/profiles/';
    }
    
    cb(null, folder);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    
    // Tambah prefix berdasarkan fieldname
    let prefix = 'file';
    if (file.fieldname === 'image') {
      prefix = 'book';
    } else if (file.fieldname === 'profile_picture') {
      prefix = 'profile';
    }
    
    cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter
});