"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  generateLunaOtp,
  LunaLoginErrorResponse,
  LunaLoginSuccessResponse,
  LunaOtpErrorResponse,
  LunaOtpSuccessResponse,
  verifyLunaOtp,
} from "@/services/auth";
import { toast } from "sonner";
import useTimeLeft from "./useTimeLeft";
import { setCookie } from "@/lib/cookies";
import LogoWithTitleVertical from "../../components/LogoWithTitleVertical";
import AuthHeader from "../../components/AuthHeader";
import { cn } from "@/lib/utils";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export function VerifyEmailForm() {
  const router = useRouter();
  const [otp, setOtp] = useState<string>("");

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };
  const { timeLeft, resetTimeLeft } = useTimeLeft();

  const { mutate: verifyOtp, isPending } = useMutation<
    LunaLoginSuccessResponse,
    LunaLoginErrorResponse,
    string
  >({
    mutationFn: verifyLunaOtp,

    onSuccess: async (data) => {
      toast.success("OTP verified successfully! Redirecting...");

      console.log(data);
      // set cookie with token here
      await setCookie("luna_auth_token", data.token, {
        maxAge: data.expires_in,
      });

      setTimeout(() => {
        router.push("/dashboard/overview");
      }, 1500);
    },

    onError: (error) => {
      toast.error(error.detail || "Invalid OTP. Please try again.");
      setOtp("");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP sent to your email.");
      return;
    }
    verifyOtp(otp);
  };

  const { mutate: resendOtp, isPending: isPendingResendOtp } = useMutation<
    LunaOtpSuccessResponse,
    LunaOtpErrorResponse
  >({
    mutationFn: generateLunaOtp,
    onSuccess: (data) => {
      if ("success" in data && data.success) {
        console.log("OTP Generated:", data);
        toast.success("Sent access code to your email! Check your inbox.");
        resetTimeLeft();
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

  const isOtpComplete = otp.length === 6;
  const isButtonDisabled = !isOtpComplete || isPending;

  return (
    <form
      className="w-full max-w-120 flex flex-col gap-8"
      onSubmit={handleSubmit}
    >
      <div className="text-center flex flex-col gap-6">
        <LogoWithTitleVertical />
        <AuthHeader>Founder Verification</AuthHeader>
        <div>
          <p className="text-gray-300 text-base leading-relaxed max-w-sm mx-auto px-4 fill-mode-both">
            I sent you both a secure key. Enter it below for access
          </p>
        </div>
        {/* OTP Input Fields */}
        <div>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => {
              setOtp(value);
            }}
            disabled={isPending}
            autoFocus
          >
            <InputOTPGroup className="gap-3 justify-center flex">
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="w-14 h-16 border-2 border-slate-700 rounded-lg text-2xl font-semibold bg-slate-900/60 backdrop-blur-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Verify Button */}
        <Button
          disabled={isButtonDisabled}
          variant="gradiantPrimary"
          className="w-full font-semibold"
          size="xl"
        >
          {isPending && (
            <AiOutlineLoading3Quarters className="animate-spin size-5" />
          )}
          {isPending ? "Verifying..." : "Verify"}
        </Button>

        <div className="flex justify-between items-center">
          {/* Resend Link */}
          <div className="flex items-center gap-1 justify-center text-sm text-gray-400">
            Nothing in your inbox?{" "}
            <Button
              disabled={isPendingResendOtp || timeLeft > 0}
              onClick={() => resendOtp()}
              variant="link"
              type="button"
              className="text-primary-500 hover:text-primary-400 font-semibold p-0 h-auto"
            >
              Send new OTP
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span
              className={cn(
                "text-sm font-semibold tracking-wider",
                timeLeft <= 60 ? "text-primary-500" : "text-gray-300",
              )}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
