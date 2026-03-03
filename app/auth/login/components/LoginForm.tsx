"use client";

import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
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
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PiShieldCheckFill } from "react-icons/pi";
import { AxiosError } from "axios";

export function LoginForm() {
  const router = useRouter();

  const { mutate: sendOtp, isPending } = useMutation<
    LunaOtpSuccessResponse,
    AxiosError<LunaOtpErrorResponse>
  >({
    mutationFn: generateLunaOtp,
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Sent access code to your email! Check your inbox.");
        setTimeout(() => {
          router.push("/auth/verify-email");
        }, 1500);
      } else {
        console.error("Received Error with 200 status:", data);
        toast.error("Failed to send access code. Please try again.");
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.detail ||
          "Failed to send access code. Please try again.",
      );
    },
  });

  const handleActivateAccess = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    sendOtp();
  };

  return (
    <div className="w-full max-w-120 flex flex-col gap-12">
      {/* Header */}
      <div className="text-center flex flex-col gap-6">
        <LogoWithTitleVertical />
        <AuthHeader>Founders Access</AuthHeader>
        <p className="text-gray-300 text-base leading-relaxed max-w-sm mx-auto px-4 fill-mode-both">
          Sometimes you gotta run before you can walk.{" "}
          <span className="text-primary-400 font-medium">Access code</span>{" "}
          deploying to your{" "}
          <span className="text-primary-400 font-medium">secure channels</span>.
        </p>
      </div>

      {/* Main Content */}
      <div>
        <Button
          variant="gradiantPrimary"
          onClick={handleActivateAccess}
          disabled={isPending}
          className="w-full font-semibold"
          size="xl"
        >
          {isPending ? (
            <AiOutlineLoading3Quarters className="animate-spin size-5" />
          ) : (
            <Mail className="size-5 shrink-0" />
          )}
          {isPending ? "Sending..." : "Login with OTP"}
        </Button>
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-primary-500/20">
        <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
          <PiShieldCheckFill
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
