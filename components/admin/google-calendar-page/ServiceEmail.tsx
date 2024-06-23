"use client";

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function ServiceEmail() {
  return (
    <div className="flex items-center gap-2 pt-4">
      <TooltipProvider>
        <Card>
          <CardContent className="flex items-center gap-2 p-4 py-4 md:p-6">
            <span className="break-all">
              primuz-calendar@primuz.iam.gserviceaccount.com
            </span>{" "}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "primuz-calendar@primuz.iam.gserviceaccount.com",
                    );
                    toast({
                      title: "Skopiowano do schowka",
                      variant: "default",
                    });
                  }}
                >
                  <CopyIcon />

                  <span className="sr-only">Copy to clipboard</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Skopiuj do schowka</TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>
      </TooltipProvider>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}
