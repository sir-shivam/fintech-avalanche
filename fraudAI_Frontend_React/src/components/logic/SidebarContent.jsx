import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

import {
  Home,
  Send,
  History,
  FileText,
  Users,
  Settings,
  HelpCircle as Help,
  CreditCard,
  Search,
  PackageX,
  LogOut,
} from "lucide-react";
import { useUser } from "@/context/user";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export default function SidebarContent() {
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Send, label: "Send Money", path: "/send-money" },
    { icon: History, label: "Transactions", path: "/transactions" },
    { icon: FileText, label: "Statements", path: "/statements" },
    { icon: Help, label: "Complaints History", path: "/complaints-history" },
    { icon: PackageX, label: "Complain", path: "/complaint" },
  ];
  const { user, upiId, setUser, setUpiId } = useUser();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUpiId("");
      navigate("/auth");
    } catch (error) {
      console.error("Sign-Out Error:", error);
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="flex items-center mb-8">
          <CreditCard className="h-8 w-8 text-blue-400" />
          <span className="ml-2 text-xl font-bold text-blue-400">SafeUPI</span>
        </div>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
          <Input
            type="text"
            placeholder="Quick search..."
            className="pl-9 w-full bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:bg-white/10"
          />
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link to={item.path} key={item.label}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-white/10">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 "
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );
}
