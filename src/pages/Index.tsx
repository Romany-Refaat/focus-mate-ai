import { useState, useCallback } from "react";
import { Timer } from "@/components/Timer";
import { FocusDetector } from "@/components/FocusDetector";
import { SessionType } from "@/components/SessionType";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SpotifyPlayer } from "@/components/SpotifyPlayer";

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
  const [goal, setGoal] = useState("");
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  const handleSessionComplete = useCallback(() => {
    setIsActive(false);
    setCompletedSessions(prev => prev + 1);
  }, []);

  const handleFocusChange = useCallback((focused: boolean) => {
    setIsFocused(focused);
  }, []);

  const adjustTime = (amount: number) => {
    setMinutes(prev => Math.max(1, Math.min(60, prev + amount)));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl space-y-12">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => adjustTime(-1)}
              className="rounded-full bg-muted"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              <Input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="w-16 text-center bg-muted"
                min={1}
                max={60}
              />
              <span className="text-muted-foreground">:</span>
              <Input
                type="number"
                value={seconds}
                onChange={(e) => setSeconds(Number(e.target.value))}
                className="w-16 text-center bg-muted"
                min={0}
                max={59}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => adjustTime(1)}
              className="rounded-full bg-muted"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
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
              duration={minutes * 60 + seconds}
              onComplete={handleSessionComplete}
              isActive={isActive}
              onToggle={() => setIsActive(!isActive)}
            />
          </div>

          <Input
            placeholder="What is your goal for this session?"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="max-w-lg"
          />

          <FocusDetector onFocusChange={handleFocusChange} />
        </div>

        <SpotifyPlayer />
      </div>
    </div>
  );
};

export default Index;