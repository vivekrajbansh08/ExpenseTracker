import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

// Export transactions to CSV
export const exportToCSV = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const query: any = { user: req.userId };

    if (startDate && endDate) {
      console.log('Export CSV Request:', { startDate, endDate });
      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);
      
      query.date = {
        $gte: new Date(startDate as string),
        $lte: end,
      };
      console.log('Export CSV Query:', JSON.stringify(query));
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .lean();

    // Format transactions for CSV
    const formattedTransactions = transactions.map((t) => ({
      Date: new Date(t.date).toLocaleDateString(),
      Type: t.type,
      Category: t.category,
      Amount: t.amount,
      Description: t.description || '',
    }));

    const fields = ['Date', 'Type', 'Category', 'Amount', 'Description'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(formattedTransactions);

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csv);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to export to CSV',
      error: error.message,
    });
  }
};

// Export transactions to PDF
export const exportToPDF = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const query: any = { user: req.userId };

    if (startDate && endDate) {
      console.log('Export PDF Request:', { startDate, endDate });
      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);

      query.date = {
        $gte: new Date(startDate as string),
        $lte: end,
      };
      console.log('Export PDF Query:', JSON.stringify(query));
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .lean();

    // Calculate summary
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    res.header('Content-Type', 'application/pdf');
    res.header('Content-Disposition', 'attachment; filename=transactions.pdf');

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Expense Tracker Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown();

    if (startDate && endDate) {
      doc.text(
        `Period: ${new Date(startDate as string).toLocaleDateString()} - ${new Date(endDate as string).toLocaleDateString()}`,
        { align: 'center' }
      );
      doc.moveDown();
    }

    // Summary
    doc.fontSize(14).text('Summary', { underline: true });
    doc.fontSize(12);
    doc.moveDown(0.5);
    doc.text(`Total Income: ₹${totalIncome.toFixed(2)}`);
    doc.text(`Total Expenses: ₹${totalExpenses.toFixed(2)}`);
    doc.text(`Net Balance: ₹${(totalIncome - totalExpenses).toFixed(2)}`);
    doc.text(`Total Transactions: ${transactions.length}`);
    doc.moveDown();

    // Transactions table
    doc.fontSize(14).text('Transactions', { underline: true });
    doc.fontSize(10);
    doc.moveDown(0.5);

    // Table header
    const tableTop = doc.y;
    const dateX = 50;
    const typeX = 120;
    const categoryX = 180;
    const amountX = 280;
    const descriptionX = 360;

    doc.font('Helvetica-Bold');
    doc.text('Date', dateX, tableTop);
    doc.text('Type', typeX, tableTop);
    doc.text('Category', categoryX, tableTop);
    doc.text('Amount', amountX, tableTop);
    doc.text('Description', descriptionX, tableTop);

    doc.font('Helvetica');
    let y = tableTop + 20;

    transactions.slice(0, 30).forEach((transaction) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc.text(new Date(transaction.date).toLocaleDateString(), dateX, y);
      doc.text(transaction.type, typeX, y);
      doc.text(transaction.category, categoryX, y);
      doc.text(`₹${transaction.amount.toFixed(2)}`, amountX, y);
      doc.text((transaction.description || '').substring(0, 20), descriptionX, y);

      y += 20;
    });

    if (transactions.length > 30) {
      doc.moveDown();
      doc.text(`... and ${transactions.length - 30} more transactions`, { align: 'center' });
    }

    doc.end();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to export to PDF',
      error: error.message,
    });
  }
};
