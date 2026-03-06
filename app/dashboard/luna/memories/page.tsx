"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import "@/app/dashboard/dashboard-styles.css";
import Link from "next/link";
import Searchbar from "./components/Searchbar";
import MainContainer from "./components/MainContainer";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function LunaMemoriesPage() {
  return (
    <div className="h-screen flex flex-col relative">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 justify-between border-b px-4 bg-gray-900">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex items-center gap-1">
            <Link
              className="font-semibold hover:text-primary-500 transition-colors ease-in-out duration-150 flex gap-1 items-center"
              href="/dashboard/luna"
            >
              <IoIosArrowRoundBack className="size-5" />
              Luna Chat
            </Link>
            <span className="font-semibold">/</span>
            <span className="font-semibold">Memories</span>
          </div>
        </div>
        <div>
          <Searchbar />
        </div>
      </header>
      <main className="p-4 flex-1 flex flex-col">
        <MainContainer />
      </main>
    </div>
  );
}
