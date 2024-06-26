import Link from "next/link";
import {
  FilePlus2Icon,
  LayoutDashboardIcon,
  Music4Icon,
  CalendarCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-rows-[auto_1fr]">
      <div className="relative mt-[--header-height] bg-primary text-primary-foreground md:mt-0">
        <div className="container">
          <ul className="flex flex-wrap items-center justify-center gap-6 py-3">
            <li>
              <Button asChild variant="ghost" className="group font-bold">
                <Link
                  href="/admin/projekty"
                  className="flex items-center gap-2"
                >
                  <LayoutDashboardIcon
                    size={28}
                    className="stroke-primary-foreground transition-colors group-hover:stroke-primary"
                  />
                  <p className="hidden md:block">Projekty</p>
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
                    size={28}
                    className="stroke-primary-foreground transition-colors group-hover:stroke-primary"
                  />
                  <p className="hidden md:block"> Nowy Projekt</p>
                </Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="ghost" className="group font-bold">
                <Link href="/admin/nuty" className="flex items-center gap-2">
                  <Music4Icon
                    size={28}
                    className="stroke-primary-foreground transition-colors group-hover:stroke-primary"
                  />
                  <p className="hidden md:block">Nuty</p>
                </Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="ghost" className="group font-bold">
                <Link
                  href="/admin/calendar"
                  className="flex items-center gap-2"
                >
                  <CalendarCog
                    size={28}
                    className="stroke-primary-foreground transition-colors group-hover:stroke-primary"
                  />
                  <p className="hidden md:block">Kalendarz google</p>
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
