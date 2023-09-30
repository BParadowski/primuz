import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/supabase";
import { cookies } from "next/headers";
import { replacePolishLetters } from "@/lib/utils";
import { Button } from "../ui/button";

interface DownloadProps {
  pieceName: string;
  fileName: string;
  linkName: string;
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
    .getPublicUrl(
      `${replacePolishLetters(props.pieceName.replace(/\s/g, "-"))}/${
        props.fileName
      }`,
      {
        download: true,
      },
    );

  return (
    <Button asChild>
      <a href={data.publicUrl} className="ml-2 capitalize">
        {props.linkName}
      </a>
    </Button>
  );
}
