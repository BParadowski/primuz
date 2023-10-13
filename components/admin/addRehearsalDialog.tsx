"use client";

import { RehearsalData } from "@/app/(logged-in)/admin/nowy-projekt/page";
import { v4 as uuid } from "uuid";
import NewRehearsalDialog from "@/components/admin/newRehearsalDialog";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { Button } from "../ui/button";

export default function AddRehearsalDialog(props: { projectId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);

  async function newRehearsal(data: RehearsalData) {
    setAdding(true);
    const res = await fetch("/api/rehearsals", {
      method: "POST",
      body: JSON.stringify({
        project_id: props.projectId,
        description: data.description,
        google_calendar_id: uuid().replaceAll("-", ""),
        start_datetime: data.start,
        end_datetime: data.end,
        location: data.location,
      }),
    }).then((res) => res.json());
    if (res.success) toast({ description: "Próba została dodana." });
    else
      toast({
        description: "Wystąpił problem przy dodawaniu próby.",
        variant: "destructive",
      });
    router.refresh();
    setAdding(false);
  }
  return (
    <div>
      <NewRehearsalDialog
        onConfirm={newRehearsal}
        trigger={<Button>Dodaj Próbę</Button>}
        dialogTitle="Nowa Próba"
        confirmText="Dodaj Próbę"
        clearAfterConfirmation
      />

      {adding && <Loader2Icon className="ml-10 inline-block animate-spin" />}
    </div>
  );
}
