import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import Link from "next/link";
import AvailabilityIcon from "../project/availabilityIcon";
import AvailabilityStatusDescription from "../project/availabilityStatusDescription";
import pl from "date-fns/locale/pl";
import { Tables } from "@/lib/supabase";

type ProjectNecessaryData = Pick<
  Tables<"projects">,
  "id" | "location" | "date" | "name"
>;
type AvailabilityNecessaryData = Pick<
  Tables<"availability">,
  "status" | "message"
>;

interface ProjectCardProps {
  projectData: ProjectNecessaryData;
  availabilityData: AvailabilityNecessaryData;
}

export default function ProjectCard({
  projectData,
  availabilityData,
}: ProjectCardProps) {
  const { id, name, date, location } = projectData;
  const { status, message } = availabilityData;
  return (
    <Link
      href={`/projekty/${id}`}
      key={id}
      className="rounded-md border border-solid border-border px-6 py-4 hover:bg-stone-50"
    >
      <h2 className="text-md font-bold sm:text-xl">{name}</h2>
      <p>
        {formatInTimeZone(new Date(date), "Europe/Warsaw", "PPP (EEEE)", {
          locale: pl,
        })}
      </p>
      <p>{location}</p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <AvailabilityIcon status={status} selected />
        <AvailabilityStatusDescription status={status} />
        {message ? (
          <p className="italic text-muted-foreground">({message})</p>
        ) : null}
      </div>
    </Link>
  );
}
