"use client";

import NewRehearsalDialog from "@/components/admin/newRehearsalDialog";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { Database } from "@/lib/supabase";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import { Button } from "../ui/button";

export default function EditRehearsalDialog({
  projectId,
  rehearsal,
}: {
  projectId: string;
  rehearsal: Database["public"]["Tables"]["rehearsals"]["Row"];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);

  async function editRehearsal(data: {
    id: string;
    description: string;
    location: string;
    calendarId: string;
    start: string;
    end: string;
  }) {
    setEditing(true);
    const res = await fetch("/api/rehearsals", {
      method: "PATCH",
      body: JSON.stringify({
        rehearsalId: data.id,
        projectId: projectId,
        calendarId: data.calendarId,
        payload: {
          description: data.description,
          start_datetime: data.start,
          end_datetime: data.end,
          location: data.location,
        },
      }),
    }).then((res) => res.json());
    if (res.success) toast({ description: "Próba została edytowana." });
    else
      toast({
        description: "Wystąpił problem przy edytowniu próby.",
        variant: "destructive",
      });
    router.refresh();
    setEditing(false);
  }

  const startDate = new Date(rehearsal.start_datetime);
  const endDate = new Date(rehearsal.end_datetime);

  return (
    <div>
      <NewRehearsalDialog
        onConfirm={editRehearsal}
        trigger={
          <Button type="button" variant="outline">
            Edytuj
          </Button>
        }
        dialogTitle="Edytuj Próbę"
        confirmText="Zapisz zmiany"
        initialValues={{
          id: rehearsal.id,
          calendarId: rehearsal.google_calendar_id,
          location: rehearsal.location ?? "",
          description: rehearsal.description ?? "",
          date: startDate,
          startTime: formatInTimeZone(startDate, "Europe/Warsaw", "HH:mm"),
          endTime: formatInTimeZone(endDate, "Europe/Warsaw", "HH:mm"),
        }}
        clearAfterConfirmation
      />

      {editing && <Loader2Icon className="ml-10 inline-block animate-spin" />}
    </div>
  );
}
