import { MODELS, ModelType } from "@/lib/models";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Gemini } from "./icons/gemini";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useModel } from "@/stores/model";
import OpenAI from "./icons/openai";

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

          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup>
              {MODELS.map((m) => (
                <CommandItem
                  key={m}
                  value={m}
                  onSelect={(currentValue) => {
                    setModel(currentValue as ModelType);
                    setOpen(false);
                  }}
                  className="py-4"
                >
                  {m.toLowerCase().startsWith("gemini") ? <Gemini /> : null}
                  {m.toLowerCase().startsWith("openai") ? <OpenAI /> : null}
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
