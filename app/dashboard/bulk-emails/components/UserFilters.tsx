"use client";

import { useBulkEmailsStore } from "@/lib/store/useBulkEmailsStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useJobTitles from "@/hooks/use-job-titles";
import useHeardFrom from "@/hooks/use-heard-from";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export function UserFilters() {
  const { userFilters, setUserFilter } = useBulkEmailsStore();
  const { data: userJobTitlesData, isLoading: isLoadingJobTitles } =
    useJobTitles();
  const { data: userHeardFromData, isLoading: isLoadingHeardFrom } =
    useHeardFrom();

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>User Filters</CardTitle>
        <CardDescription>
          Select criteria to target specific segments of your audience
        </CardDescription>
      </CardHeader>
      {/* grid 3x3 */}
      <CardContent className="grid sm:grid-cols-3 grid-cols-2 gap-4">
        {/* Last Logged In Filter */}
        <div className="space-y-2">
          <Label htmlFor="last-logged-in">Last Logged In</Label>
          <Select
            value={userFilters.filter_by_last_logged_in}
            onValueChange={(
              value: "all" | "last_24_hours" | "last_7_days" | "last_30_days",
            ) => setUserFilter("filter_by_last_logged_in", value)}
          >
            <SelectTrigger id="last-logged-in" className="w-full">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="last_24_hours">Last 24 Hours</SelectItem>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="before_24_hours">Before 24 Hours Ago</SelectItem>
              <SelectItem value="before_7_days">Before 7 Days Ago</SelectItem>
              <SelectItem value="before_30_days">Before 30 Days Ago</SelectItem>
              <SelectItem value="before_60_days">Before 60 Days Ago</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Signed Up Filter */}
        <div className="space-y-2">
          <Label htmlFor="signed-up">Signed Up</Label>
          <Select
            value={userFilters.filter_by_signed_up}
            onValueChange={(
              value: "all" | "last_24_hours" | "last_7_days" | "last_30_days",
            ) => setUserFilter("filter_by_signed_up", value)}
          >
            <SelectTrigger id="signed-up" className="w-full">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="last_24_hours">Last 24 Hours</SelectItem>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Credits Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="credits-status">Credits Status</Label>
          <Select
            value={userFilters.credits_status}
            onValueChange={(
              value: "all" | "ran_out_of_credits" | "credits_expired",
            ) => setUserFilter("credits_status", value)}
          >
            <SelectTrigger id="credits-status" className="w-full">
              <SelectValue placeholder="Select credits status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="ran_out_of_credits">
                Ran Out of Credits
              </SelectItem>
              <SelectItem value="credits_expired">Credits Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Plan Filter */}
        <div className="space-y-2">
          <Label htmlFor="active-plan">Active Plan</Label>
          <Select
            value={userFilters.active_plan}
            onValueChange={(
              value: "all" | "free" | "pro" | "enterprise",
            ) => setUserFilter("active_plan", value)}
          >
            <SelectTrigger id="active-plan" className="w-full">
              <SelectValue placeholder="Select active plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Visited Payments Plan Filter */}
        <div className="space-y-2">
          <Label htmlFor="visited-payments">Visited Payments Plan</Label>
          <Select
            value={userFilters.visited_payments_plan}
            onValueChange={(value: "all" | "yes" | "no") =>
              setUserFilter("visited_payments_plan", value)
            }
          >
            <SelectTrigger id="visited-payments" className="w-full">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Title Filter */}
        <div className="space-y-2">
          <Label htmlFor="job-title">
            Job Title{" "}
            {isLoadingJobTitles && (
              <AiOutlineLoading3Quarters className="animate-spin" />
            )}
          </Label>
          <Select
            value={userFilters.filter_by_job_title}
            onValueChange={(value) =>
              setUserFilter("filter_by_job_title", value)
            }
          >
            <SelectTrigger id="job-title" className="w-full">
              <SelectValue placeholder="Select job title" />
            </SelectTrigger>
            <SelectContent>
              {userJobTitlesData.map((jt) => (
                <SelectItem key={jt.value} value={jt.value}>
                  {jt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Heard From Filter */}
        <div className="space-y-2">
          <Label htmlFor="heard-from">
            Heard From{" "}
            {isLoadingHeardFrom && (
              <AiOutlineLoading3Quarters className="animate-spin" />
            )}
          </Label>
          <Select
            value={userFilters.filter_by_heard_from}
            onValueChange={(value) =>
              setUserFilter("filter_by_heard_from", value)
            }
          >
            <SelectTrigger id="heard-from" className="w-full">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {userHeardFromData.map((hf) => (
                <SelectItem key={hf.value} value={hf.value}>
                  {hf.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
