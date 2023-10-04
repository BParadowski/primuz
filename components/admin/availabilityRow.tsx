"use client";

import { useState } from "react";
import { Database } from "@/lib/supabase";
import AvailabilityIcon from "../project/availabilityIcon";
import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";

type Instruments = Database["public"]["Enums"]["instrument"];

interface RowProps {
  userId: string;
  instrument: Instruments;
  firstName: string | null;
  lastName: string | null;
  availabilityStatus: Database["public"]["Enums"]["availability_status"];
  availabilityMessage: string | null;
  initiallySelected: boolean;
  onPlusClick: (instrument: Instruments, fullName: string, id: string) => void;
  onMinusClick: (instrument: Instruments, fullName: string, id: string) => void;
}

export default function AvailabilityRow({
  userId,
  firstName,
  instrument,
  lastName,
  availabilityStatus,
  availabilityMessage,
  initiallySelected,
  onPlusClick,
  onMinusClick,
}: RowProps) {
  const [selected, setSelected] = useState(initiallySelected);

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-4 p-1",
          selected && "bg-amber-500",
        )}
      >
        <p>{`${firstName} ${lastName}`}</p>
        <div className="ml-auto">
          <AvailabilityIcon status={availabilityStatus} selected />
        </div>
        {selected ? (
          <button
            className="rounded-sm border-2 border-solid border-pink-400 bg-white"
            onClick={() => {
              setSelected(false);
              onMinusClick(instrument, `${firstName} ${lastName}`, userId);
            }}
          >
            <MinusIcon height={20} width={20} />
          </button>
        ) : (
          <button
            className="rounded-sm border-2 border-solid border-pink-400 bg-white"
            onClick={() => {
              setSelected(true);
              onPlusClick(instrument, `${firstName} ${lastName}`, userId);
            }}
          >
            <PlusIcon height={20} width={20} />
          </button>
        )}
      </div>
      <p className="text-sm text-foreground">{availabilityMessage}</p>
    </div>
  );
}
