"use server";
import { cookies } from "next/headers";

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
  maxAge?: number;
  expires?: Date;
}

export const getCookie = async (name: string): Promise<string | undefined> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);
  return cookie?.value;
};

export const getToken = async (name: string): Promise<string | undefined> => {
  const token = await getCookie(name);
  return token;
};

export const setCookie = async (
  name: string,
  value: string,
  options: CookieOptions = {},
): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...options,
  });
};

export const deleteCookie = async (name: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};
