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
import { Skeleton } from "../ui/skeleton";
import { sortByInstrument } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

type Instruments = Database["public"]["Enums"]["instrument"];

export default function EnsamblePicker(props: {
  projectId: string;
  projectName: string;
}) {
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
  const [ensamble, setEnsamble] = useState<{
    [K in string]: string[];
  }>({
    "skrzypce I": [],
    "skrzypce II": [],
    altówka: [],
    wiolonczela: [],
    kontrabas: [],
  });
  const [ensambleDled, setEnsambleDled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getAvailability() {
      // const { data } = await supabase
      //   .from("sorted_musicians_availability")
      //   .select()
      //   .eq("project_id", props.projectId);
      const { data } = await supabase
        .from("availability")
        .select(
          "status, message, project_id, user_id, users!inner(instrument, first_name, last_name)",
        )
        .eq("project_id", props.projectId)
        .order("users(first_name)");

      const flattenedData = data?.map((availabilityAndUserData) => {
        const {
          message,
          status,
          project_id,
          user_id,
          users: { instrument, first_name, last_name },
        } = availabilityAndUserData;
        return {
          message,
          status,
          project_id,
          user_id,
          instrument,
          first_name,
          last_name,
        };
      });

      setAvailabilityData(flattenedData);
    }
    async function getInstruments() {
      //@ts-expect-error
      const { data }: Instruments[] = await supabase.rpc("get_instruments");
      setInstruments(data);
    }
    async function getEnsamble() {
      const { data } = await supabase
        .from("projects")
        .select("musicians, musicians_structure")
        .eq("id", props.projectId)
        .single();

      if (data?.musicians_structure && data?.musicians) {
        setEnsamble(
          data.musicians_structure as {
            [K in string]: string[];
          },
        );

        projectMusicians.current = data.musicians;
      }
      setEnsambleDled(true);
    }
    getEnsamble();
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
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
    <div className="grid gap-x-5 gap-y-5 xl:grid-cols-2">
      <div>
        <h2 className="text-center text-lg font-bold"> Dostępność</h2>

        {instruments && availabilityData && ensambleDled ? (
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
                            initiallySelected={
                              (ensamble[instrument] &&
                                ensamble[instrument].includes(
                                  `${avData.first_name} ${avData.last_name}`,
                                )) ||
                              (ensamble["skrzypce I"] &&
                                ensamble["skrzypce I"].includes(
                                  `${avData.first_name} ${avData.last_name}`,
                                )) ||
                              (ensamble["skrzypce II"] &&
                                ensamble["skrzypce II"].includes(
                                  `${avData.first_name} ${avData.last_name}`,
                                ))
                            }
                          />
                        );
                      })}
                  </div>
                </div>
              );
          })
        ) : (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-full rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-full rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-full rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-full rounded-full" />
          </div>
        )}
      </div>
      <div className="grid">
        <h2 className="text-center text-lg font-bold"> Skład</h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {sortByInstrument(Object.keys(ensamble)).map((sectionName) => {
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
        {isSubmitting ? (
          <Button type="button" size="lg" className="place-self-center">
            <Loader2Icon className="animate-spin" />
          </Button>
        ) : (
          <Button
            type="button"
            size="lg"
            className="place-self-center"
            onClick={async () => {
              setIsSubmitting(true);
              const { data: initialMusiciansData } = await supabase
                .from("projects")
                .select("musicians")
                .eq("id", props.projectId)
                .single();
              const initialMusicians = initialMusiciansData?.musicians;

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
              router.refresh();

              if (!initialMusicians) {
                await fetch("/api/notifications", {
                  method: "POST",
                  body: JSON.stringify({
                    targets: "everyone",
                    message: `Skład do projektu ${props.projectName} został opublikowany.`,
                    internalName: `${props.projectName} chosen musicians message`,
                    projectId: props.projectId,
                  }),
                });
              } else {
                const addedMusicians = projectMusicians.current.filter(
                  (musician) => !initialMusicians.includes(musician),
                );
                console.log(addedMusicians);
                const removedMusicians = initialMusicians.filter(
                  (musician) => !projectMusicians.current.includes(musician),
                );
                console.log(removedMusicians);

                if (addedMusicians.length > 0) {
                  await fetch("/api/notifications", {
                    method: "POST",
                    body: JSON.stringify({
                      targets: addedMusicians,
                      message: `Dodano Cię do składu projektu ${props.projectName}.`,
                      internalName: `${props.projectName} musician added message`,
                      projectId: props.projectId,
                    }),
                  });
                }

                if (removedMusicians.length > 0) {
                  await fetch("/api/notifications", {
                    method: "POST",
                    body: JSON.stringify({
                      targets: removedMusicians,
                      message: `Usunięto Cię ze składu projektu ${props.projectName}.`,
                      internalName: `${props.projectName} musician removed message`,
                      projectId: props.projectId,
                    }),
                  });
                }
              }
              setIsSubmitting(false);
            }}
          >
            Zapisz skład
          </Button>
        )}
        <p className="mt-4 text-center text-muted-foreground">
          Przy pierwszym wyborze składu cała orkiestra otrzymuje powiadomienie o
          publikacji. Przy kolejnych edycjach tylko osoby dodane/usunięte.
        </p>
      </div>
    </div>
  );
}
