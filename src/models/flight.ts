export interface Flight {
    from?: string;
    to?: string;
    flightNumber?: string;
    airline?: string;
    departureTime?: string;
    arrivalTime?: string;
    status?: string;
    latitude?: number;
    longitude?: number;
    iata?: string;
    flightStatus?: string;
    aircraftTypeRegistration?: string;
    aircraftTypeIata?: string;
    aircraftTypeIcao?: string;
    aircraftTypeIcao24?: string;
}
export const FlightDetails: Flight[] = [
    {
        from: "San Francisco International",
        to: "Dallas/Fort Worth International",
        flightNumber: "100411",
        airline: "American Airlines01",
        departureTime: "2019-12-12T04:20:00+00:00",
        arrivalTime: "2019-12-12T04:20:00+00:00",
        status: 'arrival',
        latitude: 36.28560000,
        longitude: -106.80700000,
        iata: "DFW",
        flightStatus: "active",
        aircraftTypeRegistration: "N160AN",
        aircraftTypeIata: "A321",
        aircraftTypeIcao: "A321",
        aircraftTypeIcao24: "A0F1BB",
    },
    {
        from: "San Francisco International",
        to: "Dallas/Fort Worth International",
        flightNumber: "100422",
        airline: "American Airlines02",
        departureTime: "2019-12-12T04:20:00+00:00",
        arrivalTime: "2019-12-12T04:20:00+00:00",
        status: 'arrival',
        latitude: 36.28560000,
        longitude: -106.80700000,
        iata: "DFW",
        flightStatus: "active",
        aircraftTypeRegistration: "N160AN",
        aircraftTypeIata: "A321",
        aircraftTypeIcao: "A321",
        aircraftTypeIcao24: "A0F1BB",
    },
    {
        from: "San Francisco International",
        to: "Dallas/Fort Worth International",
        flightNumber: "100433",
        airline: "American Airlines03",
        departureTime: "2019-12-12T04:20:00+00:00",
        arrivalTime: "2019-12-12T04:20:00+00:00",
        status: 'arrival',
        latitude: 36.28560000,
        longitude: -106.80700000,
        iata: "DFW",
        flightStatus: "active",
        aircraftTypeRegistration: "N160AN",
        aircraftTypeIata: "A321",
        aircraftTypeIcao: "A321",
        aircraftTypeIcao24: "A0F1BB",
    },

]