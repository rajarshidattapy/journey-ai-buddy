
export interface TravelFormData {
  source: string;
  destination: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  budget: string;
  travelers: number;
  interests: string;
  includeTransportation: boolean;
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
  transportation?: TransportationDetails;
}

export interface TransportationDetails {
  best_flights: Array<{
    flights: Array<{
      departure_airport: {
        name: string;
        id: string;
        time: string;
      };
      arrival_airport: {
        name: string;
        id: string;
        time: string;
      };
      duration: number;
      airplane: string;
      airline: string;
      airline_logo: string;
      travel_class: string;
      flight_number: string;
      legroom?: string;
      extensions?: string[];
      overnight?: boolean;
      often_delayed_by_over_30_min?: boolean;
      ticket_also_sold_by?: string[];
    }>;
    layovers?: Array<{
      duration: number;
      name: string;
      id: string;
    }>;
    total_duration: number;
    carbon_emissions: {
      this_flight: number;
      typical_for_this_route: number;
      difference_percent: number;
    };
    price: number;
    type: string;
    airline_logo: string;
    booking_token: string;
  }>;
}
