"use client";

import { useState } from "react";
import { Textarea } from "../ui/textarea";
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
import { useToast } from "../ui/use-toast";

type TargetOptions = "everyone" | "musicians" | "nobody";

export default function Announcer(props: {
  projectId: string;
  projectMusicians: string[] | null;
}) {
  const [text, setText] = useState("");
  const [targets, setTargets] = useState<TargetOptions>(
    props.projectMusicians ? "musicians" : "everyone",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  return (
    <div className="grid">
      <Textarea value={text} onChange={(e) => setText(e.target.value)} />

      <h2 className="my-2">Wyślij powiadomienie do:</h2>
      <Select
        defaultValue={props.projectMusicians ? "musicians" : "everyone"}
        onValueChange={(e: TargetOptions) => setTargets(e)}
      >
        <SelectTrigger className="w-80">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"everyone" as TargetOptions}>
            Wszystkich w orkiestrze
          </SelectItem>
          <SelectItem value={"musicians" as TargetOptions}>
            Składu projektu
          </SelectItem>
          <SelectItem value={"nobody" as TargetOptions}>Nikogo</SelectItem>
        </SelectContent>
      </Select>

      {isSubmitting ? (
        <Button type="button" size="lg" className="my-4 place-self-center">
          <Loader2Icon className="animate-spin" />
        </Button>
      ) : (
        <Button
          className="my-4 place-self-center"
          type="button"
          size="lg"
          onClick={async () => {
            setIsSubmitting(true);
            await supabase
              .from("announcements")
              .insert({ description: text, project_id: props.projectId });

            let notificationTargets;
            if (targets === "everyone") notificationTargets = "everyone";
            else if (targets === "musicians")
              notificationTargets = props.projectMusicians;
            else if (targets === "nobody") notificationTargets = [];

            await fetch("/api/notifications", {
              method: "POST",
              body: JSON.stringify({
                targets: notificationTargets,
                message: text,
                internalName: `${props.projectId} announcement`,
                projectId: props.projectId,
              }),
            });
            toast({
              description: "Ogłoszenie zostało dodane.",
            });
            setIsSubmitting(false);
          }}
        >
          Dodaj ogłoszenie
        </Button>
      )}
    </div>
  );
}
