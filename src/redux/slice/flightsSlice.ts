import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flight } from '../../models/flight';
import { fetchArrivalFlightsApi, fetchDepartureFlightsApi, fetchMoreArrivalFlightsApi, fetchMoreDepartureFlightsApi } from '../../services/flightApi';
import { AppThunk } from '../store/store';
import { getArrivalFlightsByIata, getDepartureFlightsByIata, insertFlight } from '../../utils/database';

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

const flightSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    fetchFlightsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchFlightsSuccess(state, action: PayloadAction<Flight[]>) {
      state.loading = false;
      state.flights = action.payload;
      state.error = null;
    },
    fetchFlightsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    appendMoreFlights(state, action: PayloadAction<Flight[]>) {
      state.loading = false;
      state.flights = [...state.flights, ...action.payload];
      state.error = null;
    },
  },
});

export const { fetchFlightsStart, fetchFlightsSuccess, fetchFlightsFailure, appendMoreFlights } = flightSlice.actions;

export const fetchDepartureFlights = (dep_iata: string): AppThunk => async (dispatch: any) => {
  try {
    dispatch(fetchFlightsStart());
    const arrflights = await fetchDepartureFlightsApi(dep_iata);
    
    // Insert fetched flights into SQLite
    for (const flight of arrflights) {
      await insertFlight(flight);
    }

    dispatch(fetchFlightsSuccess(arrflights));
  } catch (error: any) {
    dispatch(fetchFlightsFailure(error.message || 'Failed to fetch departure flights'));
  }
};

export const fetchArrivalFlights = (arr_iata: string): AppThunk => async (dispatch: any) => {
  try {
    dispatch(fetchFlightsStart());
    const flights = await fetchArrivalFlightsApi(arr_iata);
    
    // Insert fetched flights into SQLite
    for (const flight of flights) {
      await insertFlight(flight);
    }

    dispatch(fetchFlightsSuccess(flights));
  } catch (error: any) {
    dispatch(fetchFlightsFailure(error.message || 'Failed to fetch arrival flights'));
  }
};

export const fetchMoreDepartureFlights = (dep_iata: string, page: number): AppThunk => async (dispatch: any) => {
  try {
    dispatch(fetchFlightsStart());
    const flights = await fetchMoreDepartureFlightsApi(dep_iata, page);
    
    // Insert fetched flights into SQLite
    for (const flight of flights) {
      await insertFlight(flight);
    }

    dispatch(appendMoreFlights(flights));
  } catch (error: any) {
    dispatch(fetchFlightsFailure(error.message || 'Failed to fetch more departure flights'));
  }
};

export const fetchMoreArrivalFlights = (arr_iata: string, page: number): AppThunk => async (dispatch: any) => {
  try {
    dispatch(fetchFlightsStart());
    const flights = await fetchMoreArrivalFlightsApi(arr_iata, page);
    
    // Insert fetched flights into SQLite
    for (const flight of flights) {
      await insertFlight(flight);
    }

    dispatch(appendMoreFlights(flights));
  } catch (error: any) {
    dispatch(fetchFlightsFailure(error.message || 'Failed to fetch more arrival flights'));
  }
};

// Fetch departure flights from SQLite by IATA code for offline mode
export const fetchDepartureFlightsOffline = (dep_iata: string): AppThunk => async (dispatch: any) => {
  try {
    dispatch(fetchFlightsStart());
    const flights = await getDepartureFlightsByIata(dep_iata);
    dispatch(fetchFlightsSuccess(flights));
  } catch (error: any) {
    dispatch(fetchFlightsFailure(error.message || 'Failed to fetch departure flights'));
  }
};

// Fetch arrival flights from SQLite by IATA code for offline mode
export const fetchArrivalFlightsOffline = (arr_iata: string): AppThunk => async (dispatch: any) => {
  try {
    dispatch(fetchFlightsStart());
    const flights = await getArrivalFlightsByIata(arr_iata);
    dispatch(fetchFlightsSuccess(flights));
  } catch (error: any) {
    dispatch(fetchFlightsFailure(error.message || 'Failed to fetch arrival flights'));
  }
};

export default flightSlice.reducer;
