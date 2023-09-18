"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { v4 as uuid } from "uuid";
import { Button } from "../ui/button";
import { NewProjectFormData } from "@/app/(logged-in)/admin/nowy-projekt/page";
import { ControllerRenderProps } from "react-hook-form";
import { Input } from "../ui/input";
import { pl } from "date-fns/locale";
import { Calendar } from "../ui/calendar";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function NewRehearsalDialog({
  field,
}: {
  field: ControllerRenderProps<NewProjectFormData, "rehearsals">;
}) {
  const [date, setDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState<string>("00:00");
  const [endTime, setEndTime] = useState<string>("00:00");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Dodaj próbę</Button>
      </DialogTrigger>
      <DialogContent className="grid place-items-center">
        <DialogHeader>
          <DialogTitle className="text-center">Nowa próba</DialogTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] pl-3 text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                {date ? (
                  format(date, "PPP", { locale: pl })
                ) : (
                  <span>Wybierz datę</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>

          <p className="text-start">Od</p>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          ></Input>
          <p className="text-start">Do</p>
          <Input
            type="time"
            min={startTime}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          ></Input>
          <p className="text-start">Szczegóły</p>
          <Textarea />
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button
              // onClick={() =>
              //   field.value.push({
              //     id: uuid(),
              //     start: "2024-01-01T00:00:00Z",
              //     end: "2024-01-01T00:00:00Z",
              //     location: "hakunamatata",
              //   })
              // }
              onClick={() => console.log(date, startTime)}
            >
              Dodaj próbę
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
