import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);

  const handleSaveSettings = () => {
    // Here you would typically save these settings to a database
    // For now, we'll just show a success message
    toast.success("Settings saved successfully");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Email: {user?.email}
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Timer Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Work Duration (minutes)
              </label>
              <Input
                type="number"
                value={workDuration}
                onChange={(e) => setWorkDuration(Number(e.target.value))}
                min="1"
                max="60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Break Duration (minutes)
              </label>
              <Input
                type="number"
                value={breakDuration}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
                min="1"
                max="30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Long Break Duration (minutes)
              </label>
              <Input
                type="number"
                value={longBreakDuration}
                onChange={(e) => setLongBreakDuration(Number(e.target.value))}
                min="1"
                max="60"
              />
            </div>

            <Button onClick={handleSaveSettings} className="w-full">
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;