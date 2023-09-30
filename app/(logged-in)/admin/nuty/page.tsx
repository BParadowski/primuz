"use client";

import { SheetMusicInput } from "@/components/admin/musicUpload";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SheetMusic() {
  const supabase = createClientComponentClient();
  const [name, setName] = useState("");
  const router = useRouter();
  const [composer, setComposer] = useState("");

  return (
    <main>
      <h1>Nowy utwór</h1>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></Input>
      <p>Kompozytor</p>
      <Input
        type="text"
        value={composer}
        onChange={(e) => setComposer(e.target.value)}
      ></Input>
      <Button
        onClick={async () => {
          const { data } = await supabase
            .from("pieces")
            .insert({
              name: name,
              parts: {},
              composer: composer,
            })
            .select("id")
            .single();
          router.push(`nuty/${data?.id}`);
        }}
      >
        Utwórz utwór
      </Button>
    </main>
  );
}
