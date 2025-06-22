import {
  MODELS,
  MODEL_NAMES,
  PROVIDER_NAME_MAP,
  Providers,
} from "@/lib/models";
import { cn } from "@/lib/utils";
import { useModel } from "@/stores/model";
import { Brain, Check, ChevronDown, Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ModelCapability } from "./capability";

export function ModelSwitcher() {
  const [open, setOpen] = useState(false);
  const { model, setModel } = useModel();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          {MODEL_NAMES.find((m) => model === m)}
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[500px]" align="start">
        <Command defaultValue={model}>
          <CommandInput placeholder="Search models..." className="h-9" />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>

            {Object.entries(MODELS).map(([provider, models]) => (
              <CommandGroup
                heading={PROVIDER_NAME_MAP[provider as Providers]}
                key={provider}
              >
                {models.map((m) => (
                  <CommandItem
                    key={m.name}
                    value={m.name}
                    onSelect={(currentValue) => {
                      setModel(currentValue);
                      setOpen(false);
                    }}
                  >
                    <m.icon />
                    <span className="text-xs">{m.name}</span>
                    <Check
                      className={cn(
                        "ml-2",
                        model === m.name ? "opacity-100" : "opacity-0"
                      )}
                    />

                    <div className="ml-auto flex items-center gap-2">
                      {m.caps.map((cap) => (
                        <ModelCapability
                          key={cap}
                          name={cap}
                          icon={cap === "reasoning" ? <Brain /> : <Eye />}
                        />
                      ))}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
