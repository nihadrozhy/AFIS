import axios from 'axios';
import { Flight } from '../models/flight';

const ACCESS_KEY = 'cfd1de5b2d87459b6a8c41a825d52205';
const BASE_URL = `http://api.aviationstack.com/v1/flights?access_key=${ACCESS_KEY}`;

const handleAxiosError = (error: any) => {
    if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.toJSON());
    } else {
        console.error('Unexpected error:', error);
    }
    throw new Error('Failed to fetch flight data');
};

export const fetchDepartureFlightsApi = async (dep_iata: string): Promise<Flight[]> => {
    try {
        const response = await axios.get(`${BASE_URL}&dep_iata=${dep_iata}`);
        return response.data.data.map((flight: any) => ({
            from: flight.departure.airport,
            to: flight.arrival.airport,
            flightNumber: flight.flight.number,
            airline: flight.airline.name,
            departureTime: new Date(flight.departure.scheduled),
            arrivalTime: new Date(flight.arrival.scheduled),
            status: 'departure',
            latitude: flight.live?.latitude ?? 0,
            longitude: flight.live?.longitude ?? 0,
            iata: dep_iata,
            flightStatus: flight.flight_status,
            aircraftTypeRegistration: flight.aircraft?.registration,
            aircraftTypeIata: flight.aircraft?.iata,
            aircraftTypeIcao: flight.aircraft?.icao,
            aircraftTypeIcao24: flight.aircraft?.icao24,
        }));
    } catch (error) {
        handleAxiosError(error);
        throw new Error('Failed to fetch more arrival flights');
    }
};

export const fetchMoreDepartureFlightsApi = async (dep_iata: string, page: number): Promise<Flight[]> => {
    try {
        const response = await axios.get(`${BASE_URL}&dep_iata=${dep_iata}&page=${page}`);
        return response.data.data.map((flight: any) => ({
            from: flight.departure.airport,
            to: flight.arrival.airport,
            flightNumber: flight.flight.number,
            airline: flight.airline.name,
            departureTime: new Date(flight.departure.scheduled),
            arrivalTime: new Date(flight.arrival.scheduled),
            status: 'depature',
            latitude: flight.live?.latitude ?? 0,
            longitude: flight.live?.longitude ?? 0,
            iata: dep_iata,
            flightStatus: flight.flight_status,
            aircraftTypeRegistration: flight.aircraft?.registration,
            aircraftTypeIata: flight.aircraft?.iata,
            aircraftTypeIcao: flight.aircraft?.icao,
            aircraftTypeIcao24: flight.aircraft?.icao24,
        }));
    } catch (error) {
        handleAxiosError(error);
        throw new Error('Failed to fetch more arrival flights');
    }
};

export const fetchArrivalFlightsApi = async (arr_iata: string): Promise<Flight[]> => {
    try {
        const response = await axios.get(`${BASE_URL}&arr_iata=${arr_iata}`);
        return response.data.data.map((flight: any) => ({
            from: flight.departure.airport,
            to: flight.arrival.airport,
            flightNumber: flight.flight.number,
            airline: flight.airline.name,
            departureTime: new Date(flight.departure.scheduled),
            arrivalTime: new Date(flight.arrival.scheduled),
            status: 'arrival',
            latitude: flight.live?.latitude ?? 0,
            longitude: flight.live?.longitude ?? 0,
            iata: arr_iata,
            flightStatus: flight.flight_status,
            aircraftTypeRegistration: flight.aircraft?.registration,
            aircraftTypeIata: flight.aircraft?.iata,
            aircraftTypeIcao: flight.aircraft?.icao,
            aircraftTypeIcao24: flight.aircraft?.icao24,
        }));
    } catch (error) {
        handleAxiosError(error);
        throw new Error('Failed to fetch more arrival flights');
    }
};

export const fetchMoreArrivalFlightsApi = async (arr_iata: string, page: number): Promise<Flight[]> => {
    try {
        const response = await axios.get(`${BASE_URL}&arr_iata=${arr_iata}&page=${page}`);
        return response.data.data.map((flight: any) => ({
            from: flight.departure.airport,
            to: flight.arrival.airport,
            flightNumber: flight.flight.number,
            airline: flight.airline.name,
            departureTime: new Date(flight.departure.scheduled),
            arrivalTime: new Date(flight.arrival.scheduled),
            status: 'arrival',
            latitude: flight.live?.latitude ?? 0,
            longitude: flight.live?.longitude ?? 0,
            flightStatus: flight.flight_status,
            iata: arr_iata,
            aircraftTypeRegistration: flight.aircraft?.registration,
            aircraftTypeIata: flight.aircraft?.iata,
            aircraftTypeIcao: flight.aircraft?.icao,
            aircraftTypeIcao24: flight.aircraft?.icao24,
        }));
    } catch (error) {
        handleAxiosError(error);
        throw new Error('Failed to fetch more arrival flights');
    }
};
