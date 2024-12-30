import { useState, useCallback } from "react";
import { Timer } from "@/components/Timer";
import { FocusDetector } from "@/components/FocusDetector";
import { SessionType } from "@/components/SessionType";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type SessionTypes = "work" | "break" | "longBreak";

const DURATIONS = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

const Index = () => {
  const [sessionType, setSessionType] = useState<SessionTypes>("work");
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const handleSessionComplete = useCallback(() => {
    setIsActive(false);
    setCompletedSessions(prev => prev + 1);
    toast.success("Session completed! Take a break.");
  }, []);

  const handleFocusChange = useCallback((focused: boolean) => {
    setIsFocused(focused);
    if (!focused && isActive) {
      toast.warning("Please stay focused on your work!");
    }
  }, [isActive]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-12">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">MainFocus</h1>
          <Badge variant="outline" className="px-4 py-1">
            Sessions: {completedSessions}
          </Badge>
        </div>

        <div className="flex flex-col items-center gap-8">
          <SessionType
            currentType={sessionType}
            onTypeChange={(type) => {
              setSessionType(type);
              setIsActive(false);
            }}
          />

          <div className={cn(
            "p-12 rounded-2xl bg-card transition-all duration-300",
            isFocused && isActive && "focus-detected"
          )}>
            <Timer
              duration={DURATIONS[sessionType]}
              onComplete={handleSessionComplete}
              isActive={isActive}
              onToggle={() => setIsActive(!isActive)}
            />
          </div>

          <FocusDetector onFocusChange={handleFocusChange} />
        </div>
      </div>
    </div>
  );
};

export default Index;