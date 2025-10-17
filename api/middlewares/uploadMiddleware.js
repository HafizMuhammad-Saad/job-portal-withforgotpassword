const multer = require('multer');


//Configure Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
            console.log('File path:', `uploads/${file.originalname}`);
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File Filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only jpeg, png, jpg and pdf files are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;