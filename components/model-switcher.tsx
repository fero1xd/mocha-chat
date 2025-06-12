import { useModel } from "@/hooks/use-model";
import { MODELS, ModelType } from "@/lib/models";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Gemini } from "./icons/gemini";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function ModelSwitcher() {
  const [open, setOpen] = useState(false);
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
