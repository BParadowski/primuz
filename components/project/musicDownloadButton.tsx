import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/supabase";
import { cookies } from "next/headers";
import { Button } from "../ui/button";

interface DownloadProps {
  filePath: string;
  linkName: string;
  pieceName: string;
}

export function DownloadButton(props: DownloadProps) {
  const supabase = createServerComponentClient<Database>({ cookies });

  // async function downloadMusic() {
  //   const { data } = supabase.storage
  //     .from("sheet_music")
  //     .getPublicUrl("Przyszli-o-zmroku/Przyszli-o-zmroku-vln-1.pdf", {
  //       download: true,
  //     });
  //   const anchor = document.createElement("a");
  //   anchor.href = data.publicUrl;
  //   anchor.click();
  //   anchor.remove();
  // }

  const { data } = supabase.storage
    .from("sheet_music")
    .getPublicUrl(props.filePath, {
      download: `${props.pieceName} - ${props.linkName}.pdf`,
    });

  return (
    <Button asChild>
      <a href={data.publicUrl} className="capitalize">
        {props.linkName}
      </a>
    </Button>
  );
}
