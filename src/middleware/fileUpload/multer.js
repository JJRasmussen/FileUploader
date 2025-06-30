import multer from 'multer';
import path from 'path';
import fs from 'fs';

//create a userFolder if it is missing
const createUserFolder = (username) => {
    const uploadPath = path.join('uploads', username);
    if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath);
    }
    return uploadPath
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = createUserFolder(req.user.username)
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname + '-' + uniqueSuffix)
  }
})

const upload = multer({ 
  storage: storage,
  //setup error message for file size
  limits: {
    fileSize: 5*1024 * 1024, //5MB
  },
  //setup file name restrictions
    //name size
    //name regex
});

export default upload;