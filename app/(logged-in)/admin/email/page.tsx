"use client";

import InfoEmail from "@/components/emails/infoEmail";
import { render } from "@react-email/components";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/supabase";

export default function EmailPage() {
  const supabase = createClientComponentClient<Database>();
  const [text, setText] = useState("");
  const [emailText, setEmailText] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setEmailText(text);
    }, 500);

    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <main className="flex flex-col">
      <div className="container grid grid-cols-2">
        <Textarea onChange={(e) => setText(e.target.value)} value={text} />
        <iframe
          srcDoc={render(<InfoEmail text={emailText} />, { pretty: true })}
          className="col-start-2 col-end-3  h-screen w-full"
        />
      </div>
    </main>
  );
}
