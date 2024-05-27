import multer from 'multer'
import  path from 'path';
import {v4 as uuidv4} from 'uuid'

// const storage = multer.diskStorage({
//     destination: 'uploads/', 
//     filename: (_req, file, cb) => {
//       cb(null, file.originalname); 
//     }
//   });

//   const upload = multer({
//     storage: storage,
//     limits: { fileSize: 50 * 1024 * 1024 } 
//   });
  
const imageVideoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isImageOrVideo = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
    if (isImageOrVideo) {
      cb(null, 'uploads/');
    } else {
      cb({ message: 'Unsupported file type for this destination' }, false);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isPDForXLSX = file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (isPDForXLSX) {
      cb(null, 'pdf/');
    } else {
      cb({ message: 'Unsupported file type for this destination' }, false);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Create Multer instance with custom storage logic
export const uploadImageVideo = multer({
  storage: imageVideoStorage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB limit
});

export const uploadDocument = multer({
  storage: documentStorage, 
});
