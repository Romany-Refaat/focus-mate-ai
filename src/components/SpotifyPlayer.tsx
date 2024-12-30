import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Music } from "lucide-react";

export const SpotifyPlayer = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn(
      "fixed bottom-4 left-4 bg-card rounded-lg transition-all duration-300",
      isExpanded ? "w-80" : "w-auto"
    )}>
      <div className="p-4">
        {isExpanded ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Wanna Play some music?</h3>
            <div className="aspect-square w-full bg-muted rounded-md" />
            <div className="space-y-2">
              <h4 className="font-medium">Music Title</h4>
              <p className="text-sm text-muted-foreground">
                Lorem ipsum, text. Lorem ipsum, text. Lorem ipsum, text
              </p>
            </div>
            <div className="flex justify-between items-center">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(true)}
          >
            <Music className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
};