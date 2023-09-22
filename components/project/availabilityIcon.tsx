import { Database } from "@/lib/supabase";
import {
  CheckIcon,
  XIcon,
  MinusIcon,
  LucideIcon,
  AsteriskIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IconProps {
  status: Database["public"]["Enums"]["availability_status"];
  selected?: boolean;
  onClick?: () => void;
}

type StatusIcons = {
  [K in Database["public"]["Enums"]["availability_status"]]: LucideIcon;
};

const statusIcons: StatusIcons = {
  available: CheckIcon,
  unavailable: XIcon,
  undeclared: MinusIcon,
  maybe: AsteriskIcon,
};

export default function AvailabilityIcon({
  status,
  selected,
  onClick,
}: IconProps) {
  const Icon = statusIcons[status];
  let bgStyling;
  switch (status) {
    case "available":
      bgStyling = "bg-lime-200";
      break;
    case "unavailable":
      bgStyling = "bg-rose-200";
      break;
    case "maybe":
      bgStyling = "bg-amber-200";
      break;
    case "undeclared":
      bgStyling = "bg-stone-200";
      break;
  }
  return (
    <Icon
      className={cn(
        "rounded-sm border border-solid border-muted-foreground",
        selected && bgStyling,
      )}
      height={28}
      width={28}
    />
  );
}
