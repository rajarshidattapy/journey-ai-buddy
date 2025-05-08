
export interface TravelFormData {
  source: string;
  destination: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  budget: string;
  travelers: number;
  interests: string;
}

export interface TravelPlanData {
  summary: {
    source: string;
    destination: string;
    duration: string;
    bestTimeToVisit: string;
  };
  budget: {
    total: string;
    accommodation: string;
    transportation: string;
    foodAndActivities: string;
  };
  itinerary: Array<{
    day: number;
    title: string;
    activities: Array<{
      time: string;
      title: string;
      description: string;
    }>;
  }>;
  recommendations: Array<{
    category: string;
    items: string[];
  }>;
}
