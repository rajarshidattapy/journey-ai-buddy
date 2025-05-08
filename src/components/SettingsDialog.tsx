
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/contexts/SettingsContext";
import { Settings } from "lucide-react";
import { toast } from "sonner";

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const { geminiApiKey, serpApiKey, setGeminiApiKey, setSerpApiKey } = useSettings();
  const [tempGeminiKey, setTempGeminiKey] = useState(geminiApiKey);
  const [tempSerpKey, setTempSerpKey] = useState(serpApiKey);

  const handleSave = () => {
    setGeminiApiKey(tempGeminiKey);
    setSerpApiKey(tempSerpKey);
    toast.success("Settings saved successfully");
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-10 rounded-full"
        onClick={() => setOpen(true)}
      >
        <Settings className="h-5 w-5" />
        <span className="sr-only">Settings</span>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>API Settings</DialogTitle>
            <DialogDescription>
              Enter your API keys to use with the travel planner.
              Keys are stored locally in your browser.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="geminiKey">Gemini API Key</Label>
              <Input
                id="geminiKey"
                type="password"
                value={tempGeminiKey}
                onChange={(e) => setTempGeminiKey(e.target.value)}
                placeholder="Enter Gemini API key"
              />
              <p className="text-xs text-muted-foreground">
                Used for generating travel plans. Get a key from{" "}
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline text-sky-600"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="serpKey">SerpAPI Key</Label>
              <Input
                id="serpKey"
                type="password"
                value={tempSerpKey}
                onChange={(e) => setTempSerpKey(e.target.value)}
                placeholder="Enter SerpAPI key"
              />
              <p className="text-xs text-muted-foreground">
                Used for fetching flight information. Get a key from{" "}
                <a 
                  href="https://serpapi.com/manage-api-key" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline text-sky-600"
                >
                  SerpAPI
                </a>
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
