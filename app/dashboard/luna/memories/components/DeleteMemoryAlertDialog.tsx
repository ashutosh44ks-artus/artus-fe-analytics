import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  deleteLunaMemory,
  lunaMemoriesQueryKeys,
} from "@/services/luna-memories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface ShowDeleteConfirmationStateProps {
  show: boolean;
  memoryId: number | null;
}

interface DeleteMemoryAlertDialogProps {
  showDeleteConfirmation: ShowDeleteConfirmationStateProps;
  setShowDeleteConfirmation: React.Dispatch<
    React.SetStateAction<ShowDeleteConfirmationStateProps>
  >;
}
const DeleteMemoryAlertDialog = ({
  showDeleteConfirmation,
  setShowDeleteConfirmation,
}: DeleteMemoryAlertDialogProps) => {
  const queryClient = useQueryClient();
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationFn: async (memoryId: number) => {
      return await deleteLunaMemory(memoryId);
    },
    onSuccess: () => {
      toast.success("Memory deleted successfully.");
      queryClient.invalidateQueries({ queryKey: lunaMemoriesQueryKeys.base });
      setShowDeleteConfirmation({ show: false, memoryId: null });
    },
    onError: () => {
      toast.error("Failed to delete the memory. Please try again.");
    },
  });
  const handleDelete = () => {
    if (showDeleteConfirmation.memoryId) {
      deleteMutation(showDeleteConfirmation.memoryId);
    }
  };
  return (
    <AlertDialog
      open={showDeleteConfirmation.show}
      onOpenChange={(open) =>
        setShowDeleteConfirmation((prev) => ({ ...prev, show: open }))
      }
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            memory from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMemoryAlertDialog;
