import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Jost } from "next/font/google";
import { cn } from "@/lib/utils";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700"] });

const APP_NAME = "Primuz";
const APP_DEFAULT_TITLE = "Primuz";
const APP_TITLE_TEMPLATE = "%s - Primuz";
const APP_DESCRIPTION = "Aplikacja wewnętrzna orkiestry kameralnej Primuz";

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://primuz.vercel.app"),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className="scroll-smooth">
      <body
        className={cn(
          jost.className,
          "grid min-h-screen tracking-wide text-foreground",
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
