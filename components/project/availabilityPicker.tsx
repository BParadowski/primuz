"use client";

import { Database } from "@/lib/supabase";
import { useState } from "react";
import AvailabilityIcon from "./availabilityIcon";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import AvailabilityStatusDescription from "./availabilityStatusDescription";
import { Loader2Icon } from "lucide-react";

type Status = Database["public"]["Enums"]["availability_status"];

interface PickerProps {
  initialStatus: Status;
  initialMessage: string;
  userId: string;
  projectId: string;
}

export default function AvailabilityPicker({
  initialStatus,
  initialMessage,
  userId,
  projectId,
}: PickerProps) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [message, setMessage] = useState<string>(initialMessage);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleSubmit() {
    setIsUpdating(true);
    await fetch("/api/availability", {
      method: "put",
      body: JSON.stringify({ status, message, userId, projectId }),
    });
    setIsUpdating(false);
  }

  return (
    <div>
      <ul className="flex gap-3 py-3">
        <li onClick={() => setStatus("available")}>
          <AvailabilityIcon
            status="available"
            selected={status === "available"}
          />
        </li>
        <li onClick={() => setStatus("maybe")}>
          <AvailabilityIcon status="maybe" selected={status === "maybe"} />
        </li>
        <li onClick={() => setStatus("unavailable")}>
          <AvailabilityIcon
            status="unavailable"
            selected={status === "unavailable"}
          />
        </li>
        <li onClick={() => setStatus("undeclared")}>
          <AvailabilityIcon
            status="undeclared"
            selected={status === "undeclared"}
          />
        </li>
        <AvailabilityStatusDescription status={status} />
      </ul>
      <Label htmlFor="availability-message">Komentarz do dostępności:</Label>
      <Input
        className="my-2"
        id="availability-message"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button variant="default" type="button" onClick={() => handleSubmit()}>
        {isUpdating ? <Loader2Icon className="animate-spin" /> : "Zapisz"}
      </Button>
    </div>
  );
}
