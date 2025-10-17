const express = require('express');
const { register, login, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get('/me', protect, getMe);

router.post("/upload-image", upload.single("image"), (req, res) => {
    console.log('Image URL:', `uploads/${req.file.filename}`);
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });

        }

        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error uploading image" });

    }
});

module.exports = router;