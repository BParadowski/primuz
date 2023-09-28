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

import { useState } from "react";
import { SortableMusician } from "./sortableMusician";
import { Separator } from "../ui/separator";

export default function EnsamblePicker() {
  const [ensamble, setEnsamble] = useState<{
    [K in string]: string[];
  }>({
    "skrzypce I": ["Julia Iskrzycka", "Dominika Janczewska", "werona"],
    "skrzypce II": [],
    altówka: ["zanzibar", "makarena"],
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
    <div>
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
      <button onClick={() => console.log(ensamble)}>Bunga</button>
    </div>
  );
}
