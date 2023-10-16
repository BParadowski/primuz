"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { UniqueIdentifier } from "@dnd-kit/core";
import { CornerLeftDownIcon, CornerRightUpIcon } from "lucide-react";

export function SortableMusician(props: {
  id: UniqueIdentifier;
  section: string;
  onArrowClick?: (section: string, name: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.id,
    data: { section: props.section },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        " flex touch-manipulation rounded-sm p-2",
        isDragging && "z-30 bg-stone-100",
      )}
    >
      <p {...attributes} {...listeners} className="w-full">
        {props.id}
      </p>
      {props.section === "skrzypce I" && (
        <button
          className="ml-auto bg-white "
          onClick={() => {
            if (props.onArrowClick)
              props.onArrowClick(props.section, props.id as string);
          }}
        >
          <CornerLeftDownIcon />
        </button>
      )}
      {props.section === "skrzypce II" && (
        <button
          className="ml-auto bg-white "
          onClick={() => {
            if (props.onArrowClick)
              props.onArrowClick(props.section, props.id as string);
          }}
        >
          <CornerRightUpIcon />
        </button>
      )}
    </div>
  );
}
