
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick login buttons for demo purposes
  const quickLogin = async (role: string) => {
    setIsLoading(true);
    let email = "";
    
    switch (role) {
      case "admin":
        email = "admin@example.com";
        break;
      case "contributor":
        email = "contributor@example.com";
        break;
      case "user":
        email = "user@example.com";
        break;
      default:
        email = "user@example.com";
    }
    
    try {
      const success = await login(email, "password");
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-dark-300 rounded-lg overflow-hidden shadow-lg">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Log In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-dark-200 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-dark-200 border-gray-700 text-white"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-gray-400 mb-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </p>
          </div>
          
          {/* Quick login options for demo purposes */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-sm font-medium text-gray-400 mb-4 text-center">
              Demo Quick Login
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                onClick={() => quickLogin("admin")} 
                className="text-xs"
                disabled={isLoading}
              >
                Admin
              </Button>
              <Button 
                variant="outline" 
                onClick={() => quickLogin("contributor")} 
                className="text-xs"
                disabled={isLoading}
              >
                Contributor
              </Button>
              <Button 
                variant="outline" 
                onClick={() => quickLogin("user")} 
                className="text-xs"
                disabled={isLoading}
              >
                User
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              (Password: "password")
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
