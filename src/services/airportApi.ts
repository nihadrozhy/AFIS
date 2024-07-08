import axios from 'axios';
import { Airport } from '../models/airport';

const BASE_URL = 'https://api.aviowiki.com/free/airports';

export const fetchAirportsApi = async (): Promise<Airport[]> => {
    const response = await axios.get(`${BASE_URL}/search`);
    return response.data.content.map((airport: any) => ({
        name: airport.name,
        country: airport.country.name,
        icao: airport.icao,
        iata: airport.iata,
    }));
};

export const fetchAirportsBySearchApi = async (query: string): Promise<Airport[]> => {
    const response = await axios.get(`${BASE_URL}/search?query=${query}`);
    return response.data.content.map((airport: any) => ({
        name: airport.name,
        country: airport.country.name,
        icao: airport.icao,
        iata: airport.iata,
    }));
};

export const fetchMoreAirportsApi = async (query: string, page: number): Promise<Airport[]> => {
    const response = await axios.get(`${BASE_URL}/search?query=${query}&page=${page}`);
    return response.data.content.map((airport: any) => ({
        name: airport.name,
        country: airport.country.name,
        icao: airport.icao,
        iata: airport.iata,
    }));
};
