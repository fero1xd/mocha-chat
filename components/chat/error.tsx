import { CircleAlert } from "lucide-react";

export function Error({ message }: { message: string }) {
  return (
    <div className="py-5 px-4 text-red-500 flex items-center gap-4 bg-muted rounded-lg">
      <CircleAlert size={20} aria-hidden="true" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
