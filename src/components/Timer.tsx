import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
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
    toast({
      title: "Timer Reset",
      description: "Your timer has been reset to the original duration.",
    });
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="timer-text text-foreground">
        {formatTime(timeLeft)}
      </div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onToggle}
          className="w-32"
        >
          {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
          {isActive ? "Pause" : "Start"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleReset}
          className="w-32"
        >
          <RotateCcw className="mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};