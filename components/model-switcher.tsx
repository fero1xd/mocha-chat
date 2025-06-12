import { Check, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

export function ModelSwitcher() {
  const [open, setOpen] = React.useState(false);
  const { model, setModel } = useModel();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          {MODELS.find((m) => model === m)}
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[600px]" align="start">
        <Command defaultValue={model}>
          <CommandInput placeholder="Search models..." className="h-9" />

          <div className="py-2 px-4">
            <Card className="w-full bg-secondary">
              <CardHeader>
                <CardTitle>Unlock all models + higher limits</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between w-full">
                <h1 className="font-bold text-xl">
                  <span className="text-primary text-2xl font-extrabold">
                    $8
                  </span>
                  /month
                </h1>
                <Button>Upgrade Now</Button>
              </CardContent>
            </Card>
          </div>

          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {MODELS.map((m) => (
                <CommandItem
                  key={m}
                  value={m}
                  onSelect={(currentValue) => {
                    console.log(currentValue);
                    setModel(currentValue as ModelType);
                    setOpen(false);
                  }}
                  className="py-4"
                >
                  {m.toLowerCase().startsWith("gemini") ? <Gemini /> : null}
                  {m}
                  <Check
                    className={cn(
                      "ml-auto",
                      model === m ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

import * as React from "react";
import type { SVGProps } from "react";
import { MODELS, ModelType } from "@/lib/models";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useModel } from "@/hooks/use-model";
const Gemini = (props: SVGProps<SVGSVGElement>) => (
  <svg
    height="1em"
    style={{
      flex: "none",
      lineHeight: 1,
    }}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    {...props}
  >
    <title>{"Gemini"}</title>
    <defs>
      <linearGradient
        id="lobe-icons-gemini-fill"
        x1="0%"
        x2="68.73%"
        y1="100%"
        y2="30.395%"
      >
        <stop offset="0%" stopColor="#1C7DFF" />
        <stop offset="52.021%" stopColor="#1C69FF" />
        <stop offset="100%" stopColor="#F0DCD6" />
      </linearGradient>
    </defs>
    <path
      d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
      fill="url(#lobe-icons-gemini-fill)"
      fillRule="nonzero"
    />
  </svg>
);
