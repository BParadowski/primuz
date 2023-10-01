"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "../ui/button";

import { useEffect, useRef, useState } from "react";
import { SortableMusician } from "./sortableMusician";
import { Separator } from "../ui/separator";
import { Database } from "@/lib/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import AvailabilityRow from "./availabilityRow";
import { useToast } from "../ui/use-toast";

type Instruments = Database["public"]["Enums"]["instrument"];

export default function EnsamblePicker(props: { projectId: string }) {
  const supabase = createClientComponentClient<Database>();
  const projectMusicians = useRef<string[]>([]);
  const { toast } = useToast();

  // Availability display
  const [availabilityData, setAvailabilityData] = useState<
    | Database["public"]["Views"]["sorted_musicians_availability"]["Row"][]
    | null
    | undefined
  >();
  const [instruments, setInstruments] = useState<Instruments[] | null>();

  useEffect(() => {
    async function getAvailability() {
      const { data } = await supabase
        .from("sorted_musicians_availability")
        .select()
        .eq("project_id", props.projectId);
      setAvailabilityData(data);
    }
    async function getInstruments() {
      //@ts-expect-error
      const { data }: Instruments[] = await supabase.rpc("get_instruments");
      setInstruments(data);
    }
    getAvailability();
    getInstruments();
  }, []);

  function addMusician(instrument: Instruments, fullName: string, id: string) {
    const section = instrument === "skrzypce" ? "skrzypce I" : instrument;

    setEnsamble((state) => {
      if (state[section])
        return { ...state, [section]: [...state[section], fullName] };
      else return { ...state, [section]: [fullName] };
    });

    projectMusicians.current = [...projectMusicians.current, id];
  }

  function deleteMusician(
    instrument: Instruments,
    fullName: string,
    id: string,
  ) {
    if (instrument === "skrzypce") {
      setEnsamble((state) => {
        return {
          ...state,
          "skrzypce I": state["skrzypce I"].filter((name) => name !== fullName),
          "skrzypce II": state["skrzypce II"].filter(
            (name) => name !== fullName,
          ),
        };
      });
    } else {
      setEnsamble((state) => {
        return {
          ...state,
          [instrument]: state[instrument].filter((name) => name !== fullName),
        };
      });
    }

    projectMusicians.current = projectMusicians.current.filter(
      (musicianId) => musicianId !== id,
    );
  }

  // Ensamble + dnd

  const [ensamble, setEnsamble] = useState<{
    [K in string]: string[];
  }>({
    "skrzypce I": [],
    "skrzypce II": [],
    altówka: [],
    wiolonczela: [],
    kontrabas: [],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setEnsamble((state) => {
        const oldIndex = state[active.data.current?.section].indexOf(
          active.id as string,
        );
        const newIndex = state[active.data.current?.section].indexOf(
          over.id as string,
        );

        return {
          ...state,
          [active.data.current?.section]: arrayMove(
            state[active.data.current?.section],
            oldIndex,
            newIndex,
          ),
        };
      });
    }
  }

  function handleViolinTransfer(section: string, name: string) {
    let newSection: string;
    if (section === "skrzypce I") {
      newSection = "skrzypce II";
    } else newSection = "skrzypce I";

    setEnsamble((state) => {
      return {
        ...state,
        [section]: state[section].filter((musician) => musician !== name),
        [newSection]: [...state[newSection], name],
      };
    });
  }

  return (
    <div className="grid gap-x-5 xl:grid-cols-2">
      <div>
        <h2 className="text-center text-lg font-bold"> Dostępność</h2>

        {instruments &&
          availabilityData &&
          instruments.map((instrument) => {
            if (
              !availabilityData.find((data) => data.instrument === instrument)
            )
              return null;
            else
              return (
                <div key={instrument}>
                  <h3 className="font-bold capitalize">{instrument}</h3>
                  <div className="flex flex-col gap-2">
                    {availabilityData
                      .filter((data) => data.instrument === instrument)
                      .map((avData) => {
                        return (
                          <AvailabilityRow
                            instrument={instrument}
                            key={avData.user_id}
                            userId={avData.user_id}
                            availabilityStatus={avData.status}
                            availabilityMessage={avData.message}
                            firstName={avData.first_name}
                            lastName={avData.last_name}
                            onPlusClick={addMusician}
                            onMinusClick={deleteMusician}
                          />
                        );
                      })}
                  </div>
                </div>
              );
          })}
      </div>
      <div>
        <h2 className="text-center text-lg font-bold"> Skład</h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {Object.keys(ensamble).map((sectionName) => {
            return (
              <div className=" p-1" key={sectionName}>
                <h3 className="font-bold capitalize">{sectionName}</h3>
                <Separator className="my-2" />
                <SortableContext
                  items={ensamble[sectionName]}
                  strategy={verticalListSortingStrategy}
                >
                  {ensamble[sectionName].map((name) => (
                    <SortableMusician
                      id={name}
                      section={sectionName}
                      key={name}
                      onArrowClick={handleViolinTransfer}
                    />
                  ))}
                </SortableContext>
              </div>
            );
          })}
        </DndContext>
        <Button
          onClick={async () => {
            await fetch("/api/project", {
              method: "PATCH",
              body: JSON.stringify({
                projectId: props.projectId,
                payload: {
                  musicians: projectMusicians.current,
                  musicians_structure: ensamble,
                },
              }),
            });
            toast({
              title: "Skład został zapisany",
            });
          }}
        >
          Zapisz skład
        </Button>
      </div>
    </div>
  );
}
