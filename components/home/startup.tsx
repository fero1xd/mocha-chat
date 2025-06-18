import { useUser } from "@/hooks/use-jwt";
import { PromptSelector } from "./prompt-selector";

type Props = {
  onSelect: (prompt: string) => void;
};

export function Startup({ onSelect }: Props) {
  const { user } = useUser();

  return (
    <div className="flex-1 flex items-center">
      <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-10 pt-safe-offset-10">
        <div className="flex h-[calc(100vh-20rem)] items-start justify-center">
          <div className="w-full space-y-6 px-2 pt-[calc(max(15vh,2.5rem))] duration-300 animate-in fade-in-50 zoom-in-95 sm:px-8">
            <h2 className="text-3xl font-semibold">
              How can I help you{user?.name ? `, ${user.name}` : ""}?
            </h2>

            <PromptSelector onSelect={onSelect} />
          </div>
        </div>
      </div>
    </div>
  );
}
