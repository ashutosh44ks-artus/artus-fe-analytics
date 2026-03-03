import React from "react";

const AuthHeader = ({ children }: { children: string }) => {
  return (
    <h1 className="text-4xl font-bold bg-linear-to-r from-white via-primary-500 to-white bg-clip-text text-transparent fill-mode-both">
      {children}
    </h1>
  );
};

export default AuthHeader;
