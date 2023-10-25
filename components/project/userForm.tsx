"use client";

import { Database } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

const formSchema = z.object({
  first_name: z.string().min(1, {
    message: "Imię nie może być puste.",
  }),
  last_name: z.string().min(1, {
    message: "Nazwisko nie może być puste.",
  }),
  instrument: z.string(),
});

export default function UserDataForm(props: {
  userId: string;
  firstName: string;
  lastName: string;
  instrument: Database["public"]["Enums"]["instrument"];
  allInstruments: Database["public"]["Enums"]["instrument"][];
}) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: props.firstName,
      last_name: props.lastName,
      instrument: props.instrument,
    },
  });

  return (
    <div>
      <Form {...form}>
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit(
            async ({ first_name, last_name, instrument }) => {
              const typedInstrument =
                instrument as Database["public"]["Enums"]["instrument"];
              await supabase
                .from("users")
                .update({ first_name, last_name, instrument: typedInstrument })
                .eq("user_id", props.userId);

              router.refresh();
              toast({ description: "Zmiany zostały zapisane." });
            },
          )}
        >
          <p className="text-sm text-muted-foreground">
            (W przyszłości pojawi się tu więcej, bardziej użytecznych opcji)
          </p>
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imię</FormLabel>
                <FormControl>
                  <Input placeholder="Jan..." {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwisko</FormLabel>
                <FormControl>
                  <Input placeholder="Kowalski..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instrument"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instrument</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    ref={(ref) => {
                      if (!ref) return;
                      ref.ontouchstart = (e) => e.preventDefault();
                    }}
                  >
                    {props.allInstruments.map((instrument) => {
                      return (
                        <SelectItem key={instrument} value={instrument}>
                          {instrument}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
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
