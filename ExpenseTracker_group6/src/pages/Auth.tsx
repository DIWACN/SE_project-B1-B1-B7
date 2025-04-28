
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call 
    setTimeout(() => {
      // For demo, any login is successful
      toast({
        title: "Login Successful",
        description: "Welcome back to Pocket Finance!",
      });
      navigate("/");
      setIsLoading(false);
    }, 1500);
  };

  const handleRegister = (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call 
    setTimeout(() => {
      // For demo, any registration is successful
      toast({
        title: "Registration Successful",
        description: "Your account has been created!",
      });
      navigate("/");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-purple-50">
      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl mb-4">
            P
          </div>
          <h1 className="text-2xl font-bold text-center">Pocket Finance</h1>
          <p className="text-gray-500 text-center mt-2">Smart personal finance tracker</p>
        </div>
        
        <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
      </div>
    </div>
  );
};

export default Auth;
