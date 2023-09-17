"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().nonempty({ message: "Projekt musi mieć nazwę" }),
  date: z.date({ required_error: "Wybierz datę" }),
  location: z.string(),
  pay: z.string(),
  calendarDescription: z.string().optional(),
  description: z.string(),
});

type NewProjectFormData = z.infer<typeof formSchema>;

export default function Profile() {
  const form = useForm<NewProjectFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      date: undefined,
      location: "",
      pay: "",
      calendarDescription: undefined,
      description: "",
    },
  });

  return (
    <main className="grid place-content-center">
      <h1 className="text-center text-2xl">Nowy projekt</h1>
      <div className="rounded-2xl border-2 border-solid border-muted p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => console.log(data))}>
            <div className="grid">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa projektu</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Miejsce</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="pay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stawka</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>brutto</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Data</FormLabel>
                    <FormControl>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                      />
                    </FormControl>
                    <FormDescription className="text-center">
                      Dzień koncertu/nagrania.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="calendarDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opis wydarzenia w kalendarzu</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opis projektu w aplikacji</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="h-40" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            <Button type="submit" variant="destructive">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
