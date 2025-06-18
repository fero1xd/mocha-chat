import { CircleAlert } from "lucide-react";

export function Error({ message }: { message: string }) {
  return (
    <div className="py-3 text-red-600 flex items-center gap-4">
      <CircleAlert size={20} aria-hidden="true" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
