import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container grid grid-flow-col grid-cols-[auto_1fr]">
      <div>
        <Link href="/admin/projekty">Projekty</Link>
      </div>
      {children}
    </div>
  );
}
