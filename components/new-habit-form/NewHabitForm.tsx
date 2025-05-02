"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
  goal: z.string().min(2).max(50),
});

export function NewHabitForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      goal: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    form.reset();
  }
  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 sm:p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <h1 className="mb-6 text-xl font-semibold">Create a new habit</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-grow w-full sm:w-auto">
                <FormControl>
                  <Input placeholder="Habit name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex-grow w-full sm:w-auto">
                <FormControl>
                  <Input placeholder="Habit description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem className="flex-grow-0 flex-shrink sm:w-1/5 w-full">
                <FormControl>
                  <Input placeholder="Goal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="flex-shrink-0 whitespace-nowrap bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6  w-full sm:w-auto"
          >
            Add habit
          </Button>
        </form>
      </Form>
    </div>
  );
}
