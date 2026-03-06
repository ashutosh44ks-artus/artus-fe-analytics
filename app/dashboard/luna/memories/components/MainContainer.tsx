import { useLunaMemoriesStore } from "@/lib/store/lunaMemoriesStore";
import {
  getLunaMemories,
  lunaMemoriesQueryKeys,
  LunaMemoriesSuccessResponse,
} from "@/services/luna-memories";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMemo } from "react";
import MemoriesContainer from "./MemoriesContainer";

const MainContainer = () => {
  const searchInput = useLunaMemoriesStore((state) => state.searchInput);
  const { data, isLoading, error } = useQuery<
    LunaMemoriesSuccessResponse["memory"],
    AxiosError
  >({
    queryKey: lunaMemoriesQueryKeys.base,
    queryFn: async () => {
      const response = await getLunaMemories();
      return response.memory;
    },
  });
  const filteredMemories = useMemo(() => {
    if (!data) return [];
    if (!searchInput) return data;
    return data.filter((memory) =>
      memory.memory_content.toLowerCase().includes(searchInput.toLowerCase()),
    );
  }, [data, searchInput]);

  return (
    <div className="flex flex-col gap-4 flex-1">
      <p className="text-xs opacity-75 uppercase font-medium flex items-center gap-2">
        {searchInput ? (
          <>
            Showing results for:{" "}
            <span className="font-medium">{searchInput}</span>
          </>
        ) : (
          "All Memories"
        )}
      </p>
      <div className="flex-1 flex flex-col gap-4">
        <MemoriesContainer
          memories={filteredMemories}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default MainContainer;
