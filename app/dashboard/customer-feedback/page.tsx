"use client";

import { useQuery } from "@tanstack/react-query";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  customerFeedbackDataQueryKeys,
  getCustomerFeedbackData,
  CustomerFeedbackDataSuccessResponse,
} from "@/services/customer-feedback";
import FeedbackContent from "./components/FeedbackContent";
import { AxiosError } from "axios";

const Page = () => {
  const { data, isLoading, error } = useQuery<
    CustomerFeedbackDataSuccessResponse["feedback"],
    AxiosError
  >({
    queryKey: customerFeedbackDataQueryKeys.base,
    queryFn: async () => {
      const data = await getCustomerFeedbackData();
      return data.feedback;
    },
    placeholderData: [],
  });

  return (
    <div className="min-h-0 flex-1 flex flex-col relative">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 justify-between border-b px-4 bg-gray-900">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <span className="font-semibold">User Feedback</span>
        </div>
        {/* add filters here in the future */}
      </header>
      <main className="p-4 flex-1">
        <FeedbackContent data={data} isLoading={isLoading} error={error} />
      </main>
    </div>
  );
};

export default Page;
