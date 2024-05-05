const multer=require('multer')

const storage = multer.diskStorage({
    destination: 'uploads/', 
    filename: (_req, file, cb) => {
      cb(null, file.originalname); 
    }
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } 
  });
  
module.exports=upload;