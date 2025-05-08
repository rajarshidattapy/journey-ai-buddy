
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TravelPlanData } from "@/types/travel";
import { MapPin, Calendar, DollarSign, Plane, Clock, CalendarClock, Ticket } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface TravelPlanProps {
  plan: TravelPlanData;
}

const TravelPlan = ({ plan }: TravelPlanProps) => {
  const { toast } = useToast();
  
  // Helper function to format minutes into hours and minutes
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Helper function to format airport timestamps
  const formatAirportTime = (timeString: string): string => {
    try {
      return format(parseISO(timeString), "MMM d, h:mm a");
    } catch (e) {
      return timeString;
    }
  };

  const handleBookNow = () => {
    toast({
      title: "Booking Initiated",
      description: `Your trip to ${plan.summary.destination} is being processed.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-sky-900">Your Travel Plan</h2>
        <Button 
          onClick={handleBookNow}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          size="lg"
        >
          <Ticket className="mr-2" />
          Book Now
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-sky-50 border-sky-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-sky-700" />
              <h3 className="font-medium text-sky-900">Trip Summary</h3>
            </div>
            <div className="space-y-2 text-sky-800">
              <p><span className="font-medium">From:</span> {plan.summary.source}</p>
              <p><span className="font-medium">To:</span> {plan.summary.destination}</p>
              <p><span className="font-medium">Duration:</span> {plan.summary.duration}</p>
              <p><span className="font-medium">Best time to visit:</span> {plan.summary.bestTimeToVisit}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-sky-50 border-sky-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-sky-700" />
              <h3 className="font-medium text-sky-900">Budget</h3>
            </div>
            <div className="space-y-2 text-sky-800">
              <p><span className="font-medium">Total Budget:</span> {plan.budget.total}</p>
              <p><span className="font-medium">Accommodations:</span> {plan.budget.accommodation}</p>
              <p><span className="font-medium">Transportation:</span> {plan.budget.transportation}</p>
              <p><span className="font-medium">Food & Activities:</span> {plan.budget.foodAndActivities}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {plan.transportation && (
        <>
          <Separator className="bg-sky-200" />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-sky-700" />
              <h3 className="text-lg font-semibold text-sky-900">Transportation Options</h3>
            </div>
            
            {plan.transportation.best_flights.map((flight, index) => (
              <Card key={index} className="bg-white border-sky-100 overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      {flight.airline_logo && (
                        <img src={flight.airline_logo} alt={`${flight.type} flight`} className="h-6" />
                      )}
                      <span className="font-medium">{flight.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sky-700">${flight.price}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatDuration(flight.total_duration)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {flight.flights.map((segment, segIndex) => (
                      <div key={segIndex} className="border-l-2 border-sky-300 pl-4 py-2">
                        <div className="flex justify-between mb-2">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center">
                              <span className="font-semibold text-sky-800">
                                {segment.departure_airport.id}
                              </span>
                              <span className="mx-1 text-gray-400">→</span>
                              <span className="font-semibold text-sky-800">
                                {segment.arrival_airport.id}
                              </span>
                              <span className="ml-2 text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded">
                                {segment.flight_number}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatAirportTime(segment.departure_airport.time)} - {formatAirportTime(segment.arrival_airport.time)}
                              {segment.overnight && <span className="ml-1 text-xs text-amber-600">(Overnight)</span>}
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <div className="font-medium">{segment.airline}</div>
                            <div className="text-gray-500">{segment.airplane}</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {segment.extensions && segment.extensions.map((ext, extIndex) => (
                            <span key={extIndex} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                              {ext}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {flight.layovers && flight.layovers.length > 0 && (
                      <div className="mt-2 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <CalendarClock className="h-4 w-4" />
                          <span>Layovers:</span>
                        </div>
                        <ul className="list-disc list-inside pl-3 text-gray-600">
                          {flight.layovers.map((layover, layoverIndex) => (
                            <li key={layoverIndex} className="mt-1">
                              {layover.name} ({layover.id}) - {formatDuration(layover.duration)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <Separator className="bg-sky-200" />
      
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-sky-700" />
          <h3 className="text-lg font-semibold text-sky-900">Itinerary</h3>
        </div>
        
        {plan.itinerary.map((day, index) => (
          <Card key={index} className="bg-white border-sky-100">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-sky-800 mb-3">Day {day.day}: {day.title}</h4>
              <div className="space-y-4">
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="border-l-2 border-sky-300 pl-4 py-1">
                    <h5 className="font-medium text-sky-700">{activity.time} - {activity.title}</h5>
                    <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="bg-sky-200" />
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-sky-700" />
          <h3 className="text-lg font-semibold text-sky-900">Recommendations</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.recommendations.map((rec, index) => (
            <Card key={index} className="bg-white border-sky-100">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-sky-800">{rec.category}</h4>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                  {rec.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button 
          onClick={handleBookNow}
          className="bg-purple-600 hover:bg-purple-700 text-white w-full md:w-auto"
          size="lg"
        >
          <Ticket className="mr-2" />
          Book Now
        </Button>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800 text-sm">
        <p className="italic">This travel plan was generated by AI based on your preferences. 
        You may want to verify details like prices, opening hours, and availability before finalizing your trip.</p>
      </div>
    </div>
  );
};

export default TravelPlan;
