import * as z from "zod";

export const formSchema = z.object({
  calendarId: z.string().email("Sprawdź poprawność identyfikatora"),
});

export type SchemaType = z.infer<typeof formSchema>;
