import { Request, Response } from 'express';
import Receipt from '../models/Receipt';
import path from 'path';
import fs from 'fs';

// Get all receipts for a user
export const getReceipts = async (req: Request, res: Response) => {
  try {
    const receipts = await Receipt.find({ userId: req.user!._id })
      .populate('transactionId')
      .sort({ uploadDate: -1 });

    res.status(200).json({
      success: true,
      data: receipts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch receipts',
      error: error.message,
    });
  }
};

// Get a single receipt
export const getReceipt = async (req: Request, res: Response) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    }).populate('transactionId');

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found',
      });
    }

    res.status(200).json({
      success: true,
      data: receipt,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch receipt',
      error: error.message,
    });
  }
};

// Upload a receipt
export const uploadReceipt = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const { transactionId, merchant, notes } = req.body;

    const receipt = await Receipt.create({
      userId: req.user!._id,
      transactionId: transactionId || null,
      imageUrl: `/uploads/receipts/${req.file.filename}`,
      merchant,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Receipt uploaded successfully',
      data: receipt,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload receipt',
      error: error.message,
    });
  }
};

// Process OCR on receipt
export const processOCR = async (req: Request, res: Response) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found',
      });
    }

    // TODO: Implement actual OCR processing
    // This is a placeholder for Google Vision API, AWS Textract, or Tesseract
    // For now, we'll just mark it as processed
    
    /*
    Example integration with Google Vision API:
    
    const vision = require('@google-cloud/vision');
    const client = new vision.ImageAnnotatorClient();
    
    const [result] = await client.textDetection(receipt.imageUrl);
    const detections = result.textAnnotations;
    const extractedText = detections[0]?.description || '';
    
    // Parse extracted text to find amount, date, merchant, etc.
    // This requires custom parsing logic based on your receipt format
    */

    receipt.ocrData = {
      extractedText: 'OCR processing not yet configured. Please add your API credentials.',
      confidence: 0,
      processedAt: new Date(),
    };
    receipt.isProcessed = true;

    await receipt.save();

    res.status(200).json({
      success: true,
      message: 'OCR processing completed (placeholder)',
      data: receipt,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to process OCR',
      error: error.message,
    });
  }
};

// Update receipt
export const updateReceipt = async (req: Request, res: Response) => {
  try {
    const { merchant, notes, transactionId } = req.body;

    const receipt = await Receipt.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { merchant, notes, transactionId },
      { new: true, runValidators: true }
    );

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Receipt updated successfully',
      data: receipt,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update receipt',
      error: error.message,
    });
  }
};

// Delete receipt
export const deleteReceipt = async (req: Request, res: Response) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found',
      });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../../', receipt.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await receipt.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Receipt deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete receipt',
      error: error.message,
    });
  }
};
