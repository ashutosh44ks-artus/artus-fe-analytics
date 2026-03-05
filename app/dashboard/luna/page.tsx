"use client";

import { useUserStore } from "@/lib/store/userStore";

export default function LunaPage() {
  const userName = useUserStore((state) => state.userName);
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Luna Dashboard</h1>
      {userName && (
        <p className="mt-4 text-lg">
          Welcome, {userName}!
        </p>
      )}
    </div>
  );
}
