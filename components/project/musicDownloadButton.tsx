"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/supabase";
import { Button } from "../ui/button";
import dynamic from "next/dynamic";

interface DownloadProps {
  filePath: string;
  linkName: string;
  pieceName: string;
}

function DownloadButton(props: DownloadProps) {
  const supabase = createClientComponentClient<Database>();

  const isIpad =
    /Macintosh/.test(navigator.userAgent) && "ontouchend" in document;

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
      download: isIpad
        ? `${props.pieceName} - ${props.linkName}.pdf`
        : undefined,
    });

  return (
    <Button asChild>
      <a href={data.publicUrl} className="capitalize" target="_blank">
        {props.linkName}
      </a>
    </Button>
  );
}

export default dynamic(() => Promise.resolve(DownloadButton), { ssr: false });
