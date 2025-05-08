
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TravelFormData } from "@/types/travel";

interface TravelFormProps {
  onSubmit: (data: TravelFormData) => void;
  isLoading: boolean;
}

const TravelForm = ({ onSubmit, isLoading }: TravelFormProps) => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [interests, setInterests] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      source,
      destination,
      startDate,
      endDate,
      budget,
      travelers: parseInt(travelers),
      interests,
    });
  };

  let dateRangeText = "Select travel dates";
  if (startDate && endDate) {
    dateRangeText = `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
  } else if (startDate) {
    dateRangeText = `${format(startDate, "MMM d, yyyy")} - Pick end date`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="source">Starting From</Label>
        <Input
          id="source"
          placeholder="e.g. New York"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          placeholder="e.g. Paris, France"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date-range">Travel Dates</Label>
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-range"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRangeText}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={startDate || new Date()}
              selected={{
                from: startDate,
                to: endDate,
              }}
              onSelect={(range) => {
                setStartDate(range?.from);
                setEndDate(range?.to);
                if (range?.to) {
                  setDatePickerOpen(false);
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="budget">Budget (USD)</Label>
        <Input
          id="budget"
          type="text"
          placeholder="e.g. $1000"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="travelers">Number of Travelers</Label>
        <Input
          id="travelers"
          type="number"
          min="1"
          max="20"
          value={travelers}
          onChange={(e) => setTravelers(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="interests">Your Interests</Label>
        <Textarea
          id="interests"
          placeholder="e.g. history, food, adventure, relaxation, museums, hiking..."
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          className="min-h-[80px]"
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-sky-600 hover:bg-sky-700" 
        disabled={isLoading || !source || !destination || !startDate || !endDate || !budget || !interests}
      >
        {isLoading ? "Generating Plan..." : "Plan My Journey"}
      </Button>
    </form>
  );
};

export default TravelForm;
