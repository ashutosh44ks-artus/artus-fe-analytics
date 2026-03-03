"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import OrangeLogo from "@/components/assets/orrange-logo.png";
import {
  isSidebarItemActive,
  SIDEBAR_ITEMS,
} from "@/app/dashboard/components/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-sidebar-border h-16">
        <div className="flex items-center gap-4 px-2 py-2">
          <Image
            src={OrangeLogo}
            alt="Artus AI"
            className="w-auto"
            height={10}
            width={10}
          />
          <span className="text-lg font-semibold">Luna</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarGroup key={item.group}>
            <SidebarGroupLabel>{item.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => {
                  const isActive = isSidebarItemActive(item.key, pathname);
                  return (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton asChild isActive={isActive} size="lg">
                        {item.disabled ? (
                          <div className="flex items-center gap-2 cursor-not-allowed opacity-50">
                            <item.icon className="size-5" />
                            {item.label}
                          </div>
                        ) : (
                          <Link
                            href={`/dashboard/${item.key}`}
                            className="flex items-center gap-2"
                          >
                            <item.icon className="size-5" />
                            {item.label}
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
