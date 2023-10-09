import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { Database } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Profile() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userData } = await supabase
    .from("users")
    .select("user_id, first_name, last_name, instrument")
    .eq("user_id", user?.id ?? "")
    .limit(1)
    .single();

  const { user_id, first_name, last_name, instrument } = userData || {};

  return (
    <main className="grid place-content-center">
      <h1>Twoje dane</h1>
      <form className="flex flex-col gap-3" method="post" action="/api/users">
        <Input
          defaultValue={user?.id}
          name="userId"
          className="hidden"
          readOnly
        />
        <Input name="firstName" type="text" defaultValue={first_name ?? ""} />
        <Input name="lastName" type="text" defaultValue={last_name ?? ""} />
        <Select defaultValue={instrument ?? ""} name="instrument">
          <SelectTrigger>Instrument</SelectTrigger>
          <SelectContent>
            <SelectItem value="skrzypce">skrzypce</SelectItem>
            <SelectItem value="altówka">altówka</SelectItem>
            <SelectItem value="wiolonczela">wiolonczela</SelectItem>
            <SelectItem value="kontrabas">kontrabas</SelectItem>
          </SelectContent>
        </Select>

        <Button>Zapisz</Button>
      </form>
    </main>
  );
}
