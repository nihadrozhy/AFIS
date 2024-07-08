import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flight } from '../../models/flight';
import { RootState } from '../store/store';


interface FlightDetailsState {
    flights: Flight[];
}

const initialState: FlightDetailsState = {
    flights: [],
};

const flightDetailsSlice = createSlice({
    name: 'flightsDetails',
    initialState,
    reducers: {
        addFlightDetails: (state, action: PayloadAction<Flight>) => {
            state.flights.push(action.payload);
        },
        removeFlightDetails: (state, action: PayloadAction<string>) => {
            state.flights = state.flights.filter((flight) => flight.flightNumber !== action.payload);
        },
    },
});

export const { addFlightDetails, removeFlightDetails } = flightDetailsSlice.actions;
export const selectFlights = (state: RootState) => state.flights.flights;
export default flightDetailsSlice.reducer;
