
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { parsePDFStatement, generateSampleBankStatement } from '@/lib/pdfParser';
import { Transaction } from '@/types';
import { FileText, Upload, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface PDFUploaderProps {
  onTransactionsImported: (transactions: Transaction[]) => void;
}

const PDFUploader = ({ onTransactionsImported }: PDFUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);

    try {
      // Process the PDF file
      const transactions = await parsePDFStatement(file);
      
      // Show success toast
      toast({
        title: "PDF Successfully Processed",
        description: `Extracted ${transactions.length} transactions from your statement.`,
      });
      
      // Pass transactions to parent component
      onTransactionsImported(transactions);
    } catch (error) {
      // Show error toast
      toast({
        title: "Error Processing PDF",
        description: "There was a problem processing your bank statement.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSample = () => {
    const pdfBlob = generateSampleBankStatement();
    const url = URL.createObjectURL(pdfBlob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_bank_statement.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL object
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="mb-6 p-4 bg-purple-100 rounded-full">
            <FileText className="h-8 w-8 text-purple-700" />
          </div>
          
          <h3 className="text-lg font-medium mb-2">Import Bank Statement</h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            Upload your PDF bank statement to automatically extract transactions
          </p>
          
          <div className="w-full mt-2">
            <div className="relative">
              <Input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                disabled={isLoading}
              />
              <Button
                variant="outline"
                className="w-full flex items-center justify-center border-dashed"
                disabled={isLoading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {fileName ? fileName : "Choose PDF file"}
              </Button>
            </div>
          </div>
          
          {isLoading && (
            <div className="mt-4 text-sm text-gray-500">
              Processing statement...
            </div>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Don't have a statement?</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleGenerateSample}
              className="text-purple-700"
            >
              <Download className="h-4 w-4 mr-1" />
              Download Sample PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFUploader;
