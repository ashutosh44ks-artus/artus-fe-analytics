"use client";

import { AppSidebar } from "@/app/dashboard/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useUserStore } from "@/lib/store/userStore";
import {
  getUserData,
  userDataQueryKeys,
  UserDataSuccessResponse,
} from "@/services/user";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const setUserName = useUserStore((state) => state.setUserName);
  const { data } = useQuery<UserDataSuccessResponse>({
    queryKey: userDataQueryKeys.base,
    queryFn: async () => {
      return await getUserData();
    },
  });
  useEffect(() => {
    if (!data) return;
    setUserName(data);
  }, [data, setUserName]);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

export default Layout;
