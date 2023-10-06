"use client";

import formatRelative from "date-fns/formatRelative";
import pl from "date-fns/locale/pl";

export default function ClientDate(props: { date: Date }) {
  return (
    <p className="ml-auto text-sm italic opacity-60">
      {formatRelative(props.date, new Date(), {
        locale: pl,
      })}
    </p>
  );
}
