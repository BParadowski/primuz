"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { v4 as uuid } from "uuid";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { pl } from "date-fns/locale";
import { Calendar } from "../ui/calendar";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { format } from "date-fns";
import { formatRFC3339 } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { RehearsalData } from "@/app/(logged-in)/admin/nowy-projekt/page";

interface InitialValues extends Omit<RehearsalData, "start" | "end"> {
  date: Date;
  startTime: string;
  endTime: string;
}

interface DialogProps {
  onConfirm: (data: RehearsalData) => void;
  initialValues?: InitialValues;
  dialogTitle: string;
  confirmText: string;
  triggerText: string;
  clearAfterConfirmation?: boolean;
}

export default function NewRehearsalDialog({
  onConfirm,
  initialValues,
  dialogTitle,
  confirmText,
  triggerText,
  clearAfterConfirmation,
}: DialogProps) {
  const [date, setDate] = useState<Date | undefined>(initialValues?.date);
  const [startTime, setStartTime] = useState<string>(
    initialValues?.startTime ?? "00:00",
  );
  const [endTime, setEndTime] = useState<string>(
    initialValues?.endTime ?? "00:00",
  );
  const [location, setLocation] = useState<string>(
    initialValues?.location ?? "",
  );
  const [description, setDescription] = useState<string>(
    initialValues?.description ?? "",
  );

  const isDataCorrect = Boolean(date && startTime < endTime);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="ml-auto">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="grid place-items-center">
        <DialogHeader>
          <DialogTitle className="text-center">{dialogTitle}</DialogTitle>
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
                <CalendarIcon className="ml-auto" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                defaultMonth={date}
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
          <p className="text-start">Miejsce</p>
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          ></Input>
          <p className="text-start">Szczegóły</p>
          <Textarea
            value={description}
            lang="pl"
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button
              disabled={!isDataCorrect}
              onClick={() => {
                const [startHour, startMinute] = startTime.split(":");
                const [endHour, endMinute] = endTime.split(":");

                onConfirm({
                  id: initialValues?.id ?? uuid(),
                  calendarId: initialValues?.calendarId ?? uuid(),
                  start: formatRFC3339(
                    new Date(
                      date!.getFullYear(),
                      date!.getMonth(),
                      date!.getDate(),
                      parseInt(startHour),
                      parseInt(startMinute),
                    ),
                  ),
                  end: formatRFC3339(
                    new Date(
                      date!.getFullYear(),
                      date!.getMonth(),
                      date!.getDate(),
                      parseInt(endHour),
                      parseInt(endMinute),
                    ),
                  ),
                  location: location,
                  description: description,
                });

                if (clearAfterConfirmation) {
                  setDescription("");
                  setLocation("");
                }
              }}
            >
              {confirmText}
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
