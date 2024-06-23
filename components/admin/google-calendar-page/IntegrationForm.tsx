"use client";

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
import { SchemaType, formSchema } from "./integrationFormSchema";
import { toast } from "@/components/ui/use-toast";

export default function IntegrationForm() {
  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      calendarId: "",
    },
  });

  async function onSubmit(fields: SchemaType) {
    const res = await fetch("/api/integrate-calendar", {
      method: "POST",
      body: JSON.stringify(fields),
    }).then((res) => res.json());

    if (res.success) {
      toast({
        description: "Kalendarz został zintegrowany!",
        variant: "default",
      });
    } else {
      toast({
        description: `W trakcie integrowania kalendarza wystąpił błąd... ${
          res.message ? res.message : ""
        }`,
        variant: "destructive",
      });
    }
  }

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
                  <Input
                    placeholder="shadcn"
                    {...field}
                    className="max-w-full"
                  />
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
