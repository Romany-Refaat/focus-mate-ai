import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type SessionTypes = "work" | "break" | "longBreak";

interface SessionTypeProps {
  currentType: SessionTypes;
  onTypeChange: (type: SessionTypes) => void;
}

export const SessionType = ({ currentType, onTypeChange }: SessionTypeProps) => {
  return (
    <div className="flex gap-8 text-lg">
      {[
        { type: "work" as const, label: "Work" },
        { type: "break" as const, label: "Break" },
        { type: "longBreak" as const, label: "Long break" },
      ].map(({ type, label }) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={cn(
            "text-muted-foreground hover:text-primary transition-colors relative pb-2",
            currentType === type && "text-primary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};