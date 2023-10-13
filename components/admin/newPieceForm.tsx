"use client";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Utwór musi mieć tytuł.",
  }),
  composer: z.string().min(1, { message: "Utwór musi mieć kompozytora." }),
});

export default function NewPieceForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", composer: "" },
  });

  return (
    <div>
      <h1 className="text-center text-xl font-bold">Nowy utwór</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (formData) => {
            const { data } = await supabase
              .from("pieces")
              .insert({
                name: formData.name,
                parts: {},
                composer: formData.composer,
              })
              .select("id")
              .single();
            router.push(`nuty/${data?.id}`);
          })}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tytuł</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="composer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kompozytor</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
              Dodaj utwór
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
