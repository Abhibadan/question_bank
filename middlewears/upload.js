const multer = require('multer');
const fs= require('fs');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path=`./public/uploads/${file.fieldname}`
        // Create directory if it doesn't exist
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }  
        cb(null, path); 
    },
    filename: (req, file, cb) => {
        if(![undefined,null,''].includes(req.user.profilePicture)){
            cb(null, path.basename(req.user.profilePicture));
        }else{
            cb(null, `${Date.now()}-${req.user.name}${path.extname(file.originalname)}`);
        }
    },
});

// File filter for allowed types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jfif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and JFIF are allowed.'));
    }
};

// Limit file size to 2MB
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

module.exports = upload;
