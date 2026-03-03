"use client";

import { useRouter } from "next/navigation";
import { useApiMutation, apiClient } from "@/lib/api";
import { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Loader,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import OrangeLogo from "@/components/assets/orrange-logo.png";

interface OtpResponse {
  message: string;
  success: boolean;
}

export function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle",
  );

  const { mutate: sendOtp, isPending } = useApiMutation<OtpResponse>(
    () => apiClient.post<OtpResponse>("/luna_otp"),
    {
      onSuccess: () => {
        setStatus("sent");
        // Navigate to verify-email after showing success message
        setTimeout(() => {
          router.push("/auth/verify-email");
        }, 1500);
      },
      onError: () => {
        setStatus("failed");
      },
    },
  );

  const handleActivateAccess = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStatus("sending");
    sendOtp({});
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 right-0 w-125 h-125 rounded-full bg-linear-to-br from-primary-500/20 to-transparent opacity-30 blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
      <div
        className="absolute bottom-0 left-0 w-100 h-100 rounded-full bg-linear-to-br from-primary-500/15 to-transparent opacity-20 blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Content */}
      <div className="w-full max-w-120 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-600">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mb-2 animate-in fade-in duration-400 delay-200 fill-mode-both">
            <Image
              src={OrangeLogo}
              alt="Artus AI"
              className="h-12 w-auto mx-auto transition-all duration-300 hover:scale-105 hover:drop-shadow-lg"
              style={{ filter: "drop-shadow(0 0 12px var(--color-primary))" }}
              height={32}
              width={32}
            />
          </div>
          <div className="text-sm font-semibold text-primary-400 tracking-wide uppercase mb-8 animate-in fade-in duration-400 delay-300 fill-mode-both">
            Luna
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-white via-primary-500 to-white bg-clip-text text-transparent mb-6 animate-in fade-in duration-400 delay-400 fill-mode-both">
            Founders Access
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-sm mx-auto px-4 animate-in fade-in duration-400 delay-500 fill-mode-both">
            Sometimes you gotta run before you can walk.{" "}
            <span className="text-primary-400 font-medium">Access code</span>{" "}
            deploying to your{" "}
            <span className="text-primary-400 font-medium">
              secure channels
            </span>
            .
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Status Messages */}
          {status === "sending" && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/15 border border-yellow-500/40 text-yellow-400 animate-in slide-down duration-300">
              <Loader className="w-5 h-5 animate-spin" />
              <span className="font-medium">Transmitting quantum code...</span>
            </div>
          )}

          {status === "sent" && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/15 border border-green-500/40 text-white animate-in slide-down duration-300">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span className="font-medium">
                Quantum code transmitted! Check your neural interface.
              </span>
            </div>
          )}

          {status === "failed" && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/15 border border-red-500/40 text-red-400 animate-in slide-down duration-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-medium">
                Transmission failed. Please retry neural sync.
              </span>
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleActivateAccess}
            disabled={isPending || status === "sent"}
            className="w-full py-4 px-8 rounded-lg font-semibold uppercase text-white text-sm tracking-wider bg-linear-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/50 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md flex items-center justify-center gap-2 relative overflow-hidden group"
          >
            <Mail className="w-5 h-5 shrink-0" />
            {isPending ? "Activating..." : "Activate Access Protocol"}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-primary-500/20">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <ShieldCheck
              className="w-4 h-4 animate-pulse"
              style={{
                filter: "drop-shadow(0 0 4px var(--color-primary))",
              }}
            />
            <span>Powered by Artus Analytics core</span>
          </div>
        </div>
      </div>
    </div>
  );
}
