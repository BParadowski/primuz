"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { Loader2Icon } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { Textarea } from "../ui/textarea";

interface UpdaterProps {
  id: string;
  name: string;
  date: string;
  location?: string;
  pay?: string;
  calendarDescription?: string;
  calendarId: string;
  description?: string;
}

const formSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Projekt musi mieć nazwę" }),
  date: z.date({ required_error: "Wybierz datę" }),
  location: z.string().optional(),
  pay: z.string().optional(),
  calendarDescription: z.string().optional(),
  calendarId: z.string(),
  description: z.string(),
});

export default function InfoUpdater(props: UpdaterProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: props.id,
      name: props.name,
      date: new Date(props.date),
      location: props.location ?? "",
      pay: props.pay ?? "",
      description: props.description ?? "",
      calendarId: props.calendarId,
      calendarDescription: props.calendarDescription,
    },
  });

  const { toast } = useToast();

  return (
    <div>
      <Form {...form}>
        <form
          className="grid"
          onSubmit={form.handleSubmit(
            async (data) => {
              console.log(data);
              const response = await fetch("/api/project", {
                method: "PATCH",
                body: JSON.stringify({
                  projectId: data.id,
                  payload: {
                    name: data.name,
                    location: data.location,
                    description: data.description,
                    pay: data.pay,
                    date: data.date,
                    google_calendar_id: data.calendarId,
                    google_calendar_description: data.calendarDescription,
                  },
                }),
              });
              toast({ description: "Zmiany zostały zapisane." });
            },
            () => console.log(form.formState.errors),
          )}
        >
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
                <FormItem className="place-self-center sm:col-start-2 sm:row-span-3 sm:row-start-1">
                  <FormLabel className="sr-only">Data</FormLabel>
                  <FormControl>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      defaultMonth={field.value}
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
          </div>
          <div className="grid gap-y-4">
            <FormField
              control={form.control}
              name="calendarDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis wydarzenia w kalendarzu google</FormLabel>
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
          {form.formState.isSubmitting ? (
            <Button type="button" size="lg" className="my-6 place-self-center">
              <Loader2Icon className="animate-spin" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="my-6 place-self-center"
            >
              Zapisz zmiany
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
