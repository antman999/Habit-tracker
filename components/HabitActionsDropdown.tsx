"use client";

import * as React from "react";
import {
  useTransition,
  useActionState,
  useEffect,
  useState,
  useRef,
} from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { updateHabitArchivedStatus, deleteHabitAction } from "@/lib/actions";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";

interface ActionState {
  error?: string;
  success?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

interface HabitActionsDropdownProps {
  habitId: string;
  isArchived: boolean;
  habitName: string;
}

function AlertDialogConfirmDeleteButton() {
  const { pending } = useFormStatus();
  return (
    <AlertDialogAction
      type="submit"
      disabled={pending}
      className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
    >
      {pending ? "Deleting..." : "Confirm Delete"}
    </AlertDialogAction>
  );
}

export function HabitActionsDropdown({
  habitId,
  isArchived,
  habitName,
}: HabitActionsDropdownProps) {
  const [isArchivePending, startArchiveTransition] = useTransition();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const initialDeleteState: ActionState = {};
  const [deleteState, deleteFormAction, isDeleteFormPending] = useActionState(
    deleteHabitAction,
    initialDeleteState
  );

  useEffect(() => {
    if (deleteState?.error) {
      toast.error(deleteState.error);

      if (isDeleteDialogOpen) {
        setIsDeleteDialogOpen(false);
      }
    }
    if (deleteState?.success) {
      toast.success(deleteState.message || "Habit deleted successfully.");
      if (isDeleteDialogOpen) {
        setIsDeleteDialogOpen(false);
      }
    }
  }, [deleteState, isDeleteDialogOpen]);

  const handleToggleArchive = () => {
    setIsDropdownOpen(false);
    startArchiveTransition(async () => {
      const formData = new FormData();
      formData.append("habitId", habitId);
      formData.append("is_archived", String(!isArchived));
      const result: ActionState | void = await updateHabitArchivedStatus(
        formData
      );
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success(
          result.message || `Habit ${isArchived ? "unarchived" : "archived"}.`
        );
      } else {
        console.warn("Archive action did not return a standard status object.");
      }
    });
  };

  const openDeleteDialog = () => {
    setIsDropdownOpen(false);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isArchivePending || isDeleteFormPending}
            ref={dropdownTriggerRef}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Habit Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={handleToggleArchive}
            disabled={isArchivePending || isDeleteFormPending}
            className="cursor-pointer"
          >
            {isArchived ? (
              <>
                <ArchiveRestore className="mr-2 h-4 w-4" />
                <span>Unarchive</span>
              </>
            ) : (
              <>
                <Archive className="mr-2 h-4 w-4" />
                <span>Archive</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={openDeleteDialog}
            disabled={isArchivePending || isDeleteFormPending}
            className="text-red-600 dark:text-red-500 focus:bg-red-100 dark:focus:bg-red-900/50 focus:text-red-700 dark:focus:text-red-400 cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            if (document.body.contains(dropdownTriggerRef.current)) {
              dropdownTriggerRef.current?.focus();
            }
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              habit
              <strong className="mx-1">{habitName}</strong>
              and all its associated completion data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleteFormPending}
            >
              Cancel
            </AlertDialogCancel>
            <form action={deleteFormAction}>
              <input type="hidden" name="habitId" value={habitId} />
              <AlertDialogConfirmDeleteButton />
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
