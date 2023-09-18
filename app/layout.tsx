import "./globals.css";
import type { Metadata } from "next";
import { Jost } from "next/font/google";

const jost = Jost({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Primuz app",
  description: "Aplikacja wewnętrzna Primuz Chamber Orchestra",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jost.className}tracking-wide text-foreground`}>
        {children}
      </body>
    </html>
  );
}
