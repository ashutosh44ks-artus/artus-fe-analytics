"use client";

import { useRouter } from "next/navigation";
import { Mail, ShieldCheck } from "lucide-react";
import {
  generateLunaOtp,
  LunaOtpErrorResponse,
  LunaOtpSuccessResponse,
} from "@/services/auth";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import LogoWithTitleVertical from "../../components/LogoWithTitleVertical";
import AuthHeader from "../../components/AuthHeader";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();

  const { mutate: sendOtp, isPending } = useMutation<
    LunaOtpSuccessResponse,
    LunaOtpErrorResponse
  >({
    mutationFn: generateLunaOtp,
    onSuccess: (data) => {
      if ("success" in data && data.success) {
        console.log("OTP Generated:", data);
        toast.success("Sent access code to your email! Check your inbox.");
        setTimeout(() => {
          router.push("/auth/verify-email");
        }, 1500);
      } else {
        console.log("OTP Generation Failed:", data);
        toast.error("Failed to send access code. Please try again.");
      }
    },
    onError: (error) => {
      toast.error(
        error.detail || "Failed to send access code. Please try again.",
      );
    },
  });

  const handleActivateAccess = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    sendOtp();
  };

  return (
    <div className="w-full max-w-120 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-600">
      {/* Header */}
      <div className="text-center mb-10">
        <LogoWithTitleVertical />
        <AuthHeader>Founders Access</AuthHeader>
        <p className="text-gray-300 text-base leading-relaxed max-w-sm mx-auto px-4 animate-in fade-in duration-400 delay-500 fill-mode-both">
          Sometimes you gotta run before you can walk.{" "}
          <span className="text-primary-400 font-medium">Access code</span>{" "}
          deploying to your{" "}
          <span className="text-primary-400 font-medium">secure channels</span>.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Button */}
        <Button
          variant="gradiantPrimary"
          onClick={handleActivateAccess}
          disabled={isPending}
          className="h-12 w-full"
        >
          <Mail className="w-5 h-5 shrink-0" />
          {isPending ? "Activating..." : "Login with OTP"}
        </Button>
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
  );
}
