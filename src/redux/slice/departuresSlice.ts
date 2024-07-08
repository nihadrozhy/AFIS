import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flight } from '../../models/flight';
import { fetchDepartureFlightsApi, fetchMoreDepartureFlightsApi } from '../../services/flightApi';
import { AppThunk } from '../store/store';
import { getDepartureFlightsByIata, insertFlight } from '../../utils/database';

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

const departuresSlice = createSlice({
  name: 'departures',
  initialState,
  reducers: {
    fetchDeparturesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDeparturesSuccess(state, action: PayloadAction<Flight[]>) {
      state.loading = false;
      state.flights = action.payload;
      state.error = null;
    },
    fetchDeparturesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    appendMoreDepartures(state, action: PayloadAction<Flight[]>) {
      state.loading = false;
      state.flights = [...state.flights, ...action.payload];
      state.error = null;
    },
  },
});

export const { fetchDeparturesStart, fetchDeparturesSuccess, fetchDeparturesFailure, appendMoreDepartures } = departuresSlice.actions;

export const fetchDepartureFlights = (dep_iata: string): AppThunk => async (dispatch: any) => {
  try {
    dispatch(fetchDeparturesStart());
    const flights = await fetchDepartureFlightsApi(dep_iata);
    
    // Insert fetched flights into SQLite
    for (const flight of flights) {
      await insertFlight(flight);
    }

    dispatch(fetchDeparturesSuccess(flights));
  } catch (error: any) {
    dispatch(fetchDeparturesFailure(error.message || 'Failed to fetch departure flights'));
  }
};

export const fetchMoreDepartureFlights = (dep_iata: string, page: number): AppThunk => async (dispatch: any) => {
  try {
    dispatch(fetchDeparturesStart());
    const flights = await fetchMoreDepartureFlightsApi(dep_iata, page);
    
    // Insert fetched flights into SQLite
    for (const flight of flights) {
      await insertFlight(flight);
    }

    dispatch(appendMoreDepartures(flights));
  } catch (error: any) {
    dispatch(fetchDeparturesFailure(error.message || 'Failed to fetch more departure flights'));
  }
};

// Fetch departure flights from SQLite by IATA code for offline mode
export const fetchDepartureFlightsOffline = (dep_iata: string): AppThunk => async (dispatch: any) => {
  try {
    dispatch(fetchDeparturesStart());
    const flights = await getDepartureFlightsByIata(dep_iata);
    dispatch(fetchDeparturesSuccess(flights));
  } catch (error: any) {
    dispatch(fetchDeparturesFailure(error.message || 'Failed to fetch departure flights'));
  }
};

export default departuresSlice.reducer;
