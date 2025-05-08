
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TravelForm from "@/components/TravelForm";
import TravelPlan from "@/components/TravelPlan";
import LoadingIndicator from "@/components/LoadingIndicator";
import { TravelFormData, TravelPlanData } from "@/types/travel";
import { generateTravelPlan } from "@/utils/geminiApi";
import { useToast } from "@/components/ui/use-toast";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ChatDialog } from "@/components/ChatDialog";
import { SettingsProvider, useSettings } from "@/contexts/SettingsContext";

const TravelPlanner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [travelPlan, setTravelPlan] = useState<TravelPlanData | null>(null);
  const { toast } = useToast();
  const { geminiApiKey, serpApiKey } = useSettings();

  const handleFormSubmit = async (formData: TravelFormData) => {
    setIsLoading(true);
    setTravelPlan(null);
    
    try {
      const plan = await generateTravelPlan(formData, geminiApiKey, serpApiKey);
      setTravelPlan(plan);
    } catch (error) {
      console.error("Error generating travel plan:", error);
      toast({
        title: "Error",
        description: "Failed to generate travel plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-900">Journey AI</h1>
          <div className="flex space-x-2">
            <ChatDialog travelPlan={travelPlan} />
            <SettingsDialog />
          </div>
        </div>
        
        <p className="text-lg text-sky-700 max-w-2xl mx-auto text-center mb-8">
          Plan your perfect trip with our AI travel assistant. Tell us your preferences, and we'll create a personalized itinerary just for you.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 shadow-md border-sky-200 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sky-800">Plan Your Journey</CardTitle>
              <CardDescription>Fill in your travel details below</CardDescription>
            </CardHeader>
            <CardContent>
              <TravelForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-md border-sky-200 min-h-[400px] bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sky-800">Your Travel Plan</CardTitle>
              <CardDescription>AI-generated itinerary based on your preferences</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <LoadingIndicator />
                  <p className="mt-4 text-sky-700">Crafting your perfect journey...</p>
                </div>
              ) : travelPlan ? (
                <TravelPlan plan={travelPlan} />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-sky-700">
                  <p>Fill in your travel details to generate a personalized itinerary.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <SettingsProvider>
      <TravelPlanner />
    </SettingsProvider>
  );
};

export default Index;
