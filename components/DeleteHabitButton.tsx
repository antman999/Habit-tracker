"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { useActionState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteHabitAction, DeleteHabitState } from "@/lib/actions";
import { Trash2 } from "lucide-react";

interface DeleteHabitButtonProps {
  habitId: number;
  habitName: string;
  className?: string;
}

function AlertDialogConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <AlertDialogAction
      type="submit"
      disabled={pending}
      className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
    >
      {pending ? "Deleting..." : "Confirm Delete"}
    </AlertDialogAction>
  );
}

export function DeleteHabitButton({
  habitId,
  habitName,
  className,
}: DeleteHabitButtonProps) {
  const initialState: DeleteHabitState = {};
  const [state, formAction] = useActionState(deleteHabitAction, initialState);

  React.useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className={cn(" rounded-lg cursor-pointer", className)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the habit
            <strong className="mx-1">{habitName}</strong>
            and all its associated completion data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="habitId" value={habitId} />
            <AlertDialogConfirmButton />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
