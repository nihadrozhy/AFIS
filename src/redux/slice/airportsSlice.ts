import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Airport } from '../../models/airport';
import { fetchAirportsApi, fetchAirportsBySearchApi, fetchMoreAirportsApi } from '../../services/airportApi';
import { AppThunk } from '../store/store';
import { insertAirport, getAirports as getAirportsFromDb, searchAirports } from '../../utils/database';

interface AirportState {
  airports: Airport[];
  loading: boolean;
  error: string | null;
}

const initialState: AirportState = {
  airports: [],
  loading: false,
  error: null,
};

const airportSlice = createSlice({
  name: 'airports',
  initialState,
  reducers: {
    fetchAirportsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAirportsSuccess(state, action: PayloadAction<Airport[]>) {
      state.loading = false;
      state.airports = action.payload;
      state.error = null;
    },
    fetchAirportsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    appendMoreAirports(state, action: PayloadAction<Airport[]>) {
      state.loading = false;
      state.airports = [...state.airports, ...action.payload];
      state.error = null;
    },
  },
});

export const { fetchAirportsStart, fetchAirportsSuccess, fetchAirportsFailure, appendMoreAirports } = airportSlice.actions;

export const fetchAirports = (): AppThunk => async (dispatch: any) => {
  try {
    dispatch(fetchAirportsStart());
    const airports = await fetchAirportsApi();
    
    // Insert fetched airports into SQLite
    for (const airport of airports) {
      await insertAirport(airport);
    }

    dispatch(fetchAirportsSuccess(airports));
  } catch (error: any) {
    dispatch(fetchAirportsFailure(error.message || 'Failed to fetch airports'));
  }
};

export const fetchAirportsBySearch = (query: string): AppThunk => async (dispatch: any) => {
  try {
    dispatch(fetchAirportsStart());
    const airports = await fetchAirportsBySearchApi(query);
    
    // Insert fetched airports into SQLite
    for (const airport of airports) {
      await insertAirport(airport);
    }

    dispatch(fetchAirportsSuccess(airports));
  } catch (error: any) {
    dispatch(fetchAirportsFailure(error.message || 'Failed to fetch airports'));
  }
};

export const fetchMoreAirports = (query: string, page: number): AppThunk => async (dispatch: any) => {
  try {
    dispatch(fetchAirportsStart());
    const airports = await fetchMoreAirportsApi(query, page);
    
    // Insert fetched airports into SQLite
    for (const airport of airports) {
      await insertAirport(airport);
    }

    dispatch(appendMoreAirports(airports));
  } catch (error: any) {
    dispatch(fetchAirportsFailure(error.message || 'Failed to fetch airports'));
  }
};

// Fetch airports from SQLite for offline mode
export const fetchAirportsOffline = (): AppThunk => async (dispatch: any) => {
  try {
    dispatch(fetchAirportsStart());
    const airports = await getAirportsFromDb();
    dispatch(fetchAirportsSuccess(airports));
  } catch (error: any) {
    dispatch(fetchAirportsFailure(error.message || 'Failed to fetch airports'));
  }
};

// Fetch airports from SQLite for offline search
export const searchAirportsOffline = (query: string): AppThunk => async (dispatch: any) => {
  try {
    dispatch(fetchAirportsStart());
    const airports = await searchAirports(query);
    dispatch(fetchAirportsSuccess(airports));
  } catch (error: any) {
    dispatch(fetchAirportsFailure(error.message || 'Failed to search airports'));
  }
};

export default airportSlice.reducer;
