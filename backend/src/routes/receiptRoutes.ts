import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getReceipts,
  getReceipt,
  uploadReceipt,
  processOCR,
  updateReceipt,
  deleteReceipt,
} from '../controllers/receiptController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/receipts/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, PNG) and PDFs are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// All routes require authentication
router.use(protect);

router.route('/').get(getReceipts).post(upload.single('receipt'), uploadReceipt);
router.route('/:id').get(getReceipt).put(updateReceipt).delete(deleteReceipt);
router.post('/:id/process', processOCR);

export default router;
