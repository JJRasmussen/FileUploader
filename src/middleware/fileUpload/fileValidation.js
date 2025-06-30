import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs';

const allowedFileTypes = [
  'image/png', 
  'image/jpeg',
  'application/pdf'
];

//Deleting written file if filetype is wrong.
const deleteFile = (filePath) => {
    fs.unlinkSync(filePath);
}

const fileValidation = async (req, res, next) => {
    try{
        const filePath = req.file.path;
        const mimeFromClient = req.file.mimetype;
        //Check mime type
        if (!allowedFileTypes.includes(mimeFromClient)) {
            deleteFile(filePath);
            return res.status(400).json({ error: 'Wrong file type. Allowed file types are png, jpg, jpeg and pdf.'})
        };
        
        const buffer = fs.readFileSync(filePath);
        const fileType = await fileTypeFromBuffer(buffer);
        const mimeFromBuffer = fileType.mime;

        if (!fileType){
            deleteFile(filePath);
            return res.status(400).json({ error: 'Could not determine file type' });
        };
        
        if (mimeFromBuffer !== mimeFromClient){
            deleteFile(filePath);
            return res.status(400).json({
                error: `MIME type mismatch: claimed ${mimeFromClient}, actual ${mimeFromBuffer}`
            });
        };
        next();
    } catch (err) {
        console.error(err);
        deleteFile(filePath);
        res.status(500).json({ error: 'Internal server error during file validation' });
    };
};

export default fileValidation;