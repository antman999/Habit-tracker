"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { createHabitAction } from "@/lib/actions";
import { CreateHabitState } from "@/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

const goalValues = ["7", "14", "30"] as const;
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50),
  description: z.string().min(2).max(150).optional(),
  goal: z.enum(goalValues).optional(),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="whitespace-nowrap bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-fuchsia-500 hover:to-purple-500 text-white px-6 w-full sm:w-auto transition-colors duration-300 ease-in"
    >
      {pending ? "Adding..." : "Add habit"}
    </Button>
  );
}

const HABIT_LIMIT_ERROR_MSG = `Habit limit (${6}) reached.`;

export function NewHabitForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      goal: undefined,
    },
  });

  const initialState: CreateHabitState = { message: null, errors: undefined };
  const [state, formAction] = useActionState(createHabitAction, initialState);

  const isLimitError = state?.errors?._form?.includes(HABIT_LIMIT_ERROR_MSG);

  useEffect(() => {
    if (state?.message && !state.errors) {
      toast.success(state.message);
      console.log("here");
      form.reset();
    } else if (state?.message && state.errors) {
      if (!isLimitError) {
        const errorMessages = [
          state.errors._form?.join(", "),
          state.errors.name?.join(", "),
          state.errors.description?.join(", "),
          state.errors.goal?.join(", "),
        ]
          .filter(Boolean)
          .join(" ");
        toast.error(
          state.message + (errorMessages ? ` (${errorMessages})` : "")
        );
        console.log("here 2");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, form.reset, isLimitError]);

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-gray-200 dark:border-neutral-700">
      <h1 className="mb-6 text-xl font-semibold">Create a new habit</h1>
      {isLimitError && (
        <Alert className="mb-4 border-grey-50 bg-yellow-50 text-yellow-700 dark:border-yellow-50">
          <TriangleAlert className="h-4 w-4 stroke-current" />
          <AlertTitle className="font-semibold">Habit Limit Reached</AlertTitle>
          <AlertDescription className="dark: text-gray-500">
            You cannot add more than 6 habits. Studies show that starting out
            with a smaller amount of new habits can help you achieve them. If
            you have completed a habit make sure to archive or delete it and
            start a new one. Proud of you!
          </AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form
          action={formAction}
          className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] items-start gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Habit name" {...field} />
                </FormControl>
                <FormMessage className="min-h-[1.25rem] w-full" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Habit description" {...field} />
                </FormControl>
                <FormMessage className="min-h-[1.25rem] w-full" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select goal..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  name={field.name}
                  value={field.value ?? ""}
                />
                <FormMessage className="min-h-[1.25rem] w-full" />
              </FormItem>
            )}
          />
          {state?.errors?._form && !isLimitError && (
            <div className="col-span-full text-sm font-medium text-red-500">
              {state.errors._form.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
          <SubmitButton />
        </form>
      </Form>
    </div>
  );
}
