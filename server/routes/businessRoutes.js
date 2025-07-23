import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  createBusiness, 
  getBusinesses,
  deleteBusiness,
  getBusinessById
} from '../controllers/businessController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Setup multer to upload to 'uploads/' with original name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes
router.post('/', auth, upload.single('logo'), createBusiness);
router.get('/', auth, getBusinesses);
router.delete('/:id', auth, deleteBusiness);
router.get('/:id', auth, getBusinessById);

export default router;
