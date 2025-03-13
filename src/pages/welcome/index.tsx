
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { motion } from "framer-motion";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-primary mb-8">Welcome to Kenkom</h1>
        
        <p className="text-xl text-slate-600 mb-12 max-w-lg mx-auto">
          Your complete solution for managing treatments, inventory, and financial operations.
        </p>
        
        <Button 
          onClick={handleLoginClick}
          size="lg"
          className="px-8 py-6 text-lg flex items-center justify-center gap-2"
        >
          <LogIn className="h-5 w-5 mr-2" />
          Sign In
        </Button>
      </motion.div>
      
      <div className="absolute bottom-8 text-sm text-slate-500">
        © {new Date().getFullYear()} Kenkom. All rights reserved.
      </div>
    </div>
  );
};

export default WelcomePage;
