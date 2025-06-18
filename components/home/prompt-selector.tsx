import { Code, GraduationCap, Library, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

const DEFAULT_PROMPTS = {
  create: [
    "Write a short story about a robot discovering emotions",
    "Help me outline a sci-fi novel set in a post-apocalyptic world",
    "Create a character profile for a complex villain with sympathetic motives",
    "Give me 5 creative writing prompts for flash fiction",
  ],
  explore: [
    "Good books for fans of Rick Rubin",
    "Countries ranked by number of corgis",
    "Most successful companies in the world",
    "How much does Claude cost?",
  ],
  code: [
    "Write code to invert a binary search tree in python",
    "What's the difference between Promise.all and Promise.allSettled?",
    "Explain React's useEffect cleanup function",
    "Best practices for error handling in async/await",
  ],
  learn: [
    "Beginner's guide to TypeScript",
    "Explain the CAP Theorem in distributed Systems",
    "Why is AI so expensive?",
    "Are black holes real?",
  ],
} as const;

type Prompts = keyof typeof DEFAULT_PROMPTS;

type Props = {
  onSelect: (prompt: string) => void;
};

export function PromptSelector({ onSelect }: Props) {
  const [selectedTab, setSelectedTab] = useState<Prompts>("create");
  return (
    <>
      <div className="flex flex-row flex-wrap gap-2.5 text-sm max-sm:justify-start">
        <Button
          className="rounded-full outline-1 outline-secondary/7  font-semibold"
          variant={selectedTab === "create" ? "default" : "secondary"}
          onClick={() => setSelectedTab("create")}
          size="lg"
        >
          <Sparkles />
          <div>Create</div>
        </Button>
        <Button
          className="rounded-full"
          size="lg"
          variant={selectedTab === "explore" ? "default" : "secondary"}
          onClick={() => setSelectedTab("explore")}
        >
          <Library />

          <div>Explore</div>
        </Button>
        <Button
          className="rounded-full"
          size="lg"
          variant={selectedTab === "code" ? "default" : "secondary"}
          onClick={() => setSelectedTab("code")}
        >
          <Code />

          <div>Code</div>
        </Button>
        <Button
          className="rounded-full"
          size="lg"
          variant={selectedTab === "learn" ? "default" : "secondary"}
          onClick={() => setSelectedTab("learn")}
        >
          <GraduationCap />
          <div>Learn</div>
        </Button>
      </div>
      <div className="flex flex-col text-foreground max-w-full overflow-x-auto">
        {DEFAULT_PROMPTS[selectedTab].map((prompt) => (
          <div
            className="flex items-start gap-2 border-t border-secondary/40 py-1 first:border-none "
            key={prompt}
          >
            <Button
              onClick={() => onSelect(prompt)}
              className="rounded-md py-2 justify-start text-secondary-foreground hover:bg-secondary/50 text-left w-full"
              variant={"ghost"}
              size="lg"
            >
              <span>{prompt}</span>
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
