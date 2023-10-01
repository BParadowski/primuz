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
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import NewRehearsalDialog from "@/components/admin/newRehearsalDialog";
import { format } from "date-fns/esm";
import { pl } from "date-fns/locale";
import { XIcon } from "lucide-react";
import { v4 as uuid } from "uuid";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { PiecePicker } from "@/components/admin/piecePicker";

const formSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty({ message: "Projekt musi mieć nazwę" }),
  date: z.date({ required_error: "Wybierz datę" }),
  location: z.string(),
  pay: z.string(),
  calendarDescription: z.string().optional(),
  calendarId: z.string().uuid(),
  description: z.string(),
  rehearsals: z.array(
    z.object({
      id: z.string().uuid(),
      start: z.string().datetime({ offset: true }),
      end: z.string().datetime({ offset: true }),
      location: z.string(),
      description: z.string(),
      calendarId: z.string().uuid(),
    }),
  ),
  pieces: z.array(z.string().uuid()),
});

export type NewProjectFormData = z.infer<typeof formSchema>;
export type RehearsalData = NewProjectFormData["rehearsals"][0];

export default function Profile() {
  const form = useForm<NewProjectFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: uuid(),
      calendarId: uuid(),
      name: "",
      date: undefined,
      location: "",
      pay: "",
      calendarDescription: undefined,
      description: "",
      rehearsals: [],
      pieces: [],
    },
  });

  let rehearsals = form.watch("rehearsals");
  let pieces = form.watch("pieces");

  const router = useRouter();

  function newRehearsal(data: RehearsalData) {
    form.setValue(
      "rehearsals",
      [...form.getValues("rehearsals"), data].sort((a, b) => {
        if (a.start > b.start) return 1;
        else return -1;
      }),
    );
  }

  function editRehearsal(data: RehearsalData) {
    deleteRehearsal(data.id);
    newRehearsal(data);
  }

  function deleteRehearsal(id: string) {
    form.setValue(
      "rehearsals",
      form.getValues("rehearsals").filter((rehearsal) => rehearsal.id !== id),
    );
  }

  function addPiece(pieceId: string) {
    form.setValue("pieces", [...form.getValues("pieces"), pieceId]);
  }

  async function submitProject(formData: NewProjectFormData) {
    const res = await fetch("/api/project", {
      method: "post",
      body: JSON.stringify(formData),
    }).then((res) => res.json());
    if (res.success === true) {
      fetch("/api/notifications", {
        method: "POST",
        body: JSON.stringify({
          targets: "everyone",
          message: "Został dodany nowy projekt - zaznacz swoją dostępność.",
          internalName: `${formData.name} creation message`,
          projectId: formData.id,
        }),
      });
    }
    return;
  }

  return (
    <main className="bg-primary">
      <div className="container">
        <div className="grid w-full place-content-center overflow-hidden rounded-lg bg-muted pb-10">
          <h1 className="my-10 text-center text-2xl font-bold">Nowy projekt</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (data) => {
                const response = await submitProject(data);
                router.push(`/admin/projekty/${data.id}`);
              })}
            >
              <div className="grid gap-y-8 rounded-lg bg-background p-6">
                <div className="grid gap-y-8 sm:grid-cols-2 sm:gap-x-8">
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
                      <FormItem className="sm:col-start-2 sm:row-span-3 sm:row-start-1">
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
                </div>

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

              <div className="mt-8 grid gap-y-8 rounded-lg bg-background p-6">
                <div className="flex items-center">
                  <p>Próby</p>
                  <NewRehearsalDialog
                    onConfirm={newRehearsal}
                    triggerText="Dodaj Próbę"
                    dialogTitle="Nowa Próba"
                    confirmText="Dodaj Próbę"
                    clearAfterConfirmation
                  />
                </div>

                <div className="flex flex-col gap-6">
                  {rehearsals.map((rehearsal) => {
                    const startDate = new Date(rehearsal.start);
                    const endDate = new Date(rehearsal.end);

                    return (
                      <Card key={rehearsal.id}>
                        <CardHeader className="bg-muted py-4">
                          <CardTitle className="text-lg">
                            {format(
                              new Date(rehearsal.start),
                              "d MMMM (EEEE)",
                              {
                                locale: pl,
                              },
                            )}
                          </CardTitle>
                          <CardDescription>
                            {format(new Date(rehearsal.start), "p", {
                              locale: pl,
                            }) +
                              "-" +
                              format(new Date(rehearsal.end), "p", {
                                locale: pl,
                              })}

                            <p className="mt-2 italic">{rehearsal.location}</p>
                            <pre className="mt-2">{rehearsal.description}</pre>
                          </CardDescription>
                          <div className="flex items-center">
                            <NewRehearsalDialog
                              onConfirm={editRehearsal}
                              triggerText="Edytuj"
                              dialogTitle="Edytuj Próbę"
                              initialValues={{
                                id: rehearsal.id,
                                calendarId: rehearsal.calendarId,
                                location: rehearsal.location,
                                description: rehearsal.description,
                                date: startDate,
                                startTime: format(startDate, "HH:mm"),
                                endTime: format(endDate, "HH:mm"),
                              }}
                              confirmText="Zapisz Zmiany"
                            />
                            <button
                              type="button"
                              onClick={() => deleteRehearsal(rehearsal.id)}
                              className="ml-6"
                            >
                              <XIcon className="stroke-destructive" />
                            </button>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 grid gap-y-8 rounded-lg bg-background p-6">
                <div className="flex flex-col">
                  <h2>Repertuar</h2>
                  <PiecePicker onPieceAdd={addPiece} />
                </div>
              </div>

              {form.formState.isSubmitting ? (
                <Button type="button" size="lg">
                  <Loader2Icon className="animate-spin" />
                </Button>
              ) : (
                <Button type="submit" variant="default" size="lg">
                  Opublikuj projekt
                </Button>
              )}
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
