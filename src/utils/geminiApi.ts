
import { TravelFormData, TravelPlanData, TransportationDetails } from "@/types/travel";
import { format } from "date-fns";

// We'll prompt the user for their API key since we can't store it securely in the frontend
let geminiApiKey = "";

// Mock transportation data from SerpAPI
const mockTransportationData: TransportationDetails = {
  best_flights: [
    {
      flights: [
        {
          departure_airport: {
            name: "Indira Gandhi International Airport",
            id: "DEL",
            time: "2025-05-08 23:30"
          },
          arrival_airport: {
            name: "Suvarnabhumi Airport",
            id: "BKK",
            time: "2025-05-09 05:25"
          },
          duration: 265,
          airplane: "Airbus A350",
          airline: "THAI",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/TG.png",
          travel_class: "Economy",
          flight_number: "TG 316",
          legroom: "32 in",
          extensions: [
            "Above average legroom (32 in)",
            "In-seat power & USB outlets",
            "On-demand video",
            "Carbon emissions estimate: 245 kg"
          ],
          overnight: true
        },
        {
          departure_airport: {
            name: "Suvarnabhumi Airport",
            id: "BKK",
            time: "2025-05-09 07:45"
          },
          arrival_airport: {
            name: "Noi Bai International Airport",
            id: "HAN",
            time: "2025-05-09 09:35"
          },
          duration: 110,
          airplane: "Boeing 787",
          airline: "THAI",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/TG.png",
          travel_class: "Economy",
          flight_number: "TG 560",
          legroom: "32 in",
          extensions: [
            "Above average legroom (32 in)",
            "Wi-Fi for a fee",
            "In-seat power & USB outlets",
            "On-demand video",
            "Carbon emissions estimate: 103 kg"
          ]
        }
      ],
      layovers: [
        {
          duration: 140,
          name: "Suvarnabhumi Airport",
          id: "BKK"
        }
      ],
      total_duration: 515,
      carbon_emissions: {
        this_flight: 349000,
        typical_for_this_route: 225000,
        difference_percent: 55
      },
      price: 313,
      type: "One way",
      airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/TG.png",
      booking_token: "WyJDalJJTVVSa1NVTnJVWGMxWHpoQlFuTnZURUZDUnkwdExTMHRMUzB0TFMxd1ptNW1OMEZCUVVGQlIyZGpaemhSUkRGa2REUkJFZ3RVUnpNeE5ueFVSelUyTUJvTENKNzBBUkFDR2dOVlUwUTRISENlOUFFPSIsW1siREVMIiwiMjAyNS0wNS0wOCIsIkJLSyIsbnVsbCwiVEciLCIzMTYiXSxbIkJLSyIsIjIwMjUtMDUtMDkiLCJIQU4iLG51bGwsIlRHIiwiNTYwIl1dXQ=="
    },
    {
      flights: [
        {
          departure_airport: {
            name: "Indira Gandhi International Airport",
            id: "DEL",
            time: "2025-05-08 18:00"
          },
          arrival_airport: {
            name: "Netaji Subhash Chandra Bose International Airport",
            id: "CCU",
            time: "2025-05-08 20:15"
          },
          duration: 135,
          airplane: "Airbus A321neo",
          airline: "IndiGo",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
          travel_class: "Economy",
          flight_number: "6E 2057",
          legroom: "28 in",
          extensions: [
            "Below average legroom (28 in)",
            "Carbon emissions estimate: 91 kg"
          ],
          often_delayed_by_over_30_min: true
        },
        {
          departure_airport: {
            name: "Netaji Subhash Chandra Bose International Airport",
            id: "CCU",
            time: "2025-05-08 21:45"
          },
          arrival_airport: {
            name: "Noi Bai International Airport",
            id: "HAN",
            time: "2025-05-09 02:10"
          },
          duration: 175,
          airplane: "Airbus A320neo",
          airline: "IndiGo",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
          travel_class: "Economy",
          flight_number: "6E 1631",
          legroom: "28 in",
          extensions: [
            "Below average legroom (28 in)",
            "Carbon emissions estimate: 122 kg"
          ],
          overnight: true
        }
      ],
      layovers: [
        {
          duration: 90,
          name: "Netaji Subhash Chandra Bose International Airport",
          id: "CCU"
        }
      ],
      total_duration: 400,
      carbon_emissions: {
        this_flight: 214000,
        typical_for_this_route: 225000,
        difference_percent: -5
      },
      price: 366,
      type: "One way",
      airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
      booking_token: "WyJDalJJTVVSa1NVTnJVWGMxWHpoQlFuTnZURUZDUnkwdExTMHRMUzB0TFMxd1ptNW1OMEZCUVVGQlIyZGpaemhSUkRGa2REUkJFZzAyUlRJd05UZDhOa1V4TmpNeEdnc0l5NTBDRUFJYUExVlRSRGdjY011ZEFnPT0iLFtbIkRFTCIsIjIwMjUtMDUtMDgiLCJDQ1UiLG51bGwsIjZFIiwiMjA1NyJdLFsiQ0NVIiwiMjAyNS0wNS0wOCIsIkhBTiIsbnVsbCwiNkUiLCIxNjMxIl1dXQ=="
    },
    {
      flights: [
        {
          departure_airport: {
            name: "Indira Gandhi International Airport",
            id: "DEL",
            time: "2025-05-08 22:40"
          },
          arrival_airport: {
            name: "Hong Kong International Airport",
            id: "HKG",
            time: "2025-05-09 06:40"
          },
          duration: 330,
          airplane: "Boeing 777",
          airline: "Cathay Pacific",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/CX.png",
          travel_class: "Premium Economy",
          flight_number: "CX 698",
          extensions: [
            "Extra reclining seat",
            "Wi-Fi for a fee",
            "In-seat power & USB outlets",
            "On-demand video",
            "Carbon emissions estimate: 454 kg"
          ],
          overnight: true
        },
        {
          departure_airport: {
            name: "Hong Kong International Airport",
            id: "HKG",
            time: "2025-05-09 07:45"
          },
          arrival_airport: {
            name: "Noi Bai International Airport",
            id: "HAN",
            time: "2025-05-09 08:50"
          },
          duration: 125,
          airplane: "Airbus A321neo",
          airline: "Hong Kong Express",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/UO.png",
          travel_class: "Economy",
          flight_number: "UO 550",
          ticket_also_sold_by: [
            "Cathay Pacific"
          ],
          legroom: "28 in",
          extensions: [
            "Below average legroom (28 in)",
            "Carbon emissions estimate: 75 kg"
          ]
        }
      ],
      layovers: [
        {
          duration: 65,
          name: "Hong Kong International Airport",
          id: "HKG"
        }
      ],
      total_duration: 520,
      carbon_emissions: {
        this_flight: 530000,
        typical_for_this_route: 225000,
        difference_percent: 136
      },
      price: 800,
      type: "One way",
      airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/multi.png",
      booking_token: "WyJDalJJTVVSa1NVTnJVWGMxWHpoQlFuTnZURUZDUnkwdExTMHRMUzB0TFMxd1ptNW1OMEZCUVVGQlIyZGpaemhSUkRGa2REUkJFZ3REV0RZNU9IeFZUelUxTUJvTENON3dCQkFDR2dOVlUwUTRISERlOEFRPSIsW1siREVMIiwiMjAyNS0wNS0wOCIsIkhLRyIsbnVsbCwiQ1giLCI2OTgiXSxbIkhLRyIsIjIwMjUtMDUtMDkiLCJIQU4iLG51bGwsIlVPIiwiNTUwIl1dXQ=="
    }
  ]
};

export async function generateTravelPlan(formData: TravelFormData): Promise<TravelPlanData> {
  if (!geminiApiKey) {
    const userInput = window.prompt("Please enter your Gemini API key to generate travel plans:", "");
    geminiApiKey = userInput || "";
    
    if (!geminiApiKey) {
      throw new Error("API key is required to generate travel plans");
    }
  }

  // Format the dates properly
  const startDateStr = formData.startDate ? format(formData.startDate, "MMM d, yyyy") : "";
  const endDateStr = formData.endDate ? format(formData.endDate, "MMM d, yyyy") : "";

  // Create a prompt for the Gemini model
  const promptText = `
    You are a professional travel planner. Please create a detailed travel plan based on the following information:
    
    Source: ${formData.source}
    Destination: ${formData.destination}
    Travel Dates: ${startDateStr} to ${endDateStr}
    Budget: ${formData.budget}
    Number of Travelers: ${formData.travelers}
    Interests: ${formData.interests}

    Please provide a detailed itinerary for the trip, including:
    1. Trip summary (source, destination, duration, best time to visit)
    2. Budget breakdown (accommodation, transportation, food and activities)
    3. Day-by-day itinerary with activities
    4. Recommendations (where to eat, what to see, local tips, etc.)

    Format your response as JSON with the following structure:
    {
      "summary": {
        "source": "...",
        "destination": "...",
        "duration": "X days",
        "bestTimeToVisit": "..."
      },
      "budget": {
        "total": "...",
        "accommodation": "...",
        "transportation": "...",
        "foodAndActivities": "..."
      },
      "itinerary": [
        {
          "day": 1,
          "title": "...",
          "activities": [
            {
              "time": "Morning",
              "title": "...",
              "description": "..."
            },
            {
              "time": "Afternoon",
              "title": "...",
              "description": "..."
            },
            {
              "time": "Evening",
              "title": "...",
              "description": "..."
            }
          ]
        }
        // more days...
      ],
      "recommendations": [
        {
          "category": "Restaurants",
          "items": ["...", "...", "..."]
        },
        {
          "category": "Local Tips",
          "items": ["...", "...", "..."]
        }
        // more categories...
      ]
    }

    Include specific details, suggestions, and tips that would be useful for the traveler.
    Keep the output as JSON only, without any markdown, explanations, or text outside of the JSON.
  `;

  try {
    // Make request to Gemini API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": geminiApiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: promptText
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the text response from the Gemini API
    const content = data.candidates[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error("No content returned from the Gemini API");
    }
    
    // Find and extract the JSON part of the response
    const jsonMatch = content.match(/(\{[\s\S]*\})/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;
    
    try {
      // Parse the JSON string into a JavaScript object
      const travelPlan = JSON.parse(jsonString) as TravelPlanData;
      
      // Add transportation data if requested
      if (formData.includeTransportation) {
        travelPlan.transportation = mockTransportationData;
      }
      
      return travelPlan;
    } catch (error) {
      console.error("Failed to parse Gemini response as JSON:", error);
      console.log("Raw content:", content);
      
      // If we can't parse the JSON, create a fallback response
      return createFallbackResponse(formData);
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

// Fallback function in case the API response can't be parsed correctly
function createFallbackResponse(formData: TravelFormData): TravelPlanData {
  const startDateStr = formData.startDate ? format(formData.startDate, "MMM d, yyyy") : "";
  const endDateStr = formData.endDate ? format(formData.endDate, "MMM d, yyyy") : "";
  
  const fallbackResponse: TravelPlanData = {
    summary: {
      source: formData.source,
      destination: formData.destination,
      duration: `${formData.startDate && formData.endDate ? Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0} days`,
      bestTimeToVisit: "Information not available"
    },
    budget: {
      total: formData.budget,
      accommodation: "40% of budget",
      transportation: "30% of budget",
      foodAndActivities: "30% of budget"
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival Day",
        activities: [
          {
            time: "Morning",
            title: "Arrival and Check-in",
            description: "Arrive at your destination and check into your accommodation."
          },
          {
            time: "Afternoon",
            title: "Local Exploration",
            description: "Take a walk around the local area to get oriented."
          },
          {
            time: "Evening",
            title: "Welcome Dinner",
            description: "Enjoy a local restaurant to sample the cuisine."
          }
        ]
      },
      {
        day: 2,
        title: "Exploring the Highlights",
        activities: [
          {
            time: "Morning",
            title: "Main Attractions",
            description: "Visit the top attractions in the destination."
          },
          {
            time: "Afternoon",
            title: "Cultural Experience",
            description: "Immerse yourself in the local culture."
          },
          {
            time: "Evening",
            title: "Leisure Time",
            description: "Relax and enjoy the evening at your leisure."
          }
        ]
      }
    ],
    recommendations: [
      {
        category: "Places to Eat",
        items: ["Research local restaurants", "Try local specialties", "Ask your accommodation for recommendations"]
      },
      {
        category: "Things to See",
        items: ["Main tourist attractions", "Off-the-beaten-path locations", "Natural wonders in the area"]
      },
      {
        category: "Local Tips",
        items: ["Learn a few local phrases", "Respect local customs", "Check local transportation options"]
      }
    ]
  };
  
  // Add transportation data if requested
  if (formData.includeTransportation) {
    fallbackResponse.transportation = mockTransportationData;
  }
  
  return fallbackResponse;
}
