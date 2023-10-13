import { Loader2Icon } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <main className="grid place-items-center bg-background ">
      <Loader2Icon
        width={100}
        height={100}
        className="animate-spin stroke-stone-500"
      />
    </main>
  );
}
