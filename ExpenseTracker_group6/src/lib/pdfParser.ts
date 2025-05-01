
import { jsPDF } from 'jspdf';
import { Transaction, Category } from '@/types';
import { categorizeTransaction, MOCK_USER_ID } from './mockData';

/**
 * Mock PDF parser demonstration
 * 
 * Note: In a real implementation, this would use a PDF parsing library
 * like pdf.js or a backend service with pdfbox/iText
 */
export const parsePDFStatement = async (file: File): Promise<Transaction[]> => {
  try {
    // This is a mock implementation for demo purposes
    // In a real app, we would extract text and parse structured data from the PDF
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate random transactions to simulate PDF parsing
    const numberOfTransactions = Math.floor(Math.random() * 8) + 3; // 3-10 transactions
    const transactions: Transaction[] = [];
    
    // Sample transaction descriptions that might appear in a bank statement
    const sampleDescriptions = [
      'GROCERY STORE PURCHASE',
      'ATM WITHDRAWAL',
      'RESTAURANT PAYMENT',
      'ONLINE SHOPPING',
      'UTILITY BILL PAYMENT',
      'MOBILE RECHARGE',
      'SALARY DEPOSIT',
      'SUBSCRIPTION RENEWAL',
      'TRANSPORT FARE',
      'MEDICAL PAYMENT'
    ];
    
    // Random date in the last 30 days
    const getRandomDate = () => {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      return date.toISOString();
    };
    
    // Generate random transactions
    for (let i = 0; i < numberOfTransactions; i++) {
      const description = sampleDescriptions[Math.floor(Math.random() * sampleDescriptions.length)];
      const isIncome = description.includes('SALARY') || Math.random() > 0.8;
      const amount = isIncome 
        ? Math.floor(Math.random() * 2000) + 1000 
        : -(Math.floor(Math.random() * 200) + 10);
      
      const category = categorizeTransaction(description);
      
      transactions.push({
        id: `pdf-${i}`,
        date: getRandomDate(),
        description,
        amount,
        category,
        paymentMethod: Math.random() > 0.5 ? 'Credit Card' : 'Bank Transfer',
        userId: MOCK_USER_ID
      });
    }
    
    // Sort by date, most recent first
    return transactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF statement');
  }
};

/**
 * Generate a sample PDF bank statement (for demo purposes)
 */
export const generateSampleBankStatement = () => {
  const doc = new jsPDF();
  
  // Add headers
  doc.setFontSize(20);
  doc.text('Sample Bank Statement', 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Account Number: XXXX-XXXX-XXXX-1234', 20, 30);
  doc.text('Statement Period: 01/03/2024 - 31/03/2024', 20, 40);
  
  // Add table headers
  doc.setFontSize(10);
  doc.text('Date', 20, 60);
  doc.text('Description', 50, 60);
  doc.text('Amount', 150, 60);
  doc.text('Balance', 180, 60);
  
  // Add line
  doc.line(20, 65, 190, 65);
  
  // Add some sample transactions
  const transactions = [
    { date: '01/03/2024', desc: 'Opening Balance', amount: '', balance: '1,524.62' },
    { date: '03/03/2024', desc: 'GROCERY STORE PURCHASE', amount: '-78.45', balance: '1,446.17' },
    { date: '05/03/2024', desc: 'COFFEE SHOP', amount: '-4.50', balance: '1,441.67' },
    { date: '10/03/2024', desc: 'SALARY DEPOSIT', amount: '+3,200.00', balance: '4,641.67' },
    { date: '12/03/2024', desc: 'RENT PAYMENT', amount: '-1,200.00', balance: '3,441.67' },
    { date: '15/03/2024', desc: 'UTILITY BILL', amount: '-85.20', balance: '3,356.47' },
    { date: '18/03/2024', desc: 'RESTAURANT PAYMENT', amount: '-45.75', balance: '3,310.72' },
    { date: '22/03/2024', desc: 'TRANSPORT FARE', amount: '-12.99', balance: '3,297.73' },
    { date: '25/03/2024', desc: 'ONLINE SHOPPING', amount: '-129.99', balance: '3,167.74' },
    { date: '29/03/2024', desc: 'MOBILE RECHARGE', amount: '-20.00', balance: '3,147.74' },
    { date: '31/03/2024', desc: 'Closing Balance', amount: '', balance: '3,147.74' },
  ];
  
  let y = 75;
  transactions.forEach(t => {
    doc.text(t.date, 20, y);
    doc.text(t.desc, 50, y);
    doc.text(t.amount, 150, y, { align: 'right' });
    doc.text(t.balance, 180, y, { align: 'right' });
    y += 10;
  });
  
  // Save the PDF
  return doc.output('blob');
};
