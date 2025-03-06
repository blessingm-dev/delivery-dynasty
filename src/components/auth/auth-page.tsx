
import { useState } from "react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">FoodConnect</h1>
        <p className="text-muted-foreground">Multi-vendor food delivery platform</p>
      </div>
      
      <div className="flex flex-col items-center space-y-6 w-full max-w-md">
        {authMode === "login" ? (
          <LoginForm 
            onSuccess={handleSuccess} 
            onRegisterClick={() => setAuthMode("register")} 
          />
        ) : (
          <RegisterForm 
            onSuccess={handleSuccess} 
            onLoginClick={() => setAuthMode("login")} 
          />
        )}
      </div>
    </div>
  );
}
