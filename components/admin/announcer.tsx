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
import { Database } from "@/lib/supabase";

type TargetOptions = "everyone" | "musicians" | "nobody" | "undeclared";

export default function Announcer(props: {
  projectId: string;
  projectMusicians: string[] | null;
}) {
  const [text, setText] = useState("");
  const [targets, setTargets] = useState<TargetOptions>(
    props.projectMusicians ? "musicians" : "everyone",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();

  return (
    <div className="grid gap-2">
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
          <SelectItem value={"undeclared" as TargetOptions}>
            Niezaznaczonych (brak info)
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

            let notificationTargets: string[] | "everyone" = [];

            if (targets === "everyone") notificationTargets = "everyone";
            else if (targets === "musicians")
              notificationTargets = props.projectMusicians ?? [];
            else if (targets === "nobody") notificationTargets = [];
            else if (targets === "undeclared") {
              notificationTargets = await supabase
                .from("availability")
                .select("user_id")
                .eq("project_id", props.projectId)
                .eq("status", "undeclared")
                .then(
                  ({ data }) =>
                    data?.map((userIdObject) => userIdObject.user_id) ?? [],
                );
            }

            console.log(notificationTargets);

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
            setText("");
            setIsSubmitting(false);
          }}
        >
          Dodaj ogłoszenie
        </Button>
      )}
    </div>
  );
}
