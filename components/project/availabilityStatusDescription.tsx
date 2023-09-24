import { Database } from "@/lib/supabase";

type Status = Database["public"]["Enums"]["availability_status"];

export default function AvailabilityStatusDescription({
  status,
}: {
  status: Status;
}) {
  let statusDescription;
  switch (status) {
    case "available":
      statusDescription = "Dostępny/a";
      break;
    case "unavailable":
      statusDescription = "Niedostępny/a";
      break;
    case "maybe":
      statusDescription = "Może";
      break;
    case "undeclared":
      statusDescription = "Dostępność niezadeklarowana";
      break;
  }

  return <p className="text-sm">{statusDescription}</p>;
}
