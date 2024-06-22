"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  calendarId: z.string().email("Sprawdź poprawność id."),
});
export default function IntegrationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      calendarId: "",
    },
  });

  const onSubmit = () => {
    console.log("Bruh");
  };

  return (
    <div className="pt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="calendarId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identyfikator kalendarza</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Zintegruj kalendarz</Button>
        </form>
      </Form>
    </div>
  );
}
