import Link from "next/link";
import { FilePlus2Icon, LayoutDashboardIcon, Music4Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="relative bg-primary text-primary-foreground">
        <div className="container">
          <ul className="flex flex-wrap items-center justify-center gap-6 py-3">
            <li>
              <Button asChild variant="ghost" className="group font-bold">
                <Link
                  href="/admin/projekty"
                  className="flex items-center gap-2"
                >
                  <LayoutDashboardIcon
                    size={36}
                    className="stroke-primary-foreground transition-colors group-hover:stroke-primary"
                  />
                  <p>Projekty</p>
                </Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="ghost" className="group font-bold">
                <Link
                  href="/admin/nowy-projekt"
                  className="flex items-center gap-2"
                >
                  <FilePlus2Icon
                    size={36}
                    className="stroke-primary-foreground transition-colors group-hover:stroke-primary"
                  />
                  <p> Nowy Projekt</p>
                </Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="ghost" className="group font-bold">
                <Link
                  href="/admin/nowy-projekt"
                  className="flex items-center gap-2"
                >
                  <Music4Icon
                    size={36}
                    className="stroke-primary-foreground transition-colors group-hover:stroke-primary"
                  />
                  <p>Nuty</p>
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      </div>

      {children}
    </div>
  );
}
