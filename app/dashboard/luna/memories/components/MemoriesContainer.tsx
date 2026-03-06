import { LunaMemoriesSuccessResponse } from "@/services/luna-memories";
import { AxiosError } from "axios";
import { formatDistance } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClockIcon } from "lucide-react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useState } from "react";
import DeleteMemoryAlertDialog, {
  ShowDeleteConfirmationStateProps,
} from "./DeleteMemoryAlertDialog";

const MemoryItem = ({
  memoryId,
  content,
  timeDistance,
  setShowDeleteConfirmation,
}: {
  memoryId: number;
  content: string;
  timeDistance: string;
  setShowDeleteConfirmation: React.Dispatch<
    React.SetStateAction<ShowDeleteConfirmationStateProps>
  >;
}) => {
  return (
    <div className="bg-gray-900 border rounded-lg p-4 flex flex-col gap-4 group">
      <div className="flex justify-between items-center">
        <Badge variant="outline">
          <ClockIcon />
          {timeDistance}
        </Badge>
        <Button
          variant="destructive"
          size="xs"
          className="group-hover:opacity-100 opacity-0 transition-all duration-150 ease-in-out"
          onClick={() =>
            setShowDeleteConfirmation({ show: true, memoryId: memoryId })
          }
        >
          <MdOutlineDeleteOutline className="size-4" />
          Remove
        </Button>
      </div>
      <h3 className="text-sm">{content}</h3>
    </div>
  );
};

interface MemoriesContainerProps {
  memories: LunaMemoriesSuccessResponse["memory"];
  isLoading: boolean;
  error: AxiosError | null;
}
const MemoriesContainer = ({
  memories,
  isLoading,
  error,
}: MemoriesContainerProps) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<ShowDeleteConfirmationStateProps>({
      show: false,
      memoryId: null,
    });
  if (isLoading)
    return [1, 2, 3].map((i) => (
      <Skeleton key={i} className="h-20 w-full rounded-md" />
    ));
  if (error)
    return (
      <p className="text-red-500">Error loading memories: {error.message}</p>
    );
  if (memories.length === 0)
    return <p className="text-gray-500">No memories found.</p>;
  return (
    <>
      {memories.map((memory) => (
        <MemoryItem
          key={memory.memory_id}
          memoryId={memory.memory_id}
          content={memory.memory_content}
          timeDistance={formatDistance(
            new Date(memory.created_at + "Z"),
            new Date(),
            {
              addSuffix: true,
            },
          )}
          setShowDeleteConfirmation={setShowDeleteConfirmation}
        />
      ))}
      <DeleteMemoryAlertDialog
        showDeleteConfirmation={showDeleteConfirmation}
        setShowDeleteConfirmation={setShowDeleteConfirmation}
      />
    </>
  );
};

export default MemoriesContainer;
