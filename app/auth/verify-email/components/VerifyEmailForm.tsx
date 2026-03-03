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

  const handleVerify = () => {
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
    <div className="w-full max-w-md">
      {/* Logo and Brand */}
      <LogoWithTitleVertical />

      {/* Page Title */}
      <div className="text-center mb-8">
        <AuthHeader>Founder Verification</AuthHeader>
        <p className="text-gray-300">
          I sent you a secure key.{" "}
          <span className="font-medium">Enter it below for access</span>
        </p>
      </div>

      {/* OTP Input Fields */}
      <div className="mb-6">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => {
            setOtp(value);
          }}
          disabled={isPending}
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

      {/* Timer */}
      <div className="mb-6 flex items-center justify-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-gray-400" />
        <div className="flex flex-col gap-0.5">
          <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            Time Remaining
          </span>
          <span
            className={`text-base font-semibold font-mono tracking-wider ${
              timeLeft <= 60
                ? "text-primary-500"
                : timeLeft === 0
                  ? "text-red-500"
                  : "text-gray-300"
            }`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Verify Button */}
      <Button
        onClick={handleVerify}
        disabled={isButtonDisabled}
        variant="gradiantPrimary"
        className="w-full h-12 mb-6"
        size="lg"
      >
        {isPending ? "Verifying..." : "Verify"}
      </Button>

      {/* Resend Link */}
      <div className="text-center text-sm text-gray-400">
        Nothing in your inbox?{" "}
        <Button
          disabled={isPendingResendOtp || timeLeft > 0}
          onClick={() => resendOtp()}
          variant="link"
          className="text-primary-500 hover:text-primary-400 font-semibold p-0 h-auto"
        >
          Send new OTP
        </Button>
      </div>
    </div>
  );
}
