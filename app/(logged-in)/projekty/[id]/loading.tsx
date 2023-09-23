import { Loader2Icon } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <main className="grid bg-primary">
      <div className="container mt-4 grid">
        <div className="grid place-content-center gap-3 rounded-lg bg-background px-6 py-4">
          <Loader2Icon
            width={100}
            height={100}
            className="animate-spin stroke-stone-500"
          />
        </div>
      </div>
    </main>
  );
}
