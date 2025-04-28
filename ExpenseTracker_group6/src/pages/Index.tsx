
import Dashboard from "@/components/Dashboard";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";

const Index = () => {
  const [currency, setCurrency] = useState<string>("$");

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    // Store the selection in localStorage for persistence
    localStorage.setItem("userCurrency", value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center text-white font-bold text-xl mr-3">
              🐝
            </div>
            <h1 className="text-xl font-bold text-gray-900">Money Bee</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-24">
              <Select onValueChange={handleCurrencyChange} defaultValue={currency}>
                <SelectTrigger className="w-full h-8">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$">USD ($)</SelectItem>
                  <SelectItem value="€">EUR (€)</SelectItem>
                  <SelectItem value="£">GBP (£)</SelectItem>
                  <SelectItem value="¥">JPY (¥)</SelectItem>
                  <SelectItem value="₹">INR (₹)</SelectItem>
                  <SelectItem value="¥">CNY (¥)</SelectItem>
                  <SelectItem value="₩">KRW (₩)</SelectItem>
                  <SelectItem value="$">CAD ($)</SelectItem>
                  <SelectItem value="$">AUD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Link to="/account" className="text-sm text-amber-600 hover:text-amber-800">Accounts</Link>
            <a href="/auth" className="text-sm text-amber-600 hover:text-amber-800">Login / Register</a>
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              J
            </div>
          </div>
        </div>
      </header>
      
      <main>
        <Dashboard currency={currency} />
      </main>
    </div>
  );
};

export default Index;
