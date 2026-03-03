import React from "react";
import "@/app/auth/auth-styles.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="auth-container min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 relative overflow-hidden flex items-center justify-center p-6">
      {children}
    </div>
  );
};

export default Layout;
