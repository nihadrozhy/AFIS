import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flight } from '../../models/flight';
import { fetchArrivalFlightsApi, fetchMoreArrivalFlightsApi } from '../../services/flightApi';
import { AppThunk } from '../store/store';
import { getArrivalFlightsByIata, insertFlight } from '../../utils/database';

interface FlightState {
  flights: Flight[];
  loading: boolean;
  error: string | null;
}

const initialState: FlightState = {
  flights: [],
  loading: false,
  error: null,
};

const arrivalsSlice = createSlice({
  name: 'arrivals',
  initialState,
  reducers: {
    fetchArrivalsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchArrivalsSuccess(state, action: PayloadAction<Flight[]>) {
      state.loading = false;
      state.flights = action.payload;
      state.error = null;
    },
    fetchArrivalsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    appendMoreArrivals(state, action: PayloadAction<Flight[]>) {
      state.loading = false;
      state.flights = [...state.flights, ...action.payload];
      state.error = null;
    },
  },
});

export const { fetchArrivalsStart, fetchArrivalsSuccess, fetchArrivalsFailure, appendMoreArrivals } = arrivalsSlice.actions;

export const fetchArrivalFlights = (arr_iata: string): AppThunk => async (dispatch: any) => {
  try {
    dispatch(fetchArrivalsStart());
    const flights = await fetchArrivalFlightsApi(arr_iata);
    
    // Insert fetched flights into SQLite
    for (const flight of flights) {
      await insertFlight(flight);
    }

    dispatch(fetchArrivalsSuccess(flights));
  } catch (error: any) {
    dispatch(fetchArrivalsFailure(error.message || 'Failed to fetch arrival flights'));
  }
};

export const fetchMoreArrivalFlights = (arr_iata: string, page: number): AppThunk => async (dispatch: any) => {
  try {
    dispatch(fetchArrivalsStart());
    const flights = await fetchMoreArrivalFlightsApi(arr_iata, page);
    
    // Insert fetched flights into SQLite
    for (const flight of flights) {
      await insertFlight(flight);
    }

    dispatch(appendMoreArrivals(flights));
  } catch (error: any) {
    dispatch(fetchArrivalsFailure(error.message || 'Failed to fetch more arrival flights'));
  }
};

// Fetch arrival flights from SQLite by IATA code for offline mode
export const fetchArrivalFlightsOffline = (arr_iata: string): AppThunk => async (dispatch: any) => {
  try {
    dispatch(fetchArrivalsStart());
    const flights = await getArrivalFlightsByIata(arr_iata);
    dispatch(fetchArrivalsSuccess(flights));
  } catch (error: any) {
    dispatch(fetchArrivalsFailure(error.message || 'Failed to fetch arrival flights'));
  }
};

export default arrivalsSlice.reducer;
