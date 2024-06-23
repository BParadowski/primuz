import * as z from "zod";

export const formSchema = z.object({
  calendarId: z.string().email("Sprawdź poprawność id."),
});

export type SchemaType = z.infer<typeof formSchema>;
