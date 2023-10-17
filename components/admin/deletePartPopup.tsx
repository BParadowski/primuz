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
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { XIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/supabase";

export default function DeletePartPopup(props: {
  id: string;
  partPath: string;
}) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  async function deleteRehearsal() {
    setDeleting(true);
    const { error: storageError } = await supabase.storage
      .from("sheet_music")
      .remove([props.partPath]);

    if (!storageError) await supabase.from("parts").delete().eq("id", props.id);
    else
      toast({
        description: "W trakcie usuwania wystąpił błąd...",
        variant: "destructive",
      });

    router.refresh();
    setDeleting(false);
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
              Czy na pewno chcesz usunąć partię?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {`Nazwa pliku: ${props.partPath.split("/")[1]}`}
            </AlertDialogDescription>
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
