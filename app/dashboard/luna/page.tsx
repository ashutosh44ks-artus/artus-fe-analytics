"use client";

import { useUserStore } from "@/lib/store/userStore";
import ChatContainer from "./components/ChatContainer";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import ChatOptions from "./components/ChatOptions";

export default function LunaPage() {
  const userName = useUserStore((state) => state.userName);

  return (
    <div className="min-h-0 flex-1 flex flex-col relative">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 justify-between border-b px-4 bg-gray-900">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <span className="font-semibold">Luna Dashboard</span>
        </div>
        <div>
          {userName && <p className="mt-4 text-lg">Welcome, {userName}!</p>}
          <ChatOptions />
        </div>
      </header>
      <main className="p-4 flex-1 flex flex-col">
        <ChatContainer />
      </main>
    </div>
  );
}
