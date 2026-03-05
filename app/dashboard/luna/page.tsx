"use client";

import ChatContainer from "./components/ChatContainer";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import ChatOptions from "./components/ChatOptions";
import "@/app/dashboard/dashboard-styles.css";

export default function LunaPage() {
  return (
    <div className="h-screen flex flex-col relative">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 justify-between border-b px-4 bg-gray-900">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <span className="font-semibold">Luna Chat</span>
        </div>
        <ChatOptions />
      </header>
      <main className="p-4 flex-1 flex flex-col min-h-0">
        <ChatContainer />
      </main>
    </div>
  );
}
