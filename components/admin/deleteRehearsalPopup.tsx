"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { XIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useState } from "react";

export default function DeleteRehearsalPopup(props: {
  projectId: string;
  id: string;
  calendarId: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  async function deleteRehearsal() {
    setDeleting(true);
    await fetch("/api/rehearsals", {
      method: "DELETE",
      body: JSON.stringify({
        projectId: props.projectId,
        id: props.id,
        calendarId: props.calendarId,
      }),
    });
    toast({ description: "Próba została usunięta." });
    router.refresh();
  }
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          {deleting ? (
            <Loader2Icon className="pointer-events-none animate-spin" />
          ) : (
            <XIcon className="cursor-pointer stroke-destructive" />
          )}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Czy na pewno chcesz usunąć próbę?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteRehearsal()}>
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
