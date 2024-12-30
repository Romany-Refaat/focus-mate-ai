import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type SessionTypes = "work" | "break" | "longBreak";

interface SessionTypeProps {
  currentType: SessionTypes;
  onTypeChange: (type: SessionTypes) => void;
}

export const SessionType = ({ currentType, onTypeChange }: SessionTypeProps) => {
  return (
    <div className="flex gap-2">
      {[
        { type: "work" as const, label: "Work" },
        { type: "break" as const, label: "Break" },
        { type: "longBreak" as const, label: "Long break" },
      ].map(({ type, label }) => (
        <Button
          key={type}
          variant="ghost"
          onClick={() => onTypeChange(type)}
          className={cn(
            "px-6",
            currentType === type && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};