
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSettings } from "@/contexts/SettingsContext";
import { MessageCircle, Send } from "lucide-react";
import { TravelPlanData } from "@/types/travel";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatDialogProps {
  travelPlan: TravelPlanData | null;
}

export function ChatDialog({ travelPlan }: ChatDialogProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { geminiApiKey } = useSettings();

  // Add initial message when the dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    
    if (isOpen && messages.length === 0 && travelPlan) {
      setMessages([
        { 
          role: "assistant", 
          content: `Hello! I'm your travel assistant. I can answer questions about your trip to ${travelPlan.summary.destination}. What would you like to know?` 
        }
      ]);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading || !travelPlan) return;

    const userMessage = { role: "user" as const, content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Prepare context for the AI
      const travelContext = JSON.stringify({
        destination: travelPlan.summary.destination,
        duration: travelPlan.summary.duration,
        budget: travelPlan.budget.total,
        itinerary: travelPlan.itinerary.map(day => ({
          day: day.day,
          title: day.title
        }))
      });
      
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      // Call Gemini API
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApiKey
        },
        body: JSON.stringify({
          contents: [
            ...chatHistory,
            {
              role: "user",
              parts: [
                { 
                  text: `Travel Plan Context: ${travelContext}\n\nUser Question: ${inputValue}\n\nAnswer the user's question based on the travel plan context provided.` 
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Gemini API");
      }

      const data = await response.json();
      const assistantResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
      
      setMessages(prev => [...prev, { role: "assistant", content: assistantResponse }]);
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, there was an error processing your request. Please try again or check your API key in settings." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-10 rounded-full"
        onClick={() => handleOpenChange(true)}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="sr-only">Chat with AI assistant</span>
      </Button>
      
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Travel Assistant</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4 h-[60vh]">
            <div className="space-y-4 mb-4">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user' 
                        ? 'bg-sky-600 text-white' 
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-slate-100 text-slate-900">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce"></div>
                      <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:0.2s]"></div>
                      <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <DialogFooter className="mt-2">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                className="flex-1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your travel plan..."
                disabled={isLoading || !travelPlan}
              />
              <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim() || !travelPlan}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
