import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TimerProps {
  duration: number;
  onComplete: () => void;
  isActive: boolean;
  onToggle: () => void;
}

export const Timer = ({ duration, onComplete, isActive, onToggle }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            clearInterval(interval);
            onComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setTimeLeft(duration);
    toast.success("Timer Reset");
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="timer-text text-foreground">
        {formatTime(timeLeft)}
      </div>
      <p className="text-muted-foreground text-lg">
        You will now start a {Math.floor(duration / 60)}:00 pomodoro, keep up the good work!
      </p>
      <Button
        variant="default"
        size="lg"
        onClick={onToggle}
        className="w-32 bg-primary hover:bg-primary/90"
      >
        {isActive ? "Pause" : "Start"}
      </Button>
    </div>
  );
};